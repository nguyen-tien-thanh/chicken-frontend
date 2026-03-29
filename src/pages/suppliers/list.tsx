import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table } from "antd";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import type { ISupplier } from "@/types";

export const List = () => {
  const { tableProps } = useTable<ISupplier>({
    syncWithLocation: true,
    resource: "suppliers",
    filters: {
      initial: [
        { field: "name", operator: "contains", value: undefined },
        { field: "phone", operator: "contains", value: undefined },
      ],
    },
    sorters: { initial: [{ field: "createdAt", order: "desc" }] },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Tên nhà cung cấp" sorter />
        <Table.Column dataIndex="phone" title="Điện thoại" sorter />
        <Table.Column dataIndex="address" title="Địa chỉ" ellipsis />
        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          sorter
          defaultSortOrder="descend"
          render={(v: string) => (v ? <RelativeTime value={v} /> : "—")}
        />
        <Table.Column
          title="Nghiệp vụ"
          render={(_, r: ISupplier) => (
            <Link to={`/purchases/create?supplierId=${r.id}`}>Nhập hàng</Link>
          )}
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
