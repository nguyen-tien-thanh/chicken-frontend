import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Create as AntdCreate, useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/core";
import type { FormProps } from "antd";
import {
  App,
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
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useSearchParams } from "react-router";

import { InputMoney } from "@/components";
import type { IProduct, ISupplier } from "@/types";
import { formatMoney } from "@/utils";

const { Text } = Typography;

type LineItem = {
  key: number;
  productId?: string;
  quantity: number;
  quantityUnit: "kg" | "con";
  unitPrice: number;
  note?: string;
};

type FormValues = {
  supplierId?: string;
  purchaseDate?: dayjs.Dayjs;
  note?: string;
  averageWeight?: number;
  cagesCount?: number;
  cagesWeight?: number;
};

let nextKey = 1;
function newRow(): LineItem {
  return {
    key: nextKey++,
    quantityUnit: "kg",
    quantity: 1,
    unitPrice: 0,
  };
}

export const Create = () => {
  const { notification } = App.useApp();
  const [searchParams] = useSearchParams();
  const supplierIdFromQuery = searchParams.get("supplierId") ?? undefined;

  const [lines, setLines] = useState<LineItem[]>([newRow()]);

  const { formProps, saveButtonProps } = useForm({
    resource: "purchases",
    defaultFormValues: {
      ...(supplierIdFromQuery ? { supplierId: supplierIdFromQuery } : {}),
      purchaseDate: dayjs(),
    } as never,
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

  function updateLine<K extends keyof LineItem>(
    key: number,
    field: K,
    value: LineItem[K],
  ) {
    setLines((prev) =>
      prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    );
  }

  function removeLine(key: number) {
    setLines((prev) => prev.filter((row) => row.key !== key));
  }

  const total = lines.reduce((sum, row) => {
    if (!row.productId) return sum;
    return sum + row.quantity * row.unitPrice;
  }, 0);

  const onFinish: FormProps["onFinish"] = (values) => {
    const v = values as FormValues;
    const validLines = lines.filter((row) => row.productId);
    if (validLines.length === 0) {
      notification.warning({
        message: "Thêm ít nhất một dòng có chọn sản phẩm",
      });
      return Promise.resolve();
    }
    const items = validLines.map((row) => ({
      productId: row.productId!,
      quantity: row.quantity,
      quantityUnit: row.quantityUnit,
      unitPrice: row.unitPrice,
      amount: row.quantity * row.unitPrice,
      note: row.note ?? null,
    }));
    const payload = {
      supplierId: v.supplierId,
      purchaseDate: v.purchaseDate
        ? dayjs(v.purchaseDate).toISOString()
        : dayjs().toISOString(),
      note: v.note ?? null,
      averageWeight: Number(v.averageWeight ?? 0),
      cagesCount: Number(v.cagesCount ?? 0),
      cagesWeight: Number(v.cagesWeight ?? 0),
      items,
    };
    return formProps.onFinish?.(payload as never) ?? Promise.resolve();
  };

  const columns = [
    {
      title: "#",
      width: 44,
      render: (_: unknown, _row: LineItem, index: number) => (
        <Text type="secondary">{index + 1}</Text>
      ),
    },
    {
      title: "Sản phẩm",
      width: 360,
      render: (_: unknown, row: LineItem) => (
        <Select
          placeholder="Chọn sản phẩm"
          value={row.productId}
          options={productOptions}
          loading={productsQuery.isFetching}
          showSearch
          onSearch={onSearchProduct}
          filterOption={false}
          optionFilterProp="label"
          allowClear
          style={{ width: "100%" }}
          onChange={(v) => updateLine(row.key, "productId", v)}
        />
      ),
    },
    {
      title: "Số lượng",
      width: 120,
      render: (_: unknown, row: LineItem) => (
        <InputNumber
          min={0}
          step={0.1}
          style={{ width: "100%" }}
          value={row.quantity}
          onChange={(v) => updateLine(row.key, "quantity", v ?? 0)}
        />
      ),
    },
    {
      title: "Đơn vị",
      width: 110,
      render: (_: unknown, row: LineItem) => (
        <Select
          value={row.quantityUnit}
          options={[
            { value: "kg", label: "kg" },
            { value: "con", label: "con" },
          ]}
          style={{ width: "100%" }}
          onChange={(v) => updateLine(row.key, "quantityUnit", v)}
        />
      ),
    },
    {
      title: "Đơn giá",
      width: 160,
      render: (_: unknown, row: LineItem) => (
        <InputMoney
          value={row.unitPrice}
          onChange={(v) => updateLine(row.key, "unitPrice", (v as number) ?? 0)}
        />
      ),
    },
    {
      title: "Thành tiền",
      width: 160,
      render: (_: unknown, row: LineItem) => (
        <Text strong>{formatMoney(row.quantity * row.unitPrice)}</Text>
      ),
    },
    {
      title: "Ghi chú",
      width: 220,
      render: (_: unknown, row: LineItem) => (
        <Input
          placeholder="Tuỳ chọn"
          value={row.note}
          onChange={(e) => updateLine(row.key, "note", e.target.value)}
        />
      ),
    },
    {
      title: "",
      width: 52,
      fixed: "right" as const,
      render: (_: unknown, row: LineItem) => (
        <Tooltip title="Xoá dòng">
          <Button
            danger
            type="text"
            icon={<MinusCircleOutlined />}
            onClick={() => removeLine(row.key)}
          />
        </Tooltip>
      ),
    },
  ];

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
              rules={[{ required: true, message: "Chọn ngày nhập" }]}
            >
              <DatePicker
                showTime={false}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
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
          <Space
            style={{
              width: "100%",
              marginBottom: 8,
              justifyContent: "space-between",
            }}
            wrap
          >
            <Text type="secondary">
              Thêm sản phẩm, số lượng, đơn giá. Hệ thống tự tính thành tiền.
            </Text>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setLines((prev) => [...prev, newRow()])}
            >
              Thêm dòng
            </Button>
          </Space>
          <Table
            rowKey="key"
            dataSource={lines}
            columns={columns}
            pagination={false}
            size="small"
            scroll={{ x: true }}
          />
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
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
