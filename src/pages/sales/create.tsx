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
import type { ICustomer, IProduct } from "@/types";
import { SALE_STATUS_OPTIONS, type SaleStatus } from "@/types";
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
  customerId?: string;
  saleDate?: dayjs.Dayjs;
  discountAmount?: number;
  paidAmount?: number;
  status?: SaleStatus;
  note?: string;
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
  const customerIdFromQuery = searchParams.get("customerId") ?? undefined;

  const [lines, setLines] = useState<LineItem[]>([newRow()]);

  const { formProps, saveButtonProps } = useForm({
    resource: "sales",
    defaultFormValues: {
      ...(customerIdFromQuery ? { customerId: customerIdFromQuery } : {}),
      saleDate: dayjs(),
      discountAmount: 0,
      paidAmount: 0,
      status: "PENDING" as SaleStatus,
    } as never,
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

  const subtotal = lines.reduce((sum, row) => {
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
    const discountAmount = Number(v.discountAmount ?? 0);
    const paidAmount = Number(v.paidAmount ?? 0);
    const items = validLines.map((row) => ({
      productId: row.productId!,
      quantity: row.quantity,
      quantityUnit: row.quantityUnit,
      unitPrice: row.unitPrice,
      amount: row.quantity * row.unitPrice,
      note: row.note ?? null,
    }));
    const payload = {
      customerId: v.customerId,
      saleDate: v.saleDate
        ? dayjs(v.saleDate).toISOString()
        : dayjs().toISOString(),
      note: v.note ?? null,
      discountAmount,
      paidAmount,
      status: v.status ?? "PENDING",
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngày bán"
              name="saleDate"
              rules={[{ required: true, message: "Chọn ngày bán" }]}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" name="status">
              <Select options={SALE_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giảm giá" name="discountAmount">
              <InputMoney style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Đã thanh toán" name="paidAmount">
              <InputMoney style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú phiếu" name="note">
          <Input.TextArea rows={2} placeholder="Tuỳ chọn" />
        </Form.Item>

        <Form.Item label="Chi tiết hàng bán">
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
              {formatMoney(subtotal)}
            </Text>
          </div>
        </Form.Item>
      </Form>
    </AntdCreate>
  );
};
