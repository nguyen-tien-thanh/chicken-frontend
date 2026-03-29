import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import { Form, Input, Select } from "antd";

import type { IProductCategory } from "@/types";
import { PRODUCT_TYPE_OPTIONS } from "@/types";

export const Edit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "products",
    meta: {
      include: {
        category: { select: { id: true, name: true } },
      },
    },
  });

  const {
    options: categoryOptions,
    onSearch: onSearchCategory,
    query: categoriesQuery,
  } = useSelect({
    resource: "product-categories",
    optionLabel: (item: IProductCategory) => item.name,
    optionValue: (item: IProductCategory) => item.id,
  });

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
          <Select options={PRODUCT_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item
          label="Danh mục"
          name="categoryId"
          rules={[{ required: true }]}
        >
          <Select
            options={categoryOptions}
            loading={categoriesQuery.isFetching}
            showSearch
            onSearch={onSearchCategory}
            filterOption={false}
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </AntdEdit>
  );
};
