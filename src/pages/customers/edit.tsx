import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const Edit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "customers",
  });

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tên" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Điện thoại" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </AntdEdit>
  );
};
