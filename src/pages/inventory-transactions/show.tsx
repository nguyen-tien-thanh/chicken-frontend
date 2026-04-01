import { Show as AntdShow } from '@refinedev/antd';
import { useOne, useShow } from '@refinedev/core';
import {
  Button,
  Card,
  Descriptions,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router';

import { RelativeTime } from '@/components/relative-time';
import {
  INVENTORY_TX_DIRECTION_LABELS,
  INVENTORY_TX_TYPE_LABELS,
  type IInventoryTransaction,
  type InventoryTransactionDirection,
  type InventoryTransactionType,
} from '@/types';
import { formatMoney } from '@/utils';

type PurchaseItemLookup = { id: string; purchaseId: string };
type SaleItemLookup = { id: string; saleId: string };

function RefDocumentButton({ record }: { record: IInventoryTransaction }) {
  const { refType, refId } = record;
  if (!refId) return null;

  const isPurchase = refType === 'PURCHASE';
  const isSale = refType === 'SALE';

  const purchaseItem = useOne<PurchaseItemLookup>({
    resource: 'purchase-items',
    id: refId,
    queryOptions: { enabled: isPurchase },
    meta: { select: { id: true, purchaseId: true } },
  });

  const saleItem = useOne<SaleItemLookup>({
    resource: 'sale-items',
    id: refId,
    queryOptions: { enabled: isSale },
    meta: { select: { id: true, saleId: true } },
  });

  if (isPurchase) {
    const purchaseId = purchaseItem.result?.purchaseId;
    const loading = purchaseItem.query.isLoading;
    const disabled = !purchaseId || loading;
    return (
      <Tooltip
        title={
          loading
            ? 'Đang tải phiếu tham chiếu…'
            : disabled
            ? 'Không tìm thấy phiếu nhập từ refId'
            : 'Mở phiếu nhập'
        }
      >
        <Link to={purchaseId ? `/purchases/show/${purchaseId}` : '#'}>
          <Button type="primary" size="small" disabled={disabled}>
            Mở phiếu nhập
          </Button>
        </Link>
      </Tooltip>
    );
  }

  if (isSale) {
    const saleId = saleItem.result?.saleId;
    const loading = saleItem.query.isLoading;
    const disabled = !saleId || loading;
    return (
      <Tooltip
        title={
          loading
            ? 'Đang tải phiếu tham chiếu…'
            : disabled
            ? 'Không tìm thấy phiếu bán từ refId'
            : 'Mở phiếu bán'
        }
      >
        <Link to={saleId ? `/sales/show/${saleId}` : '#'}>
          <Button type="primary" size="small" disabled={disabled}>
            Mở phiếu bán
          </Button>
        </Link>
      </Tooltip>
    );
  }

  return null;
}

export const Show = () => {
  const { result: record, query } = useShow<IInventoryTransaction>({
    meta: {
      include: {
        product: { select: { id: true, name: true, type: true } },
      },
    },
  });
  const { isLoading } = query;

  const rt = record?.refType as InventoryTransactionType | undefined;
  const dir = record?.direction as InventoryTransactionDirection | undefined;

  return (
    <AntdShow isLoading={isLoading}>
      <Card size="small" styles={{ body: { padding: 0 } }}>
        <Descriptions
          bordered
          column={2}
          size="small"
          styles={{ label: { width: 160, fontWeight: 500 } }}
        >
          <Descriptions.Item label="Mã giao dịch">
            <Typography.Text copyable={!!record?.id}>
              {record?.id}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày giao dịch">
            {record?.transactionDate
              ? dayjs(record.transactionDate).format('DD/MM/YYYY HH:mm')
              : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Loại tham chiếu">
            {rt ? (
              <Tag>{INVENTORY_TX_TYPE_LABELS[rt]}</Tag>
            ) : (
              (record?.refType as string) ?? '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Mã tham chiếu">
            <Space wrap align="center">
              <Typography.Text code>{record?.refId ?? '—'}</Typography.Text>
              {record ? <RefDocumentButton record={record} /> : null}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Chiều">
            {dir ? (
              <Tag color={dir === 'IN' ? 'green' : 'orange'}>
                {INVENTORY_TX_DIRECTION_LABELS[dir]}
              </Tag>
            ) : (
              '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Sản phẩm">
            {record?.product ? (
              <Link to={`/products/show/${record.product.id}`}>
                {record.product.name}
              </Link>
            ) : (
              record?.productId ?? '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng">
            {record?.quantity != null ? record.quantity : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị tính">
            {record?.quantityUnit ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Giá vốn đơn vị">
            {formatMoney(record?.unitCost)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng giá vốn">
            {formatMoney(record?.totalCost)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {record?.note ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi nhận lúc">
            {record?.createdAt ? (
              <RelativeTime value={record.createdAt} />
            ) : (
              '—'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </AntdShow>
  );
};
