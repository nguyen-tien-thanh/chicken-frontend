import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { useEffect } from "react";

import type { IRole } from "@/types";
import { PermissionIdsField } from "./permission-ids-field";

export const Edit = () => {
  const { form, formProps, saveButtonProps, query } = useForm({
    resource: "roles",
    meta: {
      include: {
        rolesPermissions: { select: { permissionId: true } },
      },
    },
  });

  useEffect(() => {
    const row = query?.data?.data as IRole | undefined;
    if (!row) return;
    form.setFieldsValue({
      permissionIds:
        row.rolesPermissions?.map((rp) => rp.permissionId).filter(Boolean) ??
        [],
    });
  }, [query?.data?.data, form]);

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <PermissionIdsField />
      </Form>
    </AntdEdit>
  );
};
