import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow({});
  const { isLoading } = query;

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
    </AntdShow>
  );
};
