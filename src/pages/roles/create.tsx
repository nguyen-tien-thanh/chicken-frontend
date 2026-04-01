import { Create as AntdCreate, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';

import { PermissionIdsField } from './permission-ids-field';

export const Create = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: 'roles',
  });

  return (
    <AntdCreate saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <PermissionIdsField />
      </Form>
    </AntdCreate>
  );
};
