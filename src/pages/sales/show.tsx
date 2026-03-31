import { Show as AntdShow } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {
  Button,
  Card,
  Descriptions,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import {
  SALE_STATUS_LABELS,
  type ISale,
  type ISaleItem,
  type SaleStatus,
} from "@/types";
import { formatMoney } from "@/utils";

const statusColor: Record<SaleStatus, string> = {
  PENDING: "orange",
  PAID: "green",
  CANCELLED: "red",
};

export const Show = () => {
  const { result: record, query } = useShow<ISale>({
    meta: {
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        saleItems: {
          include: {
            product: { select: { id: true, name: true, type: true } },
          },
        },
      },
    },
  });
  const { isLoading } = query;

  const items = record?.saleItems ?? [];

  return (
    <AntdShow isLoading={isLoading}>
      <Space style={{ marginBottom: 16 }} wrap>
        {record?.customer ? (
          <Link to={`/customers/show/${record.customer.id}`}>
            <Button>Xem khách hàng</Button>
          </Link>
        ) : null}
        <Link to="/sales">
          <Button>Danh sách phiếu bán</Button>
        </Link>
      </Space>
      <Card size="small" styles={{ body: { padding: 0 } }}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã phiếu">
            <Typography.Text copyable={!!record?.id}>
              {record?.id ?? "—"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bán">
            {record?.saleDate
              ? dayjs(record.saleDate).format("DD/MM/YYYY HH:mm")
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Khách hàng">
            {record?.customer ? (
              <Link to={`/customers/show/${record.customer.id}`}>
                {(record.customer.name ?? record.customer.phone) +
                  " — " +
                  record.customer.phone}
              </Link>
            ) : (
              record?.customerId ?? "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {record?.status ? (
              <Tag color={statusColor[record.status]}>
                {SALE_STATUS_LABELS[record.status]}
              </Tag>
            ) : (
              "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tạm tính">
            {formatMoney(record?.subtotalAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Giảm giá">
            {formatMoney(record?.discountAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Thành tiền">
            <Typography.Text strong>
              {formatMoney(record?.finalAmount)}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Đã thanh toán">
            {formatMoney(record?.paidAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Còn lại">
            {formatMoney(record?.remainingAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>
            {record?.note ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {record?.createdAt ? (
              <RelativeTime value={record.createdAt} />
            ) : (
              "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật">
            {record?.updatedAt ? (
              <RelativeTime value={record.updatedAt} />
            ) : (
              "—"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        Chi tiết hàng bán
      </Typography.Title>
      <Table<ISaleItem>
        rowKey="id"
        dataSource={items}
        pagination={false}
        size="small"
        scroll={{ x: true }}
        columns={[
          {
            title: "Sản phẩm",
            render: (_, row) =>
              row.product ? (
                <Link to={`/products/show/${row.product.id}`}>
                  {row.product.name}
                </Link>
              ) : (
                row.productId
              ),
          },
          { dataIndex: "quantity", title: "Số lượng" },
          { dataIndex: "quantityUnit", title: "Đơn vị" },
          {
            dataIndex: "unitPrice",
            title: "Đơn giá",
            render: (n: number) => formatMoney(n),
          },
          {
            dataIndex: "amount",
            title: "Thành tiền",
            render: (n: number) => formatMoney(n),
          },
          {
            dataIndex: "costAmount",
            title: "Giá vốn",
            render: (n: number) => formatMoney(n),
          },
          {
            dataIndex: "profitAmount",
            title: "Lợi nhuận",
            render: (n: number) => formatMoney(n),
          },
          { dataIndex: "note", title: "Ghi chú", ellipsis: true },
        ]}
      />
    </AntdShow>
  );
};
