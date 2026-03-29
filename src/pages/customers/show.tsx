import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

import { RelativeTime } from "@/components/relative-time";
import type { ICustomer } from "@/types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<ICustomer>({});
  const { isLoading } = query;

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>Mã</Title>
      <TextField value={record?.id} />
      <Title level={5}>Tên</Title>
      <TextField value={record?.name} />
      <Title level={5}>Điện thoại</Title>
      <TextField value={record?.phone} />
      <Title level={5}>Địa chỉ</Title>
      <TextField value={record?.address} />
      <Title level={5}>Ngày tạo</Title>
      <RelativeTime value={record?.createdAt} />
      <Title level={5}>Cập nhật</Title>
      <RelativeTime value={record?.updatedAt} />
    </AntdShow>
  );
};
