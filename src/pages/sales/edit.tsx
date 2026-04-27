import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Edit as AntdEdit, useForm } from '@refinedev/antd';
import { useSelect } from '@refinedev/core';
import type { FormProps } from 'antd';
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
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { InputMoney } from '@/components';
import type { ICustomer, IProduct, ISale, ISaleItem } from '@/types';
import { SALE_STATUS_OPTIONS } from '@/types';
import { formatMoney } from '@/utils';

const { Text } = Typography;

type LineItem = {
  key: number;
  id?: string;
  productId?: string;
  quantity: number;
  quantityUnit: 'kg' | 'con';
  unitPrice: number;
  note?: string;
};

let nextKey = 1;
function fromExisting(item: ISaleItem): LineItem {
  return {
    key: nextKey++,
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    quantityUnit: item.quantityUnit as 'kg' | 'con',
    unitPrice: item.unitPrice,
    note: item.note ?? undefined,
  };
}
function newRow(): LineItem {
  return {
    key: nextKey++,
    quantityUnit: 'kg',
    quantity: 1,
    unitPrice: 0,
  };
}

export const Edit = () => {
  const { notification } = App.useApp();
  const [lines, setLines] = useState<LineItem[]>([]);

  const { formProps, saveButtonProps, query } = useForm<ISale>({
    resource: 'sales',
    meta: {
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        saleItems: {
          include: {
            product: { select: { id: true, name: true, type: true } },
          },
        },
      },
    },
  });

  // Sync line items khi data load xong
  useEffect(() => {
    const data = query?.data?.data;
    if (data?.saleItems && lines.length === 0) {
      setLines(data.saleItems.map(fromExisting));
    }
  }, [query?.data?.data]);

  const {
    options: customerOptions,
    onSearch: onSearchCustomer,
    query: customersQuery,
  } = useSelect({
    resource: 'customers',
    optionLabel: (item: ICustomer) =>
      `${item.name ?? item.phone} (${item.phone})`,
    optionValue: (item: ICustomer) => item.id,
  });

  const {
    options: productOptions,
    onSearch: onSearchProduct,
    query: productsQuery,
  } = useSelect({
    resource: 'products',
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

  const onFinish: FormProps['onFinish'] = (values) => {
    const next = { ...(values as Record<string, unknown>) };
    delete next.saleItems;
    delete next.subtotalAmount;
    delete next.finalAmount;
    delete next.remainingAmount;
    const sd = next.saleDate;
    if (sd != null && dayjs.isDayjs(sd)) {
      next.saleDate = (sd as dayjs.Dayjs).toISOString();
    }
    const validLines = lines.filter((row) => row.productId);
    if (validLines.length === 0) {
      notification.warning({
        message: 'Thêm ít nhất một dòng có chọn sản phẩm',
      });
      return Promise.resolve();
    }
    next.items = validLines.map((row) => ({
      ...(row.id ? { id: row.id } : {}),
      productId: row.productId!,
      quantity: row.quantity,
      quantityUnit: row.quantityUnit,
      unitPrice: row.unitPrice,
      amount: row.quantity * row.unitPrice,
      note: row.note ?? null,
    }));
    return formProps.onFinish?.(next as never);
  };

  const columns = [
    {
      title: '#',
      width: 44,
      render: (_: unknown, _row: LineItem, index: number) => (
        <Text type="secondary">{index + 1}</Text>
      ),
    },
    {
      title: 'Sản phẩm',
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
          style={{ width: '100%' }}
          onChange={(v) => updateLine(row.key, 'productId', v)}
        />
      ),
    },
    {
      title: 'Số lượng',
      width: 120,
      render: (_: unknown, row: LineItem) => (
        <InputNumber
          min={0}
          step={0.1}
          style={{ width: '100%' }}
          value={row.quantity}
          onChange={(v) => updateLine(row.key, 'quantity', v ?? 0)}
        />
      ),
    },
    {
      title: 'Đơn vị',
      width: 110,
      render: (_: unknown, row: LineItem) => (
        <Select
          value={row.quantityUnit}
          options={[
            { value: 'kg', label: 'kg' },
            { value: 'con', label: 'con' },
          ]}
          style={{ width: '100%' }}
          onChange={(v) => updateLine(row.key, 'quantityUnit', v)}
        />
      ),
    },
    {
      title: 'Đơn giá',
      width: 160,
      render: (_: unknown, row: LineItem) => (
        <InputMoney
          value={row.unitPrice}
          onChange={(v) => updateLine(row.key, 'unitPrice', (v as number) ?? 0)}
        />
      ),
    },
    {
      title: 'Thành tiền',
      width: 160,
      render: (_: unknown, row: LineItem) => (
        <Text strong>{formatMoney(row.quantity * row.unitPrice)}</Text>
      ),
    },
    {
      title: 'Ghi chú',
      width: 220,
      render: (_: unknown, row: LineItem) => (
        <Input
          placeholder="Tuỳ chọn"
          value={row.note}
          onChange={(e) => updateLine(row.key, 'note', e.target.value)}
        />
      ),
    },
    {
      title: '',
      width: 52,
      fixed: 'right' as const,
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngày bán"
              name="saleDate"
              rules={[{ required: true, message: 'Chọn ngày bán' }]}
              getValueProps={(value) => ({
                value:
                  value && dayjs(value as string).isValid()
                    ? dayjs(value as string)
                    : undefined,
              })}
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true }]}
            >
              <Select options={SALE_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giảm giá" name="discountAmount">
              <InputMoney style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Đã thanh toán" name="paidAmount">
              <InputMoney style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Chi tiết hàng bán">
          <Space
            style={{
              width: '100%',
              marginBottom: 8,
              justifyContent: 'space-between',
            }}
            wrap
          >
            <Text type="secondary">
              Thêm sản phẩm, số lượng, đơn giá. Hệ thống tự tính thành tiền.
            </Text>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setLines((prev) => {
                  const last = prev[prev.length - 1];
                  return [
                    ...prev,
                    last
                      ? {
                          key: nextKey++,
                          productId: last.productId,
                          quantityUnit: last.quantityUnit,
                          unitPrice: last.unitPrice,
                          quantity: 1,
                        }
                      : newRow(),
                  ];
                })
              }
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
              padding: '12px 16px',
              background: 'var(--ant-color-fill-quaternary)',
              borderRadius: 8,
              textAlign: 'right',
            }}
          >
            <Text type="secondary">Tổng thành tiền (ước tính): </Text>
            <Text strong style={{ fontSize: 16 }}>
              {formatMoney(subtotal)}
            </Text>
          </div>
        </Form.Item>
      </Form>
    </AntdEdit>
  );
};
