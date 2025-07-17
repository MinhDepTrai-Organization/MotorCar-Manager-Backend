import { ApiResponseProperty } from '@nestjs/swagger';

export class OptionResponseDto {
  @ApiResponseProperty({ example: 200 })
  status: number;

  @ApiResponseProperty({ example: 'Tạo Thuộc tính thành công' })
  message: string;

  @ApiResponseProperty({
    example: {
      id: '82572c8f-4fcf-4ef8-a672-664b900d20c1',
      name: 'Kích thước 1',
      createdAt: '2025-03-06T03:44:31.326Z',
      updatedAt: '2025-03-06T03:44:31.326Z',
    },
  })
  data: any;
}



export class OptionResponseDtoArray {
  @ApiResponseProperty({ example: 200 })
  status: number;

  @ApiResponseProperty({ example: 'Lấy danh sách thuộc tính thành công' })
  message: string;

  @ApiResponseProperty({
    example: [
      {
        id: '1ac80854-7166-41a5-bcd8-3473be9264b8',
        name: 'Màu sắc',
        createdAt: '2025-02-21T00:22:52.125Z',
        updatedAt: '2025-02-21T00:31:06.439Z',
      },
      {
        id: 'd47373e8-b36d-4bca-9a59-43ad5bcadbbb',
        name: 'Kích thước',
        createdAt: '2025-02-21T02:24:27.282Z',
        updatedAt: '2025-02-21T02:24:27.282Z',
      },
      {
        id: '82572c8f-4fcf-4ef8-a672-664b900d20c1',
        name: 'Kích thước 1',
        createdAt: '2025-03-06T03:44:31.326Z',
        updatedAt: '2025-03-06T03:44:31.326Z',
      },
    ],
  })
  data: any[];
}
