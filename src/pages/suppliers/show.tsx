import { Show as AntdShow, ShowButton, useTable } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Card, Descriptions, Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import type { IPurchase, ISupplier } from "@/types";
import { formatMoney } from "@/utils";

export const Show = () => {
  const { result: record, query } = useShow<ISupplier>({
    resource: "suppliers",
  });
  const { isLoading } = query;

  const supplierId = record?.id;

  const { tableProps } = useTable<IPurchase>({
    resource: "purchases",
    syncWithLocation: false,
    filters: {
      permanent: supplierId
        ? [{ field: "supplierId", operator: "eq", value: supplierId }]
        : [],
    },
    sorters: { initial: [{ field: "purchaseDate", order: "desc" }] },
    queryOptions: { enabled: !!supplierId },
  });

  return (
    <AntdShow isLoading={isLoading}>
      <Space style={{ marginBottom: 16 }} wrap>
        {supplierId ? (
          <Link to={`/purchases/create?supplierId=${supplierId}`}>
            <Button type="primary">Tạo phiếu nhập</Button>
          </Link>
        ) : null}
        <Link to="/suppliers">
          <Button>Danh sách nhà cung cấp</Button>
        </Link>
      </Space>

      <Card size="small" styles={{ body: { padding: 0 } }}>
        <Descriptions
          bordered
          column={2}
          size="small"
          styles={{ label: { width: 180, fontWeight: 500 } }}
        >
          <Descriptions.Item label="Mã" span={2}>
            <Typography.Text copyable={!!record?.id}>
              {record?.id ?? "—"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tên nhà cung cấp">
            {record?.name ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Tên ngân hàng">
            {record?.bankName ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {record?.phone ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Số tài khoản">
            {record?.bankAccount ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>
            {record?.address ?? "—"}
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

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Phiếu nhập hàng
      </Typography.Title>
      <Table<IPurchase>
        {...tableProps}
        rowKey="id"
        size="small"
        scroll={{ x: true }}
        columns={[
          {
            dataIndex: "purchaseDate",
            title: "Ngày nhập",
            sorter: true,
            defaultSortOrder: "descend",
            render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
          },
          {
            dataIndex: "cagesCount",
            title: "Số lồng",
            align: "right",
            render: (v: number) => (v != null ? `${v} lồng` : "—"),
          },
          {
            dataIndex: "cagesWeight",
            title: "Tổng trọng lượng",
            align: "right",
            render: (v: number) => (v != null ? `${v} kg` : "—"),
          },
          {
            dataIndex: "totalAmount",
            title: "Tổng tiền",
            align: "right",
            render: (v: number) => (
              <Typography.Text strong>{formatMoney(v)}</Typography.Text>
            ),
          },
          {
            dataIndex: "averageWeight",
            title: "TB kg/con",
            render: (v: number) => (v != null ? `${v} kg` : "—"),
          },
          {
            dataIndex: "note",
            title: "Ghi chú",
            ellipsis: true,
          },
          {
            title: "Thao tác",
            fixed: "right",
            render: (_, row: IPurchase) => (
              <ShowButton resource="purchases" recordItemId={row.id} />
            ),
          },
        ]}
      />
    </AntdShow>
  );
};
