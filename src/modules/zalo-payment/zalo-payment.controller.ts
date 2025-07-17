import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ZaloPaymentService } from './zalo-payment.service';
import { CreateZaloPaymentDto } from './dto/create-zalo-payment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';
import {
  ErrorResponseBodySchema,
  SuccessResponseBodySchema,
} from 'src/constants/response-body-schema';
import { ResponseZaloCreateOrder } from './dto/response-zalo-createOrder.dto';
import {
  ZaloPayCheckOrderStatus,
  ZaloPayCreateOrderStatus,
} from 'src/constants/zalo-payment.enum';
import { ResponseZaloPayRefundOrderDto } from './dto/response-zalo-refundOrder.dto';
import { ResponseCheckRefundDto } from './dto/response-zalo-checkRefund.dto';

@ApiTags(Tag.ZALOPAY)
@Controller('zalo-payment')
@ApiExtraModels(
  ResponseZaloCreateOrder,
  ResponseZaloPayRefundOrderDto,
  ResponseZaloPayRefundOrderDto,
  ResponseCheckRefundDto,
)
@ApiBearerAuth()
export class ZaloPaymentController {
  constructor(private readonly zaloPaymentService: ZaloPaymentService) {}
  @Post('create-order')
  @ApiOperation({
    summary: 'Tạo đơn hàng ZaloPay',
    description: `Tạo đơn hàng ZaloPay để thực hiện thanh toán, Body \n
    {
      "orderId": "12345",
      "description": "Thanh toán đơn hàng #12345"
    }
    `,
  })
  @ApiBody({
    description: 'Thông tin cần thiết để tạo đơn hàng ZaloPay',
    type: CreateZaloPaymentDto,
  })
  @ApiResponse({
    status: 201,
    description: ZaloPayCreateOrderStatus.SUCCESS_201,
    schema: SuccessResponseBodySchema(
      201,
      ZaloPayCreateOrderStatus.SUCCESS_201,
      ResponseZaloCreateOrder,
    ),
  })
  @ApiResponse({
    status: 400,
    description: ZaloPayCreateOrderStatus.INVALID_INPUT_400,
    schema: ErrorResponseBodySchema(
      400,
      ZaloPayCreateOrderStatus.INVALID_INPUT_400,
      ZaloPayCreateOrderStatus.PATH,
    ),
  })
  @ApiResponse({
    status: 404,
    description: ZaloPayCreateOrderStatus.NOT_FOUND_404,
    schema: ErrorResponseBodySchema(
      404,
      ZaloPayCreateOrderStatus.NOT_FOUND_404,
      ZaloPayCreateOrderStatus.PATH,
    ),
  })
  @ApiResponse({
    status: 422,
    description: ZaloPayCreateOrderStatus.ZALOPAY_ERROR_422,
    schema: ErrorResponseBodySchema(
      422,
      ZaloPayCreateOrderStatus.ZALOPAY_ERROR_422,
      ZaloPayCreateOrderStatus.PATH,
    ),
  })
  @ApiResponse({
    status: 202,
    description: ZaloPayCreateOrderStatus.PROCESSING_202,
    schema: SuccessResponseBodySchema(
      202,
      ZaloPayCreateOrderStatus.PROCESSING_202,
      {
        order_id: 'd8a4d1c0-0b6e-4e3c-8d5a-3b2f2d5c9d1d',
        message: ZaloPayCreateOrderStatus.PROCESSING_202,
      },
    ),
  })
  async createOrder(@Body() body: CreateZaloPaymentDto) {
    return await this.zaloPaymentService.createOrder(body);
  }
  @Post('callback')
  @Public()
  @ApiOperation({
    summary: 'Xử lí Callback từ ZaloPay',
    description:
      'Đây là API dùng để xử lý callback từ ZaloPay, ZaloPay sẽ gửi thông tin về giao dịch qua API này, nếu hết hạn thanh toán mà zalo không gửi callback thì gọi API kiểm tra trạng thái đơn hàng thủ công',
  })
  @ApiResponse({
    status: 201,
    description: 'Callback từ ZaloPay đã được xử lý',
    schema: {
      type: 'object',
      properties: {
        return_code: {
          type: 'number',
          example: 1,
        },
        return_message: {
          type: 'string',
          example: 'Giao dịch thành công',
        },
      },
    },
  })
  async handleCallback(@Body() body: any) {
    return await this.zaloPaymentService.verifyCallback(body);
  }

