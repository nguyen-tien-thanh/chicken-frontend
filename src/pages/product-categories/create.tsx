import { Create as AntdCreate, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const Create = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <AntdCreate saveButtonProps={saveButtonProps}>
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
    </AntdCreate>
  );
};
