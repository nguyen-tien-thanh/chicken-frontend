import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Create as AntdCreate, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import type { FormProps } from "antd";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

import type { ICustomer, IProduct } from "@/types";
import { SALE_STATUS_OPTIONS, type SaleStatus } from "@/types";
import { formatMoney } from "@/utils";

const { Text } = Typography;

type LineItem = {
  productId?: string;
  quantity?: number;
  quantityUnit?: "kg" | "con";
  unitPrice?: number;
  note?: string;
};

type FormValues = {
  customerId?: string;
  saleDate?: dayjs.Dayjs;
  discountAmount?: number;
  paidAmount?: number;
  status?: SaleStatus;
  note?: string;
  lineItems?: LineItem[];
};

function formatMoneyVnd(n: number) {
  return formatMoney(n, { currencySuffix: "đ" });
}

function SaleTotalsSummary() {
  const form = Form.useFormInstance();
  const lines = Form.useWatch("lineItems", form) as LineItem[] | undefined;
  const discount = Number(
    (Form.useWatch("discountAmount", form) as number | undefined) ?? 0
  );
  const paid = Number(
    (Form.useWatch("paidAmount", form) as number | undefined) ?? 0
  );

  const subtotal = (lines ?? []).reduce((sum, row) => {
    if (!row?.productId) return sum;
    const q = Number(row.quantity ?? 0);
    const p = Number(row.unitPrice ?? 0);
    return sum + q * p;
  }, 0);
  const finalAmount = Math.max(0, subtotal - discount);
  const remaining = Math.max(0, finalAmount - paid);

  return (
    <div
      style={{
        marginTop: 8,
        padding: "12px 16px",
        background: "var(--ant-color-fill-quaternary)",
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text type="secondary">Tạm tính</Text>
        <Text strong>{formatMoneyVnd(subtotal)}</Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text type="secondary">Sau giảm giá</Text>
        <Text strong>{formatMoneyVnd(finalAmount)}</Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text type="secondary">Còn phải thu</Text>
        <Text strong>{formatMoneyVnd(remaining)}</Text>
      </div>
    </div>
  );
}

function LineItemsTable({
  productOptions,
  productsQuery,
  onSearchProduct,
  remove,
  fields,
}: {
  productOptions: { label?: React.ReactNode; value?: string | number }[];
  productsQuery: { isFetching: boolean };
  onSearchProduct: (value: string) => void;
  remove: (index: number | number[]) => void;
  fields: { key: number; name: number }[];
}) {
  const form = Form.useFormInstance();
  const lines =
    (Form.useWatch("lineItems", form) as LineItem[] | undefined) ?? [];

  return (
    <Table
      rowKey="key"
      dataSource={fields}
      pagination={false}
      size="small"
      scroll={{ x: true }}
      columns={[
        {
          title: "#",
          width: 44,
          render: (_: unknown, f) => (
            <Typography.Text type="secondary">{f.name + 1}</Typography.Text>
          ),
        },
        {
          title: "Sản phẩm",
          width: 360,
          render: (_: unknown, f) => (
            <Form.Item
              name={["lineItems", f.name, "productId"]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Chọn sản phẩm"
                options={productOptions}
                loading={productsQuery.isFetching}
                showSearch
                onSearch={onSearchProduct}
                filterOption={false}
                optionFilterProp="label"
                allowClear
              />
            </Form.Item>
          ),
        },
        {
          title: "Số lượng",
          width: 120,
          render: (_: unknown, f) => (
            <Form.Item
              name={["lineItems", f.name, "quantity"]}
              rules={[{ required: true, message: "Nhập số lượng" }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
          ),
        },
        {
          title: "Đơn vị",
          width: 110,
          render: (_: unknown, f) => (
            <Form.Item
              name={["lineItems", f.name, "quantityUnit"]}
              style={{ marginBottom: 0 }}
              initialValue="kg"
            >
              <Select
                options={[
                  { value: "kg", label: "kg" },
                  { value: "con", label: "con" },
                ]}
                placeholder="Chọn"
              />
            </Form.Item>
          ),
        },
        {
          title: "Đơn giá",
          width: 150,
          render: (_: unknown, f) => (
            <Form.Item
              name={["lineItems", f.name, "unitPrice"]}
              rules={[{ required: true, message: "Nhập giá" }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber min={0} step={1000} style={{ width: "100%" }} />
            </Form.Item>
          ),
        },
        {
          title: "Thành tiền",
          width: 160,
          render: (_: unknown, f) => {
            const row = lines[f.name];
            const amount =
              Number(row?.quantity ?? 0) * Number(row?.unitPrice ?? 0);
            return (
              <Typography.Text strong>{formatMoneyVnd(amount)}</Typography.Text>
            );
          },
        },
        {
          title: "Ghi chú",
          width: 220,
          render: (_: unknown, f) => (
            <Form.Item
              name={["lineItems", f.name, "note"]}
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Tuỳ chọn" />
            </Form.Item>
          ),
        },
        {
          title: "",
          width: 52,
          fixed: "right",
          render: (_: unknown, f) => (
            <Tooltip title="Xoá dòng">
              <Button
                danger
                type="text"
                icon={<MinusCircleOutlined />}
                onClick={() => remove(f.name)}
              />
            </Tooltip>
          ),
        },
      ]}
    />
  );
}

export const Create = () => {
  const [searchParams] = useSearchParams();
  const customerIdFromQuery = searchParams.get("customerId") ?? undefined;

  const defaultFormValues = useMemo(
    () => ({
      ...(customerIdFromQuery ? { customerId: customerIdFromQuery } : {}),
      saleDate: dayjs(),
      discountAmount: 0,
      paidAmount: 0,
      status: "PENDING" as SaleStatus,
      lineItems: [
        {
          quantityUnit: "kg",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }),
    [customerIdFromQuery]
  );

  const { formProps, saveButtonProps } = useForm({
    resource: "sales",
    defaultFormValues: defaultFormValues as never,
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

  const {
    options: productOptions,
    onSearch: onSearchProduct,
    query: productsQuery,
  } = useSelect({
    resource: "products",
    optionLabel: (item: IProduct) => item.name,
    optionValue: (item: IProduct) => item.id,
  });

  const onFinish: FormProps["onFinish"] = (values) => {
    const v = values as FormValues;
    const rawLines = v.lineItems ?? [];
    const lineItems = rawLines.filter((row) => row?.productId);
    if (lineItems.length === 0) {
      void message.error("Thêm ít nhất một dòng có chọn sản phẩm");
      return Promise.resolve();
    }
    const discountAmount = Number(v.discountAmount ?? 0);
    const paidAmount = Number(v.paidAmount ?? 0);
    const items = lineItems.map((row) => {
      const qty = Number(row.quantity ?? 0);
      const price = Number(row.unitPrice ?? 0);
      const amount = qty * price;
      return {
        productId: row.productId!,
        quantity: qty,
        quantityUnit: row.quantityUnit || "kg",
        unitPrice: price,
        amount,
        note: row.note ?? null,
      };
    });
    const saleDate = v.saleDate
      ? dayjs(v.saleDate).toISOString()
      : dayjs().toISOString();
    const payload = {
      customerId: v.customerId,
      saleDate,
      note: v.note ?? null,
      discountAmount,
      paidAmount,
      status: v.status ?? "PENDING",
      items,
    };
    return formProps.onFinish?.(payload as never) ?? Promise.resolve();
  };

  return (
    <AntdCreate saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Khách hàng"
          name="customerId"
          rules={[{ required: true, message: "Chọn khách hàng" }]}
        >
          <Select
            options={customerOptions}
            loading={customersQuery.isFetching}
            showSearch
            onSearch={onSearchCustomer}
            filterOption={false}
            optionFilterProp="label"
            placeholder="Chọn khách hàng"
          />
        </Form.Item>
        <Form.Item
          label="Ngày bán"
          name="saleDate"
          rules={[{ required: true }]}
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
        <Form.Item label="Trạng thái" name="status">
          <Select options={SALE_STATUS_OPTIONS} />
        </Form.Item>
        <Form.Item label="Ghi chú phiếu" name="note">
          <Input.TextArea rows={2} placeholder="Tuỳ chọn" />
        </Form.Item>

        <Form.Item label="Chi tiết hàng bán">
          <Form.List name="lineItems">
            {(fields, { add, remove }) => (
              <>
                <Space
                  style={{
                    width: "100%",
                    marginBottom: 8,
                    justifyContent: "space-between",
                  }}
                  wrap
                >
                  <Typography.Text type="secondary">
                    Thêm sản phẩm, số lượng, đơn giá. Hệ thống tự tính thành
                    tiền.
                  </Typography.Text>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      add({
                        quantityUnit: "kg",
                        quantity: 1,
                        unitPrice: 0,
                      })
                    }
                  >
                    Thêm dòng
                  </Button>
                </Space>
                <LineItemsTable
                  fields={fields}
                  remove={remove}
                  productOptions={productOptions}
                  productsQuery={productsQuery}
                  onSearchProduct={onSearchProduct}
                />
                <SaleTotalsSummary />
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
