import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Tag, Typography } from "antd";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import { PRODUCT_TYPE_LABELS, type IProduct, type ProductType } from "@/types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<IProduct>({
    meta: {
      include: {
        category: { select: { id: true, name: true } },
      },
    },
  });
  const { isLoading } = query;

  const type = record?.type as ProductType | undefined;

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>Mã</Title>
      <TextField value={record?.id} />
      <Title level={5}>Tên</Title>
      <TextField value={record?.name} />
      <Title level={5}>Loại</Title>
      {type ? <Tag>{PRODUCT_TYPE_LABELS[type]}</Tag> : null}
      <Title level={5}>Danh mục</Title>
      {record?.category ? (
        <Link to={`/product-categories/show/${record.category.id}`}>
          {record.category.name}
        </Link>
      ) : (
        <TextField value={record?.categoryId} />
      )}
      <Title level={5}>Ngày tạo</Title>
      <RelativeTime value={record?.createdAt} />
      <Title level={5}>Cập nhật</Title>
      <RelativeTime value={record?.updatedAt} />
    </AntdShow>
  );
};
