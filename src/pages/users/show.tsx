import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

import type { IUser } from "../../types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<IUser>({
    meta: {
      include: {
        role: { select: { id: true, name: true, description: true } },
      },
    },
  });
  const { isLoading } = query;

  const role = record?.role;

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />
      <Title level={5}>Email</Title>
      <TextField value={record?.email} />
      <Title level={5}>Tên</Title>
      <TextField value={record?.name} />
      <Title level={5}>Vai trò</Title>
      <TextField value={role?.name ?? record?.roleId} />
      {role?.description ? (
        <>
          <Title level={5}>Mô tả vai trò</Title>
          <TextField value={role.description} />
        </>
      ) : null}
      <Title level={5}>Ngày tạo</Title>
      <TextField
        value={
          record?.createdAt
            ? new Date(record.createdAt).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Cập nhật</Title>
      <TextField
        value={
          record?.updatedAt
            ? new Date(record.updatedAt).toLocaleString("vi-VN")
            : undefined
        }
      />
    </AntdShow>
  );
};
