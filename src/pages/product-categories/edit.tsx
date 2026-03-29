import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const Edit = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Name"}
          name={["name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </AntdEdit>
  );
};
