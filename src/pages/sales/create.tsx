import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Create as AntdCreate, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import type { FormProps } from "antd";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import type { FormListFieldData } from "antd/es/form";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

import type { ICustomer, IProduct } from "@/types";
import { SALE_STATUS_OPTIONS, type SaleStatus } from "@/types";

const { Text } = Typography;

type LineItem = {
  productId?: string;
  quantity?: number;
  quantityUnit?: string;
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

function formatMoney(n: number) {
  return `${n.toLocaleString("vi-VN")} đ`;
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
        <Text strong>{formatMoney(subtotal)}</Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text type="secondary">Sau giảm giá</Text>
        <Text strong>{formatMoney(finalAmount)}</Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text type="secondary">Còn phải thu</Text>
        <Text strong>{formatMoney(remaining)}</Text>
      </div>
    </div>
  );
}

type LineRowProps = {
  field: FormListFieldData;
  rowIndex: number;
  remove: (index: number | number[]) => void;
  productOptions: { label?: React.ReactNode; value?: string | number }[];
  productsQuery: { isFetching: boolean };
  onSearchProduct: (value: string) => void;
};

function SaleLineRow({
  field,
  rowIndex,
  remove,
  productOptions,
  productsQuery,
  onSearchProduct,
}: LineRowProps) {
  const { key, name, ...restField } = field;
  const form = Form.useFormInstance();
  const qty = Form.useWatch(["lineItems", name, "quantity"], form);
  const price = Form.useWatch(["lineItems", name, "unitPrice"], form);
  const lineAmount = Number(qty ?? 0) * Number(price ?? 0);

  return (
    <Card
      key={key}
      size="small"
      title={`Dòng hàng ${rowIndex + 1}`}
      style={{ marginBottom: 16 }}
      extra={
        <Button
          type="text"
          danger
          size="small"
          icon={<MinusCircleOutlined />}
          onClick={() => remove(name)}
        >
          Xóa dòng
        </Button>
      }
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item {...restField} name={[name, "productId"]} label="Sản phẩm">
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
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Form.Item
            {...restField}
            name={[name, "quantity"]}
            label="Số lượng"
            rules={[{ required: true, message: "Nhập số lượng" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Form.Item
            {...restField}
            name={[name, "quantityUnit"]}
            label="Đơn vị tính"
          >
            <Input placeholder="vd: kg" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Form.Item
            {...restField}
            name={[name, "unitPrice"]}
            label="Đơn giá"
            rules={[{ required: true, message: "Nhập đơn giá" }]}
          >
            <InputNumber
              min={0}
              step={1000}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Form.Item label="Thành tiền">
            <div
              style={{
                minHeight: 32,
                lineHeight: "32px",
                paddingInline: 11,
                background: "var(--ant-color-fill-tertiary)",
                borderRadius: 6,
              }}
            >
              <Text strong>{formatMoney(lineAmount)}</Text>
            </div>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item {...restField} name={[name, "note"]} label="Ghi chú dòng">
            <Input placeholder="Tuỳ chọn" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
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
                {fields.map((field, index) => (
                  <SaleLineRow
                    key={field.key}
                    field={field}
                    rowIndex={index}
                    remove={remove}
                    productOptions={productOptions}
                    productsQuery={productsQuery}
                    onSearchProduct={onSearchProduct}
                  />
                ))}
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      quantityUnit: "kg",
                      quantity: 1,
                      unitPrice: 0,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 8 }}
                >
                  Thêm dòng hàng
                </Button>
                <SaleTotalsSummary />
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
