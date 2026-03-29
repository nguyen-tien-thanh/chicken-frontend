import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Tag, Typography } from "antd";

import type { IPermission } from "../../types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<IPermission>({});
  const { isLoading } = query;

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />
      <Title level={5}>Path</Title>
      <TextField value={record?.path} />
      <Title level={5}>Method</Title>
      {record?.method ? <Tag color="blue">{record.method}</Tag> : null}
      <Title level={5}>Mô tả</Title>
      <TextField value={record?.description} />
      <Title level={5}>Mặc định</Title>
      <TextField value={record?.default ? "Có" : "Không"} />
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
