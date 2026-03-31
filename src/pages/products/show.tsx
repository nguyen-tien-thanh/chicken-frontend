import { Show as AntdShow, ShowButton, useTable } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import {
  PRODUCT_TYPE_LABELS,
  type IProduct,
  type IPurchaseItem,
  type ISaleItem,
  type ProductType,
} from "@/types";
import { formatMoney } from "@/utils";

export const Show = () => {
  const { result: record, query } = useShow<IProduct>({
    resource: "products",
    meta: {
      include: {
        category: { select: { id: true, name: true } },
      },
    },
  });
  const { isLoading } = query;

  const productId = record?.id;

  const { tableProps: purchaseTableProps } = useTable<IPurchaseItem>({
    resource: "purchase-items",
    syncWithLocation: false,
    filters: {
      permanent: productId
        ? [{ field: "productId", operator: "eq", value: productId }]
        : [],
    },
    meta: {
      include: {
        purchase: {
          select: {
            id: true,
            purchaseDate: true,
            supplier: { select: { id: true, name: true } },
          },
        },
      },
    },
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
    queryOptions: { enabled: !!productId },
  });

  const { tableProps: saleTableProps } = useTable<ISaleItem>({
    resource: "sale-items",
    syncWithLocation: false,
    filters: {
      permanent: productId
        ? [{ field: "productId", operator: "eq", value: productId }]
        : [],
    },
    meta: {
      include: {
        sale: {
          select: {
            id: true,
            saleDate: true,
            customer: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    },
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
    queryOptions: { enabled: !!productId },
  });

  const productType = record?.type as ProductType | undefined;

  return (
    <AntdShow isLoading={isLoading}>
      <Card size="small" styles={{ body: { padding: 0 } }}>
        <Descriptions
          bordered
          column={2}
          size="small"
          styles={{ label: { width: 160, fontWeight: 500 } }}
        >
          <Descriptions.Item label="Mã" span={2}>
            <Typography.Text copyable={!!record?.id}>
              {record?.id ?? "—"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tên sản phẩm">
            {record?.name ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Loại">
            {productType ? (
              <Tag>{PRODUCT_TYPE_LABELS[productType]}</Tag>
            ) : (
              "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {record?.category ? (
              <Link to={`/product-categories/show/${record.category.id}`}>
                {record.category.name}
              </Link>
            ) : (
              record?.categoryId ?? "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {record?.createdAt ? (
              <RelativeTime value={record.createdAt} />
            ) : (
              "—"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Lịch sử nhập hàng
      </Typography.Title>
      <Table<IPurchaseItem>
        {...purchaseTableProps}
        rowKey="id"
        size="small"
        scroll={{ x: true }}
        columns={[
          {
            title: "Ngày nhập",
            render: (_, row: IPurchaseItem & { purchase?: { id: string; purchaseDate: string; supplier?: { id: string; name: string } } }) =>
              row.purchase?.purchaseDate
                ? dayjs(row.purchase.purchaseDate).format("DD/MM/YYYY")
                : "—",
          },
          {
            title: "Nhà cung cấp",
            render: (_, row: IPurchaseItem & { purchase?: { id: string; purchaseDate: string; supplier?: { id: string; name: string } } }) =>
              row.purchase?.supplier ? (
                <Link to={`/suppliers/show/${row.purchase.supplier.id}`}>
                  {row.purchase.supplier.name}
                </Link>
              ) : (
                "—"
              ),
          },
          {
            dataIndex: "quantity",
            title: "Số lượng",
            render: (v: number, row: IPurchaseItem) =>
              v != null ? `${v} ${row.quantityUnit ?? ""}`.trim() : "—",
          },
          {
            dataIndex: "unitPrice",
            title: "Đơn giá",
            render: (v: number) => formatMoney(v),
          },
          {
            dataIndex: "amount",
            title: "Thành tiền",
            render: (v: number) => (
              <Typography.Text strong>{formatMoney(v)}</Typography.Text>
            ),
          },
          { dataIndex: "note", title: "Ghi chú", ellipsis: true },
          {
            title: "Phiếu nhập",
            fixed: "right",
            render: (_, row: IPurchaseItem & { purchase?: { id: string } }) =>
              row.purchase?.id ? (
                <ShowButton
                  resource="purchases"
                  recordItemId={row.purchase.id}
                  hideText
                />
              ) : (
                "—"
              ),
          },
        ]}
      />

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Lịch sử xuất hàng
      </Typography.Title>
      <Table<ISaleItem>
        {...saleTableProps}
        rowKey="id"
        size="small"
        scroll={{ x: true }}
        columns={[
          {
            title: "Ngày bán",
            render: (_, row: ISaleItem & { sale?: { id: string; saleDate: string; customer?: { id: string; name?: string | null; phone: string } } }) =>
              row.sale?.saleDate
                ? dayjs(row.sale.saleDate).format("DD/MM/YYYY HH:mm")
                : "—",
          },
          {
            title: "Khách hàng",
            render: (_, row: ISaleItem & { sale?: { id: string; saleDate: string; customer?: { id: string; name?: string | null; phone: string } } }) =>
              row.sale?.customer ? (
                <Link to={`/customers/show/${row.sale.customer.id}`}>
                  {row.sale.customer.name ?? row.sale.customer.phone}
                </Link>
              ) : (
                "—"
              ),
          },
          {
            dataIndex: "quantity",
            title: "Số lượng",
            render: (v: number, row: ISaleItem) =>
              v != null ? `${v} ${row.quantityUnit ?? ""}`.trim() : "—",
          },
          {
            dataIndex: "unitPrice",
            title: "Đơn giá",
            render: (v: number) => formatMoney(v),
          },
          {
            dataIndex: "amount",
            title: "Thành tiền",
            render: (v: number) => (
              <Typography.Text strong>{formatMoney(v)}</Typography.Text>
            ),
          },
          {
            dataIndex: "profitAmount",
            title: "Lợi nhuận",
            render: (v: number) => formatMoney(v),
          },
          { dataIndex: "note", title: "Ghi chú", ellipsis: true },
          {
            title: "Phiếu bán",
            fixed: "right",
            render: (_, row: ISaleItem & { sale?: { id: string } }) =>
              row.sale?.id ? (
                <ShowButton
                  resource="sales"
                  recordItemId={row.sale.id}
                  hideText
                />
              ) : (
                "—"
              ),
          },
        ]}
      />
    </AntdShow>
  );
};