  @Post('check-zalopay-payment-status/:id')
  @ApiOperation({
    summary: 'Kiểm tra trạng thái đơn hàng',
    description:
      'Kiểm tra trạng thái đơn hàng tự động trên zalopay, nếu hết hạn thanh toán mà zalo không gửi callback thì gọi API này để kiểm tra trạng thái đơn hàng',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của đơn hàng cần kiểm tra trạng thái',
    required: true,
    type: String,
    format: 'uuid',
    example: 'd8a4d1c0-0b6e-4e3c-8d5a-3b2f2d5c9d1d',
  })
  @ApiResponse({
    status: 200,
    description: ZaloPayCheckOrderStatus.SUCCESS_200,
    schema: SuccessResponseBodySchema(
      200,
      ZaloPayCheckOrderStatus.SUCCESS_200,
      {
        transaction_status: ZaloPayCheckOrderStatus.SUCCESS,
        detail: {
          return_code: 1,
          return_message: 'Giao dịch thành công',
          sub_return_code: 1,
          sub_return_message: 'Giao dịch thành công',
          is_processing: false,
          amount: 250001,
          zp_trans_id: 250314000000203,
          server_time: 1741891326386,
          discount_amount: 0,
        },
      },
    ),
  })
  @ApiResponse({
    status: 400,
    description: ZaloPayCheckOrderStatus.INVALID_INPUT_400,
    schema: ErrorResponseBodySchema(
      400,
      ZaloPayCheckOrderStatus.INVALID_INPUT_400,
      ZaloPayCheckOrderStatus.PATH,
    ),
  })
  @ApiResponse({
    status: 404,
    description: `${ZaloPayCheckOrderStatus.NOT_FOUND_404_APP_TRANSACTION_ID} or ${ZaloPayCheckOrderStatus.NOT_FOUND_404_ORDER} or ${ZaloPayCheckOrderStatus.NOT_FOUND_404_ZP_TRANSACTION_ID}`,
    schema: ErrorResponseBodySchema(
      404,
      `${ZaloPayCheckOrderStatus.NOT_FOUND_404_APP_TRANSACTION_ID} or ${ZaloPayCheckOrderStatus.NOT_FOUND_404_ORDER} or ${ZaloPayCheckOrderStatus.NOT_FOUND_404_ZP_TRANSACTION_ID}`,
      ZaloPayCheckOrderStatus.PATH,
    ),
  })
  @ApiResponse({
    status: 500,
    description: ZaloPayCheckOrderStatus.ERROR_500,
    schema: ErrorResponseBodySchema(
      500,
      ZaloPayCheckOrderStatus.ERROR_500,
      ZaloPayCheckOrderStatus.PATH,
    ),
  })
  async checkOrderStatus(@Param('id', ParseUUIDPipe) order_id: string) {
    return await this.zaloPaymentService.checkOrderStatus(order_id);
  }
  // @Post(':id/refund')
  // @ApiOperation({
  //   summary: 'Hoàn tiền đơn hàng',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'ID của đơn hàng cần hoàn tiền',
  //   required: true,
  //   type: String,
  //   format: 'uuid',
  //   example: 'd8a4d1c0-0b6e-4e3c-8d5a-3b2f2d5c9d1d',
  // })
  // @ApiBody({
  //   description: 'Thông tin cần thiết để hoàn tiền',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       reason: {
  //         type: 'string',
  //         description: 'Reason why refund',
  //         example: 'Customer request',
  //       },
  //     },
  //   },
  //   required: false,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: ZaloPayCheckRefundStatus.SUCCESS_200,
  //   schema: SuccessResponseBodySchema(
  //     200,
  //     ZaloPayCheckRefundStatus.SUCCESS_200,
  //     ResponseCheckRefundDto,
  //   ),
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: `${ZaloPayCheckRefundStatus.INVALID_INPUT_400}`,
  //   schema: ErrorResponseBodySchema(
  //     400,
  //     `${ZaloPayCheckRefundStatus.INVALID_INPUT_400}`,
  //     ZaloPayCheckRefundStatus.PATH,
  //   ),
  // })
  // async refundOrder(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
  //   const { reason } = body;
  //   return await this.zaloPaymentService.refundOrder(id, reason);
  // }
  // @Post(':id/check-refund')
  // @ApiOperation({
  //   summary: 'Kiểm tra trạng thái hoàn tiền',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'ID của đơn hàng cần kiểm tra hoàn tiền',
  //   required: true,
  //   type: String,
  //   format: 'uuid',
  //   example: 'd8a4d1c0-0b6e-4e3c-8d5a-3b2f2d5c9d1d',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: ZaloPayRefundOrderStatus.SUCCESS_200,
  //   schema: SuccessResponseBodySchema(
  //     200,
  //     ZaloPayRefundOrderStatus.SUCCESS_200,
  //     ResponseZaloPayRefundOrderDto,
  //   ),
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: `${ZaloPayRefundOrderStatus.INVALID_INPUT_400}`,
  //   schema: ErrorResponseBodySchema(
  //     400,
  //     `${ZaloPayRefundOrderStatus.INVALID_INPUT_400}`,
  //     '/zalo-payment/:id/check-refund',
  //   ),
  // })
  // async checkRefundOrder(@Param('id', ParseUUIDPipe) id: string) {
  //   return await this.zaloPaymentService.checkRefundOrderStatus(id);
  // }
}

// link tham khảo
//https://github.com/LeCheWang/demo-payment/blob/master/zalo/server.js
