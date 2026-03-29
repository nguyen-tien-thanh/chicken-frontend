import {
  List as AntdList,
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Space, Table, Tag } from "antd";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import { PRODUCT_TYPE_LABELS, type IProduct, type ProductType } from "@/types";

export const List = () => {
  const { tableProps } = useTable<IProduct>({
    syncWithLocation: true,
    resource: "products",
    meta: {
      include: {
        category: { select: { id: true, name: true } },
      },
    },
    filters: {
      initial: [
        { field: "name", operator: "contains", value: undefined },
        { field: "type", operator: "eq", value: undefined },
      ],
    },
  });

  return (
    <AntdList>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Tên sản phẩm" sorter />
        <Table.Column
          dataIndex="type"
          title="Loại"
          render={(t: ProductType) => <Tag>{PRODUCT_TYPE_LABELS[t] ?? t}</Tag>}
        />
        <Table.Column
          title="Danh mục"
          render={(_, r: IProduct) =>
            r.category ? (
              <Link to={`/product-categories/show/${r.category.id}`}>
                {r.category.name}
              </Link>
            ) : (
              "—"
            )
          }
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
