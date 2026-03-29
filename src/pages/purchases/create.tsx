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
  message,
} from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

import type { IProduct, ISupplier } from "@/types";

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
    const totalAmount = create.reduce((s, x) => s + x.amount, 0);
    const purchaseDate = v.purchaseDate
      ? dayjs(v.purchaseDate).toISOString()
      : dayjs().toISOString();
    const payload = {
      supplierId: v.supplierId,
      purchaseDate,
      totalAmount,
      note: v.note ?? null,
      purchaseItems: { create },
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
        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.List name="lineItems">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8, flexWrap: "wrap" }}
                  align="start"
                >
                  <Form.Item {...restField} name={[name, "productId"]}>
                    <Select
                      placeholder="Sản phẩm"
                      style={{ minWidth: 200 }}
                      options={productOptions}
                      loading={productsQuery.isFetching}
                      showSearch
                      onSearch={onSearchProduct}
                      filterOption={false}
                      optionFilterProp="label"
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Nhập số lượng" }]}
                  >
                    <InputNumber min={0} step={0.01} placeholder="Số lượng" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "quantityUnit"]}>
                    <Input placeholder="ĐVT" style={{ width: 72 }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "unitPrice"]}
                    rules={[{ required: true, message: "Nhập đơn giá" }]}
                  >
                    <InputNumber min={0} step={1000} placeholder="Đơn giá" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "avgWeightPerUnit"]}>
                    <InputNumber min={0} step={0.01} placeholder="TB kg/ĐV" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "note"]}>
                    <Input placeholder="Ghi chú" style={{ width: 140 }} />
                  </Form.Item>
                  <MinusCircleOutlined
                    style={{ marginTop: 8, cursor: "pointer" }}
                    onClick={() => remove(name)}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm dòng hàng
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </AntdCreate>
  );
};
