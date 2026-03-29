import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table, Tag } from "antd";

import { RelativeTime } from "@/components/relative-time";
import type { IPermission } from "@/types";

export const List = () => {
  const { tableProps } = useTable<IPermission>({
    syncWithLocation: true,
    resource: "permissions",
    filters: {
      initial: [
        { field: "path", operator: "contains", value: undefined },
        { field: "method", operator: "eq", value: undefined },
      ],
    },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="path" title="Path" sorter ellipsis />
        <Table.Column
          dataIndex="method"
          title="Method"
          sorter
          render={(m: IPermission["method"]) => <Tag color="blue">{m}</Tag>}
        />
        <Table.Column dataIndex="description" title="Mô tả" ellipsis />
        <Table.Column
          dataIndex="default"
          title="Mặc định"
          render={(v: boolean) => (v ? "Có" : "Không")}
        />
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
