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
      initial: [
        {
          field: "name",
          operator: "contains",
          value: "",
        },
      ],
    },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="name"
          title={"name"}
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props} children={<Input.Search />} />
          )}
        />
        <Table.Column
          title={"Actions"}
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
