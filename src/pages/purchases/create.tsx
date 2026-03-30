import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Create as AntdCreate, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import type { FormProps } from "antd";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
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

import { InputMoney } from "@/components";
import type { IProduct, ISupplier } from "@/types";
import { formatMoney } from "@/utils";
import { useWatch } from "antd/es/form/Form";
import useFormInstance from "antd/es/form/hooks/useFormInstance";

const { Text } = Typography;

type LineItem = {
  productId?: string;
  quantity?: number;
  quantityUnit?: "kg" | "con";
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

function formatMoneyVnd(n: number) {
  return formatMoney(n, { currencySuffix: "đ" });
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
        {formatMoneyVnd(total)}
      </Text>
    </div>
  );
}

// TODO: Fix error change field data A then another field reset
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
  const form = useFormInstance();
  const lines = useWatch("lineItems", form) as LineItem[];

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
              initialValue="kg"
              style={{ marginBottom: 0 }}
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
          width: 160,
          render: (_: unknown, f) => (
            <Form.Item
              name={["lineItems", f.name, "unitPrice"]}
              rules={[{ required: true, message: "Nhập giá" }]}
              style={{ marginBottom: 0 }}
            >
              <InputMoney />
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
          title: "TB TL/ĐV",
          width: 140,
          render: (_: unknown, f) => (
            <Form.Item
              name={["lineItems", f.name, "avgWeightPerUnit"]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
          ),
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
    [supplierIdFromQuery],
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

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trọng lượng trung bình (kg/con)"
              name="averageWeight"
              rules={[
                {
                  required: true,
                  message: "Nhập Trọng lượng trung bình",
                },
              ]}
            >
              <InputNumber
                suffix="kg/con"
                style={{ width: "100%" }}
                placeholder="Trọng lượng trung bình"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Số lượng lồng"
              name="cagesCount"
              rules={[{ required: true, message: "Nhập số lượng lồng" }]}
            >
              <InputNumber
                suffix="lồng"
                style={{ width: "100%" }}
                placeholder="Số lượng lồng"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tổng trọng lượng lồng"
              name="cagesWeight"
              rules={[
                { required: true, message: "Nhập tổng trọng lượng lồng" },
              ]}
            >
              <InputNumber
                suffix="kg"
                style={{ width: "100%" }}
                placeholder="Tổng trọng lượng lồng"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú phiếu" name="note">
          <Input.TextArea rows={2} placeholder="Tuỳ chọn" />
        </Form.Item>

        <Form.Item label="Chi tiết hàng nhập">
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
                        avgWeightPerUnit: 0,
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
                <LineItemsTotal />
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
