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
          title="Thông tin"
          sorter
          defaultSortOrder="descend"
          dataIndex="saleDate"
          render={(_, r: ISale) => (
            <Space direction="vertical" size={2}>
              <Space wrap size={8}>
                <Typography.Text strong>
                  {r.saleDate ? dayjs(r.saleDate).format("DD/MM/YYYY") : "—"}
                </Typography.Text>
                {r.status ? (
                  <Tag color={statusColor[r.status]}>
                    {SALE_STATUS_LABELS[r.status]}
                  </Tag>
                ) : null}
              </Space>
              <Typography.Text type="secondary">
                Khách:{" "}
                {r.customer ? (
                  <Link to={`/customers/show/${r.customer.id}`}>
                    {r.customer.name ?? r.customer.phone}
                  </Link>
                ) : (
                  r.customerId ?? "—"
                )}
              </Typography.Text>
              {r.note ? (
                <Typography.Text type="secondary" ellipsis>
                  Ghi chú: {r.note}
                </Typography.Text>
              ) : null}
            </Space>
          )}
        />
        <Table.Column
          title="Thanh toán"
          render={(_, r: ISale) => (
            <Space direction="vertical" size={2}>
              <Typography.Text>
                Thành tiền:{" "}
                <Typography.Text strong>
                  {formatMoney(r.finalAmount)}
                </Typography.Text>
              </Typography.Text>
              <Typography.Text type="secondary">
                Đã TT: {formatMoney(r.paidAmount)}
              </Typography.Text>
              <Typography.Text type="secondary">
                Còn lại: {formatMoney(r.remainingAmount)}
              </Typography.Text>
            </Space>
          )}
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
