import { Create as AntdCreate, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import { Form, Input, Select } from "antd";

import type { IRole } from "../../types";

export const Create = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "users",
  });

  const {
    options: roleOptions,
    onSearch: onSearchRole,
    query: rolesQuery,
  } = useSelect({
    resource: "roles",
    optionLabel: (item: IRole) => item.name,
    optionValue: (item: IRole) => item.id,
  });

  return (
    <AntdCreate saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input type="email" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Vai trò" name="roleId" rules={[{ required: true }]}>
          <Select
            options={roleOptions}
            loading={rolesQuery.isFetching}
            showSearch
            onSearch={onSearchRole}
            filterOption={false}
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
