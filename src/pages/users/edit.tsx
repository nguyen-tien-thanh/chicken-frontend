import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import type { FormProps } from "antd";
import { Form, Input, Select } from "antd";

import type { IRole } from "../../types";

export const Edit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "users",
    meta: {
      include: {
        role: { select: { id: true, name: true } },
      },
    },
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

  const onFinish: FormProps["onFinish"] = (values) => {
    const next = { ...values } as Record<string, unknown>;
    if (!next.password) {
      delete next.password;
    }
    return formProps.onFinish?.(next as never);
  };

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input type="email" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[{ min: 6 }]}
          extra="Để trống nếu không đổi mật khẩu"
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
    </AntdEdit>
  );
};
