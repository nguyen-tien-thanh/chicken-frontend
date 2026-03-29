import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import type { IPurchase, IPurchaseItem } from "@/types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<IPurchase>({
    meta: {
      include: {
        supplier: { select: { id: true, name: true, phone: true } },
        purchaseItems: {
          include: {
            product: { select: { id: true, name: true, type: true } },
          },
        },
      },
    },
  });
  const { isLoading } = query;

  const items = record?.purchaseItems ?? [];

  return (
    <AntdShow isLoading={isLoading}>
      <Space style={{ marginBottom: 16 }} wrap>
        {record?.supplier ? (
          <Link to={`/suppliers/show/${record.supplier.id}`}>
            <Button>Xem nhà cung cấp</Button>
          </Link>
        ) : null}
        <Link to="/purchases">
          <Button>Danh sách phiếu nhập</Button>
        </Link>
      </Space>
      <Title level={5}>Mã</Title>
      <TextField value={record?.id} />
      <Title level={5}>Ngày nhập</Title>
      <TextField
        value={
          record?.purchaseDate
            ? dayjs(record.purchaseDate).format("DD/MM/YYYY HH:mm")
            : undefined
        }
      />
      <Title level={5}>Nhà cung cấp</Title>
      {record?.supplier ? (
        <Link to={`/suppliers/show/${record.supplier.id}`}>
          {record.supplier.name} — {record.supplier.phone}
        </Link>
      ) : (
        <TextField value={record?.supplierId} />
      )}
      <Title level={5}>Tổng tiền</Title>
      <TextField
        value={
          record?.totalAmount != null
            ? Number(record.totalAmount).toLocaleString("vi-VN")
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
        Chi tiết hàng nhập
      </Title>
      <Table<IPurchaseItem>
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
            dataIndex: "avgWeightPerUnit",
            title: "TB trọng lượng/ĐV",
          },
          { dataIndex: "note", title: "Ghi chú", ellipsis: true },
        ]}
      />
    </AntdShow>
  );
};
