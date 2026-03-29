import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import {
  SALE_STATUS_LABELS,
  type ISale,
  type ISaleItem,
  type SaleStatus,
} from "@/types";

const { Title } = Typography;

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
      <Title level={5}>Mã</Title>
      <TextField value={record?.id} />
      <Title level={5}>Ngày bán</Title>
      <TextField
        value={
          record?.saleDate
            ? dayjs(record.saleDate).format("DD/MM/YYYY HH:mm")
            : undefined
        }
      />
      <Title level={5}>Khách hàng</Title>
      {record?.customer ? (
        <Link to={`/customers/show/${record.customer.id}`}>
          {(record.customer.name ?? record.customer.phone) +
            " — " +
            record.customer.phone}
        </Link>
      ) : (
        <TextField value={record?.customerId} />
      )}
      <Title level={5}>Trạng thái</Title>
      {record?.status ? (
        <Tag color={statusColor[record.status]}>
          {SALE_STATUS_LABELS[record.status]}
        </Tag>
      ) : (
        <TextField value={undefined} />
      )}
      <Title level={5}>Tạm tính</Title>
      <TextField
        value={
          record?.subtotalAmount != null
            ? Number(record.subtotalAmount).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Giảm giá</Title>
      <TextField
        value={
          record?.discountAmount != null
            ? Number(record.discountAmount).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Thành tiền</Title>
      <TextField
        value={
          record?.finalAmount != null
            ? Number(record.finalAmount).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Đã thanh toán</Title>
      <TextField
        value={
          record?.paidAmount != null
            ? Number(record.paidAmount).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Còn lại</Title>
      <TextField
        value={
          record?.remainingAmount != null
            ? Number(record.remainingAmount).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Ghi chú</Title>
      <TextField value={record?.note} />
      <Title level={5}>Ngày tạo</Title>
      <RelativeTime value={record?.createdAt} />
      <Title level={5}>Cập nhật</Title>
      <RelativeTime value={record?.updatedAt} />

      <Title level={5} style={{ marginTop: 24 }}>
        Chi tiết hàng bán
      </Title>
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
          { dataIndex: "quantityUnit", title: "ĐVT" },
          {
            dataIndex: "unitPrice",
            title: "Đơn giá",
            render: (n: number) =>
              n != null ? Number(n).toLocaleString("vi-VN") : "—",
          },
          {
            dataIndex: "amount",
            title: "Thành tiền",
            render: (n: number) =>
              n != null ? Number(n).toLocaleString("vi-VN") : "—",
          },
          {
            dataIndex: "costAmount",
            title: "Giá vốn",
            render: (n: number) =>
              n != null ? Number(n).toLocaleString("vi-VN") : "—",
          },
          {
            dataIndex: "profitAmount",
            title: "Lợi nhuận",
            render: (n: number) =>
              n != null ? Number(n).toLocaleString("vi-VN") : "—",
          },
          { dataIndex: "note", title: "Ghi chú", ellipsis: true },
        ]}
      />
    </AntdShow>
  );
};
