import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table } from "antd";

import { RelativeTime } from "@/components/relative-time";
import type { IUser } from "@/types";

export const List = () => {
  const { tableProps } = useTable<IUser>({
    syncWithLocation: true,
    resource: "users",
    meta: {
      include: {
        role: true,
      },
    },
    filters: {
      initial: [
        { field: "email", operator: "contains", value: undefined },
        { field: "name", operator: "contains", value: undefined },
      ],
    },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="email" title="Email" sorter />
        <Table.Column dataIndex="name" title="Tên" sorter />
        <Table.Column title="Vai trò" render={(_, r) => r.role?.name ?? "—"} />
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
