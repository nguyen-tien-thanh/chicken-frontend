import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import type { FormProps } from "antd";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";

import type { ISupplier } from "@/types";

export const Edit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "purchases",
    meta: {
      include: {
        supplier: { select: { id: true, name: true, phone: true } },
      },
    },
  });

  const {
    options: supplierOptions,
    onSearch: onSearchSupplier,
    query: suppliersQuery,
  } = useSelect({
    resource: "suppliers",
    optionLabel: (item: ISupplier) => `${item.name} (${item.phone})`,
    optionValue: (item: ISupplier) => item.id,
  });

  const onFinish: FormProps["onFinish"] = (values) => {
    const next = { ...(values as Record<string, unknown>) };
    delete next.purchaseItems;
    const pd = next.purchaseDate;
    if (pd != null && dayjs.isDayjs(pd)) {
      next.purchaseDate = (pd as dayjs.Dayjs).toISOString();
    }
    return formProps.onFinish?.(next as never);
  };

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nhà cung cấp"
          name="supplierId"
          rules={[{ required: true }]}
        >
          <Select
            options={supplierOptions}
            loading={suppliersQuery.isFetching}
            showSearch
            onSearch={onSearchSupplier}
            filterOption={false}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          label="Ngày nhập"
          name="purchaseDate"
          rules={[{ required: true }]}
          getValueProps={(value) => ({
            value:
              value && dayjs(value as string).isValid()
                ? dayjs(value as string)
                : undefined,
          })}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
          />
        </Form.Item>
        <Form.Item
          label="Tổng tiền"
          name="totalAmount"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} step={1000} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </AntdEdit>
  );
};
