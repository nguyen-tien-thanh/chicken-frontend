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
        <Form.Item
          label="Đường dẫn"
          name="path"
          rules={[{ required: true, message: "Vui lòng nhập đường dẫn" }]}
        >
          <Input placeholder="Ví dụ: /users, /api/roles" />
        </Form.Item>
        <Form.Item
          label="Phương thức"
          name="method"
          rules={[{ required: true, message: "Chọn phương thức HTTP" }]}
        >
          <Select options={HTTP_METHODS.map((m) => ({ value: m, label: m }))} />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
