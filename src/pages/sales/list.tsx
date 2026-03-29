import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import { SALE_STATUS_LABELS, type ISale, type SaleStatus } from "@/types";

const statusColor: Record<SaleStatus, string> = {
  PENDING: "orange",
  PAID: "green",
  CANCELLED: "red",
};

export const List = () => {
  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get("customerId");

  const { tableProps } = useTable<ISale>({
    syncWithLocation: true,
    resource: "sales",
    meta: {
      include: {
        customer: { select: { id: true, name: true, phone: true } },
      },
    },
    filters: {
      ...(customerIdParam
        ? {
            permanent: [
              {
                field: "customerId",
                operator: "eq",
                value: customerIdParam,
              },
            ],
          }
        : {}),
      initial: [],
    },
    sorters: { initial: [{ field: "saleDate", order: "desc" }] },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="saleDate"
          title="Ngày bán"
          sorter
          defaultSortOrder="descend"
          render={(v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "—")}
        />
        <Table.Column
          title="Khách hàng"
          render={(_, r: ISale) =>
            r.customer ? (
              <Link to={`/customers/show/${r.customer.id}`}>
                {r.customer.name ?? r.customer.phone}
              </Link>
            ) : (
              "—"
            )
          }
        />
        <Table.Column
          dataIndex="finalAmount"
          title="Thành tiền"
          sorter
          render={(n: number) =>
            n != null ? Number(n).toLocaleString("vi-VN") : "—"
          }
        />
        <Table.Column
          dataIndex="paidAmount"
          title="Đã thanh toán"
          sorter
          render={(n: number) =>
            n != null ? Number(n).toLocaleString("vi-VN") : "—"
          }
        />
        <Table.Column
          dataIndex="remainingAmount"
          title="Còn lại"
          sorter
          render={(n: number) =>
            n != null ? Number(n).toLocaleString("vi-VN") : "—"
          }
        />
        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(s: SaleStatus) =>
            s ? <Tag color={statusColor[s]}>{SALE_STATUS_LABELS[s]}</Tag> : "—"
          }
        />
        <Table.Column dataIndex="note" title="Ghi chú" ellipsis />
        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          sorter
          render={(v: string) => (v ? <RelativeTime value={v} /> : "—")}
        />
        <Table.Column
          title="Thao tác"
          dataIndex="actions"
          fixed="right"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </AntdList>
  );
};
