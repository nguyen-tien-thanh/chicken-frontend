import { PrinterOutlined } from '@ant-design/icons';
import { useApiUrl, useCustom } from '@refinedev/core';
import {
  Button,
  Descriptions,
  Divider,
  Image,
  Modal,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import {
  SALE_STATUS_LABELS,
  type ISale,
  type ISaleItem,
  type SaleStatus,
} from '@/types';
import { formatMoney } from '@/utils';

interface IInvoice extends ISale {
  payment: {
    saleId: string;
    amount: number;
    id: string;
    qrUrl: string;
  };
}

const statusColor: Record<SaleStatus, string> = {
  PENDING: 'orange',
  PAID: 'green',
  CANCELLED: 'red',
};

interface Props {
  saleId: string | undefined;
}

export const SaleInvoiceModal = ({ saleId }: Props) => {
  const [open, setOpen] = useState(false);
  const apiUrl = useApiUrl();

  const { query: invoiceQuery } = useCustom<IInvoice>({
    url: `${apiUrl}/sales/${saleId}/invoice`,
    method: 'get',
    queryOptions: { enabled: false },
  });

  const invoice = invoiceQuery.data?.data;
  const fetching = invoiceQuery.isFetching;

  function handleOpen() {
    invoiceQuery.refetch().then(() => setOpen(true));
  }

  function handlePrint() {
    if (!invoice) return;

    const items = invoice.saleItems ?? [];
    const rows = items
      .map(
        (item: ISaleItem) => `
        <tr>
          <td>${item.product?.name ?? item.productId}</td>
          <td>${item.quantity}</td>
          <td>${item.quantityUnit}</td>
          <td style="text-align:right">${formatMoney(item.unitPrice)}</td>
          <td style="text-align:right;font-weight:bold">${formatMoney(item.amount)}</td>
        </tr>`,
      )
      .join('');

    const summaryLines = `
      <div class="sum-row"><span>Tạm tính</span><span>${formatMoney(invoice.subtotalAmount)}</span></div>
      <div class="sum-row"><span>Giảm giá</span><span>${formatMoney(invoice.discountAmount)}</span></div>
      <div class="sum-row sum-total"><span>Thành tiền</span><span>${formatMoney(invoice.finalAmount)}</span></div>
      <div class="sum-row"><span>Đã thanh toán</span><span>${formatMoney(invoice.paidAmount)}</span></div>
      <div class="sum-row sum-bold"><span>Còn lại</span><span>${formatMoney(invoice.remainingAmount)}</span></div>
    `;

    const qrSection = invoice.payment?.qrUrl
      ? `<div class="qr-box">
          <img src="${invoice.payment.qrUrl}" alt="QR" />
          <div class="qr-label">Quét mã để thanh toán<br/><strong>${formatMoney(invoice.payment.amount)}</strong></div>
        </div>`
      : '';

    const customer = invoice.customer
      ? `${invoice.customer.name ?? invoice.customer.phone} — ${invoice.customer.phone}`
      : '—';
    const saleDate = invoice.saleDate
      ? dayjs(invoice.saleDate).format('DD/MM/YYYY HH:mm')
      : '—';
    const statusLabel = invoice.status
      ? SALE_STATUS_LABELS[invoice.status as SaleStatus]
      : '—';

    const html = `
      <html><head><title>Hoá đơn</title>
      <style>
        @page { size: A5 portrait; margin: 8mm; }
        * { box-sizing: border-box; }
        body { font-family: sans-serif; padding: 0; color: #000; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin: 6px 0; }
        th, td { border: 1px solid #000; padding: 4px 7px; text-align: left; font-size: 11px; }
        th { background: #eee; font-weight: bold; }
        .meta { font-size: 10px; color: #333; margin-bottom: 6px; }
        .layout { display: flex; gap: 16px; align-items: flex-start; margin-top: 8px; }
        .qr-box { text-align: center; flex-shrink: 0; }
        .qr-box img { width: 160px; display: block; margin: 0 auto 4px; }
        .qr-label { font-size: 10px; color: #333; line-height: 1.4; }
        .summary-wrap { flex: 1; }
        .sum-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #ddd; font-size: 11px; }
        .sum-row:last-child { border-bottom: none; }
        .sum-total { font-weight: bold; font-size: 13px; border-top: 1px solid #000; padding-top: 4px; }
        .sum-bold { font-weight: bold; }
      </style>
      <script>window.onload = function() { window.print(); window.addEventListener('afterprint', function() { window.close(); }); }</script>
      </head><body>
        <div class="meta">Mã: ${invoice.id}</div>
        <table>
          <tr><th>Ngày bán</th><td>${saleDate}</td><th>Trạng thái</th><td>${statusLabel}</td></tr>
          <tr><th>Khách hàng</th><td colspan="3">${customer}</td></tr>
        </table>
        <table>
          <thead><tr><th>Sản phẩm</th><th>SL</th><th>ĐV</th><th style="text-align:right">Đơn giá</th><th style="text-align:right">Thành tiền</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="layout">
          ${qrSection}
          <div class="summary-wrap">${summaryLines}</div>
        </div>
      </body></html>
    `;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=560,height=800');
    if (!win) { URL.revokeObjectURL(url); return; }
    win.addEventListener('unload', () => URL.revokeObjectURL(url));
  }

  return (
    <>
      <Button
        icon={<PrinterOutlined />}
        loading={fetching}
        onClick={handleOpen}
        disabled={!saleId}
      >
        Xuất hoá đơn
      </Button>

      <Modal
        title="Hoá đơn bán hàng"
        open={open}
        onCancel={() => setOpen(false)}
        width={640}
        footer={
          <Button
            icon={<PrinterOutlined />}
            type="primary"
            onClick={handlePrint}
          >
            In hoá đơn
          </Button>
        }
      >
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Mã: {invoice?.id}
        </Typography.Text>
        <Divider style={{ margin: '12px 0' }} />
        <Descriptions size="small" column={2} bordered>
          <Descriptions.Item label="Ngày bán">
            {invoice?.saleDate
              ? dayjs(invoice.saleDate).format('DD/MM/YYYY HH:mm')
              : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {invoice?.status ? (
              <Tag color={statusColor[invoice.status as SaleStatus]}>
                {SALE_STATUS_LABELS[invoice.status as SaleStatus]}
              </Tag>
            ) : (
              '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Khách hàng" span={2}>
            {invoice?.customer
              ? `${invoice.customer.name ?? invoice.customer.phone} — ${invoice.customer.phone}`
              : '—'}
          </Descriptions.Item>
        </Descriptions>

        <Table
          style={{ marginTop: 12 }}
          rowKey="id"
          dataSource={invoice?.saleItems ?? []}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Sản phẩm',
              render: (_, row: ISaleItem) => row.product?.name ?? row.productId,
            },
            { dataIndex: 'quantity', title: 'SL' },
            { dataIndex: 'quantityUnit', title: 'ĐV' },
            {
              dataIndex: 'unitPrice',
              title: 'Đơn giá',
              render: (n: number) => formatMoney(n),
            },
            {
              dataIndex: 'amount',
              title: 'Thành tiền',
              render: (n: number) => (
                <Typography.Text strong>{formatMoney(n)}</Typography.Text>
              ),
            },
          ]}
        />

        <Descriptions
          size="small"
          column={1}
          style={{ marginTop: 12 }}
          styles={{ label: { width: 160 } }}
        >
          <Descriptions.Item label="Tạm tính">
            {formatMoney(invoice?.subtotalAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Giảm giá">
            {formatMoney(invoice?.discountAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Thành tiền">
            <Typography.Text strong style={{ fontSize: 16 }}>
              {formatMoney(invoice?.finalAmount)}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Đã thanh toán">
            {formatMoney(invoice?.paidAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Còn lại">
            <Typography.Text
              strong
              type={invoice?.remainingAmount ? 'danger' : 'success'}
            >
              {formatMoney(invoice?.remainingAmount)}
            </Typography.Text>
          </Descriptions.Item>
        </Descriptions>

        {invoice?.payment?.qrUrl && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <Typography.Text
                type="secondary"
                style={{ display: 'block', marginBottom: 8 }}
              >
                Quét mã để thanh toán {formatMoney(invoice.payment.amount)}
              </Typography.Text>
              <Image
                src={invoice.payment.qrUrl}
                alt="QR thanh toán"
                width={200}
                preview={false}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
