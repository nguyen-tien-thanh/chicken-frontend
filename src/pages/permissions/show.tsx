import { Show as AntdShow, TextField } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Tag, Typography } from 'antd';

import { RelativeTime } from '@/components/relative-time';
import type { IPermission } from '@/types';

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<IPermission>({});
  const { isLoading } = query;

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>Mã</Title>
      <TextField value={record?.id} />
      <Title level={5}>Đường dẫn</Title>
      <TextField value={record?.path} />
      <Title level={5}>Phương thức</Title>
      {record?.method ? <Tag color="blue">{record.method}</Tag> : null}
      <Title level={5}>Mô tả</Title>
      <TextField value={record?.description} />
      <Title level={5}>Mặc định</Title>
      <TextField value={record?.default ? 'Có' : 'Không'} />
      <Title level={5}>Ngày tạo</Title>
      <RelativeTime value={record?.createdAt} />
      <Title level={5}>Cập nhật</Title>
      <RelativeTime value={record?.updatedAt} />
    </AntdShow>
  );
};
