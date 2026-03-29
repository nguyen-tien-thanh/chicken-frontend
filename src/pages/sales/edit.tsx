import { Edit as AntdEdit, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import type { FormProps } from "antd";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";

import type { ICustomer } from "@/types";
import { SALE_STATUS_OPTIONS } from "@/types";

export const Edit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "sales",
    meta: {
      include: {
        customer: { select: { id: true, name: true, phone: true } },
      },
    },
  });

  const {
    options: customerOptions,
    onSearch: onSearchCustomer,
    query: customersQuery,
  } = useSelect({
    resource: "customers",
    optionLabel: (item: ICustomer) =>
      `${item.name ?? item.phone} (${item.phone})`,
    optionValue: (item: ICustomer) => item.id,
  });

  const onFinish: FormProps["onFinish"] = (values) => {
    const next = { ...(values as Record<string, unknown>) };
    delete next.saleItems;
    delete next.subtotalAmount;
    delete next.finalAmount;
    delete next.remainingAmount;
    const sd = next.saleDate;
    if (sd != null && dayjs.isDayjs(sd)) {
      next.saleDate = (sd as dayjs.Dayjs).toISOString();
    }
    return formProps.onFinish?.(next as never);
  };

  return (
    <AntdEdit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Khách hàng"
          name="customerId"
          rules={[{ required: true }]}
        >
          <Select
            options={customerOptions}
            loading={customersQuery.isFetching}
            showSearch
            onSearch={onSearchCustomer}
            filterOption={false}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          label="Ngày bán"
          name="saleDate"
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
        <Form.Item label="Giảm giá" name="discountAmount">
          <InputNumber min={0} step={1000} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Đã thanh toán" name="paidAmount">
          <InputNumber min={0} step={1000} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true }]}
        >
          <Select options={SALE_STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </AntdEdit>
  );
};
