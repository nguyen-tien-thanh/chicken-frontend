import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import { SALE_STATUS_LABELS, type ISale, type SaleStatus } from "@/types";
import { formatMoney } from "@/utils";

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
          title="Ngày bán"
          sorter
          defaultSortOrder="descend"
          dataIndex="saleDate"
          render={(_, r: ISale) =>
            r.saleDate ? dayjs(r.saleDate).format("DD/MM/YYYY") : "—"
          }
        />
        <Table.Column
          title="Khách hàng"
          dataIndex="customerId"
          render={(_, r: ISale) =>
            r.customer ? (
              <Link to={`/customers/show/${r.customer.id}`}>
                {r.customer.name ?? r.customer.phone}
              </Link>
            ) : (
              r.customerId ?? "—"
            )
          }
        />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          render={(_, r: ISale) =>
            r.status ? (
              <Tag color={statusColor[r.status]}>
                {SALE_STATUS_LABELS[r.status]}
              </Tag>
            ) : null
          }
        />
        <Table.Column
          title="Thành tiền"
          dataIndex="finalAmount"
          align="right"
          render={(_, r: ISale) => (
            <Typography.Text strong>
              {formatMoney(r.finalAmount)}
            </Typography.Text>
          )}
        />
        <Table.Column
          title="Đã thanh toán"
          dataIndex="paidAmount"
          align="right"
          render={(_, r: ISale) => formatMoney(r.paidAmount)}
        />
        <Table.Column
          title="Còn lại"
          dataIndex="remainingAmount"
          align="right"
          render={(_, r: ISale) => formatMoney(r.remainingAmount)}
        />
        <Table.Column
          title="Ghi chú"
          dataIndex="note"
          responsive={["xl"]}
          render={(v: string) =>
            v ? (
              <Typography.Text ellipsis style={{ maxWidth: 200 }}>
                {v}
              </Typography.Text>
            ) : null
          }
        />
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
