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

import type { IProduct, ISupplier } from "@/types";

const { Text } = Typography;

type LineItem = {
  productId?: string;
  quantity?: number;
  quantityUnit?: string;
  unitPrice?: number;
  avgWeightPerUnit?: number;
  note?: string;
};

type FormValues = {
  supplierId?: string;
  purchaseDate?: dayjs.Dayjs;
  note?: string;
  lineItems?: LineItem[];
};

function formatMoney(n: number) {
  return `${n.toLocaleString("vi-VN")} đ`;
}

function LineItemsTotal() {
  const form = Form.useFormInstance();
  const lines = Form.useWatch("lineItems", form) as LineItem[] | undefined;
  const total = (lines ?? []).reduce((sum, row) => {
    if (!row?.productId) return sum;
    const q = Number(row.quantity ?? 0);
    const p = Number(row.unitPrice ?? 0);
    return sum + q * p;
  }, 0);

  return (
    <div
      style={{
        marginTop: 8,
        padding: "12px 16px",
        background: "var(--ant-color-fill-quaternary)",
        borderRadius: 8,
        textAlign: "right",
      }}
    >
      <Text type="secondary">Tổng thành tiền (ước tính): </Text>
      <Text strong style={{ fontSize: 16 }}>
        {formatMoney(total)}
      </Text>
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

function PurchaseLineRow({
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
        <Col xs={12} sm={8} lg={4}>
          <Form.Item
            {...restField}
            name={[name, "avgWeightPerUnit"]}
            label="TB trọng lượng / ĐV"
            tooltip="Trung bình khối lượng một đơn vị (nếu có)"
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              placeholder="0"
            />
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
  const supplierIdFromQuery = searchParams.get("supplierId") ?? undefined;

  const defaultFormValues = useMemo(
    () => ({
      ...(supplierIdFromQuery ? { supplierId: supplierIdFromQuery } : {}),
      purchaseDate: dayjs(),
      lineItems: [
        {
          quantityUnit: "kg",
          quantity: 1,
          unitPrice: 0,
          avgWeightPerUnit: 0,
        },
      ],
    }),
    [supplierIdFromQuery]
  );

  const { formProps, saveButtonProps } = useForm({
    resource: "purchases",
    defaultFormValues: defaultFormValues as never,
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
    const create = lineItems.map((row) => {
      const qty = Number(row.quantity ?? 0);
      const price = Number(row.unitPrice ?? 0);
      const amount = qty * price;
      return {
        productId: row.productId!,
        quantity: qty,
        quantityUnit: row.quantityUnit || "kg",
        unitPrice: price,
        amount,
        avgWeightPerUnit: Number(row.avgWeightPerUnit ?? 0),
        note: row.note ?? null,
      };
    });
    const purchaseDate = v.purchaseDate
      ? dayjs(v.purchaseDate).toISOString()
      : dayjs().toISOString();
    const payload = {
      supplierId: v.supplierId,
      purchaseDate,
      note: v.note ?? null,
      items: create,
    };
    return formProps.onFinish?.(payload as never) ?? Promise.resolve();
  };

  return (
    <AntdCreate saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nhà cung cấp"
          name="supplierId"
          rules={[{ required: true, message: "Chọn nhà cung cấp" }]}
        >
          <Select
            options={supplierOptions}
            loading={suppliersQuery.isFetching}
            showSearch
            onSearch={onSearchSupplier}
            filterOption={false}
            optionFilterProp="label"
            placeholder="Chọn nhà cung cấp"
          />
        </Form.Item>
        <Form.Item
          label="Ngày nhập"
          name="purchaseDate"
          rules={[{ required: true }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
          />
        </Form.Item>
        <Form.Item label="Ghi chú phiếu" name="note">
          <Input.TextArea rows={2} placeholder="Tuỳ chọn" />
        </Form.Item>

        <Form.Item label="Chi tiết hàng nhập">
          <Form.List name="lineItems">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <PurchaseLineRow
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
                      avgWeightPerUnit: 0,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 8 }}
                >
                  Thêm dòng hàng
                </Button>
                <LineItemsTotal />
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
