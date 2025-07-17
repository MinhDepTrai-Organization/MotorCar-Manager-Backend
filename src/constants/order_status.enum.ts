export enum order_status {
  CANCELLED = -1, // Đã hủy đơn hàng
  PENDING = 0, // Đang chờ xử lí
  CONFIRMED = 1, // Đã xác nhận đơn hàng và chờ hàng xuất kho
  EXPORTED = 2, // Đã xuất kho thành công và chuẩn bị bàn giao cho đơn vị vận chuyển
  HAND_OVERED = 3, // Đã bàn giao hàng cho đơn vị vận chuyển
  DELIVERING = 4, // Đang vận chuyển hàng từ nơi xa về gần nơi của khách hàng
  SHIPPING = 5, // Hàng đã đến gần khách và đang trong quá trình giao trực tiếp
  DELIVERED = 6, // Đã giao hàng thành công
  FAILED_DELIVERY = 7, // Giao hàng thất bại
}

export const order_status_label = {
  [order_status.CANCELLED]: 'Đã hủy',
  [order_status.PENDING]: 'Đang chờ xử lí',
  [order_status.CONFIRMED]: 'Đã xác nhận',
  [order_status.EXPORTED]: 'Đã xuất kho',
  [order_status.HAND_OVERED]: 'Đã bàn giao cho vận chuyển',
  [order_status.DELIVERING]: 'Đang vận chuyển',
  [order_status.SHIPPING]: 'Đang giao hàng',
  [order_status.DELIVERED]: 'Đã giao hàng',
  [order_status.FAILED_DELIVERY]: 'Giao hàng thất bại',
};

export const getOrderLabelByStatus = (status: order_status) => {
  return order_status_label[status] || 'Trạng thái không xác định';
};
export enum payment_status {
  FAILED = -1,
  PENDING = 0,
  PAID = 1,
  REFUNDED = 2,
  CANCELLED = 3,
  PROCESSING = 4,
  EXPIRED = 5,
}

export const payment_status_label = {
  [payment_status.FAILED]: 'Thất bại',
  [payment_status.PENDING]: 'Đang chờ',
  [payment_status.PAID]: 'Đã thanh toán',
  [payment_status.REFUNDED]: 'Đã hoàn tiền',
  [payment_status.CANCELLED]: 'Đã hủy',
  [payment_status.PROCESSING]: 'Đang xử lý',
  [payment_status.EXPIRED]: 'Đã hết hạn',
};

export enum payment_method_name {
  COD = 'COD',
  PAYOS = 'PAYOS',
  ZALOPAY = 'ZALOPAY',
}

export const getStatusKeyByEnumType = (
  status: number | string,
  enumType: any,
) => {
  try {
    if (typeof status === 'number') {
      const keys = Object.keys(enumType).filter(
        (key) => enumType[key] === status,
      );
      return keys[0];
    }
    const keys = Object.keys(enumType).filter((key) => key === status);
    return keys[0];
  } catch (e) {
    throw new Error('Invalid status or enum type when get status key');
  }
};
