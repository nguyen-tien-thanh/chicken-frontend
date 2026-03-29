import { Show as AntdShow, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";

import { RelativeTime } from "@/components/relative-time";
import {
  INVENTORY_TX_DIRECTION_LABELS,
  INVENTORY_TX_TYPE_LABELS,
  type IInventoryTransaction,
  type InventoryTransactionDirection,
  type InventoryTransactionType,
} from "@/types";

const { Title } = Typography;

export const Show = () => {
  const { result: record, query } = useShow<IInventoryTransaction>({
    meta: {
      include: {
        product: { select: { id: true, name: true, type: true } },
      },
    },
  });
  const { isLoading } = query;

  const rt = record?.refType as InventoryTransactionType | undefined;
  const dir = record?.direction as InventoryTransactionDirection | undefined;

  return (
    <AntdShow isLoading={isLoading}>
      <Title level={5}>Mã</Title>
      <TextField value={record?.id} />
      <Title level={5}>Ngày giao dịch</Title>
      <TextField
        value={
          record?.transactionDate
            ? dayjs(record.transactionDate).format("DD/MM/YYYY HH:mm")
            : undefined
        }
      />
      <Title level={5}>Loại tham chiếu</Title>
      <TextField value={rt ? INVENTORY_TX_TYPE_LABELS[rt] : record?.refType} />
      <Title level={5}>Mã tham chiếu</Title>
      <TextField value={record?.refId} />
      <Title level={5}>Chiều</Title>
      {dir ? (
        <Tag color={dir === "IN" ? "green" : "orange"}>
          {INVENTORY_TX_DIRECTION_LABELS[dir]}
        </Tag>
      ) : null}
      <Title level={5}>Sản phẩm</Title>
      {record?.product ? (
        <Link to={`/products/show/${record.product.id}`}>
          {record.product.name}
        </Link>
      ) : (
        <TextField value={record?.productId} />
      )}
      <Title level={5}>Số lượng</Title>
      <TextField value={record?.quantity} />
      <Title level={5}>Đơn vị tính</Title>
      <TextField value={record?.quantityUnit} />
      <Title level={5}>Giá vốn đơn vị</Title>
      <TextField
        value={
          record?.unitCost != null
            ? Number(record.unitCost).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Tổng giá vốn</Title>
      <TextField
        value={
          record?.totalCost != null
            ? Number(record.totalCost).toLocaleString("vi-VN")
            : undefined
        }
      />
      <Title level={5}>Ghi chú</Title>
      <TextField value={record?.note} />
      <Title level={5}>Ghi nhận lúc</Title>
      <RelativeTime value={record?.createdAt} />
    </AntdShow>
  );
};
