import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import type { IPurchase } from "@/types";
import { formatMoney } from "@/utils";

export const List = () => {
  const [searchParams] = useSearchParams();
  const supplierIdParam = searchParams.get("supplierId");

  const { tableProps } = useTable<IPurchase>({
    syncWithLocation: true,
    resource: "purchases",
    meta: {
      include: {
        supplier: { select: { id: true, name: true, phone: true } },
      },
    },
    filters: {
      ...(supplierIdParam
        ? {
            permanent: [
              {
                field: "supplierId",
                operator: "eq",
                value: supplierIdParam,
              },
            ],
          }
        : {}),
      initial: [],
    },
    sorters: { initial: [{ field: "purchaseDate", order: "desc" }] },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="purchaseDate"
          title="Ngày nhập"
          sorter
          defaultSortOrder="descend"
          render={(v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "—")}
        />
        <Table.Column
          title="Nhà cung cấp"
          render={(_, r: IPurchase) =>
            r.supplier ? (
              <Link to={`/suppliers/show/${r.supplier.id}`}>
                {r.supplier.name}
              </Link>
            ) : (
              r.supplierId ?? "—"
            )
          }
        />
        <Table.Column
          title="Tổng tiền"
          sorter
          dataIndex="totalAmount"
          render={(_, r: IPurchase) => (
            <Typography.Text strong>
              {formatMoney(r.totalAmount)}
            </Typography.Text>
          )}
        />
        <Table.Column dataIndex="note" title="Ghi chú" ellipsis />
        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          sorter
          responsive={["xl"]}
          render={(v: string) => (v ? <RelativeTime value={v} /> : "—")}
        />
        <Table.Column
          title="Thao tác"
          dataIndex="actions"
          fixed="right"
          render={(_, record) => (
            <Space>
              <EditButton hideText recordItemId={record.id} />
              <ShowButton hideText recordItemId={record.id} />
              <DeleteButton hideText recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </AntdList>
  );
};
