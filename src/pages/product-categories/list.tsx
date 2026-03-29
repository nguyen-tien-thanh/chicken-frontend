import {
  List as AntdList,
  DeleteButton,
  EditButton,
  FilterDropdown,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Input, Space, Table } from "antd";

export const List = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    filters: {
      initial: [{ field: "name", operator: "contains", value: undefined }],
    },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="Mã" />
        <Table.Column
          dataIndex="name"
          title="Tên danh mục"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props} children={<Input.Search />} />
          )}
        />
        <Table.Column dataIndex="deletedAt" title="Ngày xóa mềm" />
        <Table.Column
          title="Thao tác"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
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
