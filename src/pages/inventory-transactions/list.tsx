import { List as AntdList, ShowButton, useTable } from "@refinedev/antd";
import { Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import {
  INVENTORY_TX_DIRECTION_LABELS,
  INVENTORY_TX_TYPE_LABELS,
  type IInventoryTransaction,
  type InventoryTransactionDirection,
  type InventoryTransactionType,
} from "@/types";

export const List = () => {
  const { tableProps } = useTable<IInventoryTransaction>({
    syncWithLocation: true,
    resource: "inventory-transactions",
    meta: {
      include: {
        product: { select: { id: true, name: true, type: true } },
      },
    },
    filters: {
      initial: [
        { field: "refType", operator: "eq", value: undefined },
        { field: "direction", operator: "eq", value: undefined },
      ],
    },
    sorters: { initial: [{ field: "transactionDate", order: "desc" }] },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id" scroll={{ x: true }}>
        <Table.Column
          dataIndex="transactionDate"
          title="Ngày giao dịch"
          sorter
          defaultSortOrder="descend"
          render={(v: string) =>
            v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—"
          }
        />
        <Table.Column
          dataIndex="refType"
          title="Loại tham chiếu"
          render={(t: InventoryTransactionType) =>
            INVENTORY_TX_TYPE_LABELS[t] ?? t
          }
        />
        <Table.Column dataIndex="refId" title="Mã tham chiếu" ellipsis />
        <Table.Column
          dataIndex="direction"
          title="Chiều"
          render={(d: InventoryTransactionDirection) => (
            <Tag color={d === "IN" ? "green" : "orange"}>
              {INVENTORY_TX_DIRECTION_LABELS[d] ?? d}
            </Tag>
          )}
        />
        <Table.Column
          title="Sản phẩm"
          render={(_, r: IInventoryTransaction) =>
            r.product ? (
              <Link to={`/products/show/${r.product.id}`}>
                {r.product.name}
              </Link>
            ) : (
              "—"
            )
          }
        />
        <Table.Column dataIndex="quantity" title="Số lượng" />
        <Table.Column dataIndex="quantityUnit" title="ĐVT" />
        <Table.Column
          dataIndex="totalCost"
          title="Tổng giá vốn"
          render={(n: number) =>
            n != null ? Number(n).toLocaleString("vi-VN") : "—"
          }
        />
        <Table.Column
          dataIndex="createdAt"
          title="Ghi nhận"
          sorter
          render={(v: string) => (v ? <RelativeTime value={v} /> : "—")}
        />
        <Table.Column
          title="Thao tác"
          dataIndex="actions"
          fixed="right"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </AntdList>
  );
};
