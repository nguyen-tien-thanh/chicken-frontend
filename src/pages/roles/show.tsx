import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { List, Tag, Typography } from "antd";

import { RelativeTime } from "@/components/relative-time";
import type { IPermission, IRole } from "@/types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<IRole>({
    meta: {
      include: {
        rolesPermissions: {
          include: {
            permission: {
              select: {
                path: true,
                method: true,
                description: true,
              },
            },
          },
        },
      },
    },
  });
  const { isLoading } = query;

  const links = record?.rolesPermissions ?? [];

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />
      <Title level={5}>Tên</Title>
      <TextField value={record?.name} />
      <Title level={5}>Mô tả</Title>
      <TextField value={record?.description} />
      <Title level={5}>Quyền</Title>
      {links.length > 0 ? (
        <List
          size="small"
          dataSource={links}
          renderItem={(rp) => {
            const p = rp.permission as
              | Pick<IPermission, "path" | "method" | "description">
              | undefined;
            if (p?.path) {
              return (
                <List.Item>
                  <Tag color="blue">{p.method}</Tag> {p.path}
                  {p.description ? (
                    <span style={{ color: "var(--ant-color-text-secondary)" }}>
                      {" "}
                      — {p.description}
                    </span>
                  ) : null}
                </List.Item>
              );
            }
            return (
              <List.Item>
                <TextField value={rp.permissionId} />
              </List.Item>
            );
          }}
        />
      ) : (
        <TextField value="—" />
      )}
      <Title level={5}>Ngày tạo</Title>
      <RelativeTime value={record?.createdAt} />
      <Title level={5}>Cập nhật</Title>
      <RelativeTime value={record?.updatedAt} />
    </AntdShow>
  );
};
