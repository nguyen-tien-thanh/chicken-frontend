import { Create as AntdCreate, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

import { HTTP_METHODS } from "./constants";

export const Create = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "permissions",
  });

  return (
    <AntdCreate saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Path" name="path" rules={[{ required: true }]}>
          <Input placeholder="vd: /users, /api/roles" />
        </Form.Item>
        <Form.Item label="Method" name="method" rules={[{ required: true }]}>
          <Select options={HTTP_METHODS.map((m) => ({ value: m, label: m }))} />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
