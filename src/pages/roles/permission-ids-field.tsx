import { useSelect } from "@refinedev/core";
import { Form, Select } from "antd";

import type { IPermission } from "../../types";

type Props = {
  name?: string;
  label?: string;
};

export const PermissionIdsField = ({
  name = "permissionIds",
  label = "Quyền",
}: Props) => {
  const { options, onSearch, query } = useSelect({
    resource: "permissions",
    optionLabel: (item: IPermission) =>
      `${item.method ?? ""} ${item.path ?? ""}`.trim(),
    optionValue: (item: IPermission) => item.id,
    onSearch: (value) => [{ field: "path", operator: "contains", value }],
    pagination: { mode: "server", pageSize: 50 },
  });

  return (
    <Form.Item
      name={name}
      label={label}
      extra="Gán quyền cho vai trò (đồng bộ bảng nối role–permission trên API)."
    >
      <Select
        mode="multiple"
        allowClear
        options={options}
        loading={query.isFetching}
        showSearch
        onSearch={onSearch}
        filterOption={false}
        optionFilterProp="label"
        placeholder="Chọn một hoặc nhiều quyền"
      />
    </Form.Item>
  );
};
