import { Show as AntdShow } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Card, Descriptions, Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import type { IPurchase, IPurchaseItem } from "@/types";
import { formatMoney } from "@/utils";

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

      <Card size="small" styles={{ body: { padding: 0 } }}>
        <Descriptions
          bordered
          column={2}
          size="small"
          styles={{ label: { width: 160, fontWeight: 500 } }}
        >
          <Descriptions.Item label="Mã phiếu">
            <Typography.Text copyable={!!record?.id}>
              {record?.id ?? "—"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày nhập">
            {record?.purchaseDate
              ? dayjs(record.purchaseDate).format("DD/MM/YYYY HH:mm")
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Nhà cung cấp" span={2}>
            {record?.supplier ? (
              <Link to={`/suppliers/show/${record.supplier.id}`}>
                {record.supplier.name} — {record.supplier.phone}
              </Link>
            ) : (
              record?.supplierId ?? "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Trung bình">
            {record?.averageWeight ?? "—"} kg/con
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            <Typography.Text strong>
              {formatMoney(record?.totalAmount)}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng lồng">
            {record?.cagesCount ?? "—"} lồng
          </Descriptions.Item>
          <Descriptions.Item label="Tổng trọng lượng lồng">
            {record?.cagesWeight ?? "—"} kg
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
        Chi tiết hàng nhập
      </Typography.Title>
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
          { dataIndex: "note", title: "Ghi chú", ellipsis: true },
        ]}
      />
    </AntdShow>
  );
};
