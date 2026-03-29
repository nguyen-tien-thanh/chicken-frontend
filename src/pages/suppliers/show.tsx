import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Space, Typography } from "antd";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import type { ISupplier } from "@/types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<ISupplier>({});
  const { isLoading } = query;

  return (
    <AntdShow isLoading={isLoading}>
      <Space style={{ marginBottom: 16 }}>
        <Link to={`/purchases/create?supplierId=${record?.id ?? ""}`}>
          <Button type="primary" disabled={!record?.id}>
            Tạo phiếu nhập
          </Button>
        </Link>
        <Link
          to={record?.id ? `/purchases?supplierId=${record.id}` : "/purchases"}
        >
          <Button disabled={!record?.id}>Phiếu nhập của NCC</Button>
        </Link>
      </Space>
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
