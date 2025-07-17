import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CategoryResponseDto {
  @ApiProperty({
    example: 200,
    description: 'Trạng thái của phản hồi',
  })
  status: number;

  @ApiProperty({
    example: 'Lấy categories thành công',
    description: 'Thông báo kết quả',
  })
  message: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          example: 'd2db51a7-1610-4eef-8213-a8c60eda593c',
          description: 'ID của danh mục sản phẩm',
          type: 'string',
        },
        name: {
          example: 'Xe máy điện',
          description: 'Tên của danh mục sản phẩm',
          type: 'string',
        },
        description: {
          example: 'Loại máy xe chất lượng cao',
          description: 'Mô tả về danh mục sản phẩm',
          type: 'string',
        },
        deletedAt: {
          example: null,
          description: 'Ngày xóa danh mục (nếu đã bị xóa mềm)',
          nullable: true,
          type: 'string',
        },
        children: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                example: 'e3ec72b8-1711-4eef-8213-a8c60eda594d',
                description: 'ID của danh mục con',
                type: 'string',
              },
              name: {
                example: 'Xe máy điện mini',
                description: 'Tên của danh mục con',
                type: 'string',
              },
              description: {
                example: 'Dành cho trẻ em',
                description: 'Mô tả danh mục con',
                type: 'string',
              },
              deletedAt: {
                example: null,
                description: 'Ngày xóa danh mục con',
                nullable: true,
                type: 'string',
              },
              children: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      example: 'f4fd83c9-1812-4eef-8213-a8c60eda595e',
                      description: 'ID của danh mục cháu',
                      type: 'string',
                    },
                    name: {
                      example: 'Xe máy điện mini siêu nhỏ',
                      description: 'Tên của danh mục cháu',
                      type: 'string',
                    },
                    description: {
                      example: 'Dành cho trẻ dưới 5 tuổi',
                      description: 'Mô tả danh mục cháu',
                      type: 'string',
                    },
                    deletedAt: {
                      example: null,
                      description: 'Ngày xóa danh mục cháu',
                      nullable: true,
                      type: 'string',
                    },
                    children: {
                      type: 'array',
                      items: {},
                      description:
                        'Danh sách danh mục con cấp sâu hơn (nếu có)',
                    },
                  },
                },
                description: 'Danh sách danh mục cháu (nếu có)',
              },
            },
          },
          description: 'Danh sách danh mục con (nếu có)',
        },
      },
    },
    description: 'Danh sách các danh mục sản phẩm',
  })
  data: any[];
}

export class CreateResponseCategoryDto {
  @ApiProperty({
    example: 200,
  })
  status: number;

  @ApiProperty({
    example: 'Category created successfully',
  })
  message: String;

  @ApiProperty({
    type: 'object',
    properties: {
      id: {
        example: '821888a8-544c-4793-8cf3-0d1a877e15b5',
        description: 'ID của danh mục sản phẩm',
        type: 'string',
      },
      name: {
        example: 'Xe máy điện',
        description: 'Tên của danh mục sản phẩm',
        type: 'string',
      },
      description: {
        example: 'Loại máy xe chất lượng cao',
        description: 'Mô tả về danh mục sản phẩm',
        type: 'string',
      },
      deletedAt: {
        example: null,
        description: 'Ngày xóa danh mục (nếu đã bị xóa mềm)',
        nullable: true,
        type: 'string',
      },
    },
  })
  data: {
    id: string;
    name: string;
    description: string;
    deletedAt: Date | null;
  };
}
