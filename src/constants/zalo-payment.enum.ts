export enum ZaloPayCreateOrderStatus {
  PATH = '/zalo-payment/create-order',
  SUCCESS_201 = 'Order is created successfully',
  INVALID_INPUT_400 = 'Order has been already created payment or invalid input',
  NOT_FOUND_404 = 'Payment method option not found or does not support ZaloPay',
  ZALOPAY_ERROR_422 = "ZaloPay error, can't create order",
  PROCESSING_202 = 'Order is processing',
}

export enum ZaloPayCheckOrderStatus {
  SUCCESS = 'SUCCESS',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  UNKNOWN = 'UNKNOWN',
  PATH = '/zalo-payment/check-status-order',
  SUCCESS_200 = 'Check order status successfully',
  SUCCESS_200_PAID = 'Order has been paid',
  SUCCESS_200_REFUNDED = 'Order has been refunded',
  INVALID_INPUT_400 = 'Order id must be a valid UUID and not empty',
  NOT_FOUND_404_APP_TRANSACTION_ID = 'Order has not been doing transaction yet',
  NOT_FOUND_404_ORDER = 'Order not found',
  NOT_FOUND_404_ZP_TRANSACTION_ID = 'zp_trans_id not found in payment method option',
  ERROR_500 = 'Internal server error',
  PROCESSING_202 = 'Order is processing',
  EXPIRE_202 = 'The URL payment has expired',
}

export enum ZaloPayRefundOrderStatus {
  PATH = '/zalo-payment/refund-order',
  SUCCESS_200 = 'Refund order successfully',
  INVALID_INPUT_400 = 'Order id must be a valid UUID and not empty',
  ZALO_PAY_ERROR_422 = 'ZaloPay error',
  NOT_FOUND_404 = 'Order not found',
  ERROR_500 = 'Internal server error',
  PROCESSING_202 = 'Order is processing',
}

export enum ZaloPayCheckRefundStatus {
  PATH = '/zalo-payment/check-refund',
  SUCCESS_200 = 'Check refund status successfully',
  INVALID_INPUT_400 = 'Order id must be a valid UUID and not empty',
  NOT_FOUND_404 = 'Order not found',
  ERROR_500 = 'Internal server error',
  PROCESSING_202 = 'Order is processing',
}
