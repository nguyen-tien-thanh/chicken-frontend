import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table } from "antd";

import { RelativeTime } from "@/components/relative-time";
import type { IRole } from "@/types";

export const List = () => {
  const { tableProps } = useTable<IRole>({
    syncWithLocation: true,
    resource: "roles",
    filters: {
      initial: [{ field: "name", operator: "contains", value: undefined }],
    },
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Tên" sorter />
        <Table.Column dataIndex="description" title="Mô tả" ellipsis />
        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          sorter
          defaultSortOrder="descend"
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
