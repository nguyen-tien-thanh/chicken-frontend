import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table } from "antd";

import { RelativeTime } from "@/components/relative-time";
import type { ICustomer } from "@/types";

export const List = () => {
  const { tableProps } = useTable<ICustomer>({
    syncWithLocation: true,
    resource: "customers",
    filters: {
      initial: [
        { field: "name", operator: "contains", value: undefined },
        { field: "phone", operator: "contains", value: undefined },
      ],
    },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Tên" sorter />
        <Table.Column dataIndex="phone" title="Điện thoại" sorter />
        <Table.Column dataIndex="address" title="Địa chỉ" ellipsis />
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
