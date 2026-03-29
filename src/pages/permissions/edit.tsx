import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

import { HTTP_METHODS } from "./constants";

export const Edit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "permissions",
  });

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Path" name="path" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Method" name="method" rules={[{ required: true }]}>
          <Select options={HTTP_METHODS.map((m) => ({ value: m, label: m }))} />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </AntdEdit>
  );
};
