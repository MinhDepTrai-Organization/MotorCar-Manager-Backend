import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

// Định nghĩa enum cho time_type
export enum EnumTypeOfTimeStatistics {
  MONTH = 'month',
  DAY = 'day',
}

// Validator tùy chỉnh để kiểm tra startMonth <= endMonth
@ValidatorConstraint({ name: 'validMonthRange', async: false })
export class ValidMonthRangeConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const { object } = args;
    const { startMonth, endMonth } = object as RevenueProfitStatisticsDto;
    return startMonth <= endMonth;
  }

  defaultMessage() {
    return 'startMonth phải nhỏ hơn hoặc bằng endMonth';
  }
}

// Validator tùy chỉnh để kiểm tra startDay và endDay hợp lệ với tháng/năm
@ValidatorConstraint({ name: 'validDayRange', async: false })
export class ValidDayRangeConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const { object } = args;
    const { year, month, startDay, endDay } =
      object as RevenueProfitStatisticsDto;
    if (
      (object as RevenueProfitStatisticsDto).time_type !==
      EnumTypeOfTimeStatistics.DAY
    )
      return true;

    // Tính số ngày tối đa trong tháng
    const maxDays = new Date(year, month, 0).getDate();
    return (
      startDay >= 1 &&
      startDay <= maxDays &&
      endDay >= 1 &&
      endDay <= maxDays &&
      startDay <= endDay
    );
  }

  defaultMessage(args: ValidationArguments) {
    const { object } = args;
    const { year, month } = object as RevenueProfitStatisticsDto;
    const maxDays = new Date(year, month, 0).getDate();
    return `startDay và endDay phải từ 1 đến ${maxDays} và startDay phải nhỏ hơn hoặc bằng endDay`;
  }
}

export default class RevenueProfitStatisticsDto {
  @IsEnum(EnumTypeOfTimeStatistics, {
    message: 'time_type phải là "month" hoặc "day"',
  })
  @IsNotEmpty({ message: 'time_type là bắt buộc' })
  @ApiProperty({
    name: 'time_type',
    description: 'Loại thống kê thời gian',
    enum: EnumTypeOfTimeStatistics,
    example: EnumTypeOfTimeStatistics.MONTH,
    required: true,
  })
  time_type: EnumTypeOfTimeStatistics;

  @IsNumber({}, { message: 'year phải là số nguyên' })
  @IsNotEmpty({ message: 'year là bắt buộc' })
  @Min(2000, { message: 'year phải lớn hơn hoặc bằng 2000' })
  @ApiProperty({
    name: 'year',
    description: 'Năm thống kê',
    type: 'number',
    example: 2025,
    required: true,
  })
  year: number;

  @ValidateIf((o) => o.time_type === EnumTypeOfTimeStatistics.MONTH)
  @IsNumber({}, { message: 'startMonth phải là số nguyên' })
  @Min(1, { message: 'startMonth phải từ 1 đến 12' })
  @Max(12, { message: 'startMonth phải từ 1 đến 12' })
  @IsNotEmpty({ message: 'startMonth là bắt buộc khi time_type là "month"' })
  @ApiProperty({
    name: 'startMonth',
    description: 'Tháng bắt đầu thống kê (1-12)',
    type: 'number',
    example: 1,
    required: false,
  })
  startMonth?: number;

  @ValidateIf((o) => o.time_type === EnumTypeOfTimeStatistics.MONTH)
  @IsNumber({}, { message: 'endMonth phải là số nguyên' })
  @Min(1, { message: 'endMonth phải từ 1 đến 12' })
  @Max(12, { message: 'endMonth phải từ 1 đến 12' })
  @IsNotEmpty({ message: 'endMonth là bắt buộc khi time_type là "month"' })
  @Validate(ValidMonthRangeConstraint)
  @ApiProperty({
    name: 'endMonth',
    description: 'Tháng kết thúc thống kê (1-12)',
    type: 'number',
    example: 12,
    required: false,
  })
  endMonth?: number;

  @ValidateIf((o) => o.time_type === EnumTypeOfTimeStatistics.DAY)
  @IsNumber({}, { message: 'month phải là số nguyên' })
  @Min(1, { message: 'month phải từ 1 đến 12' })
  @Max(12, { message: 'month phải từ 1 đến 12' })
  @IsNotEmpty({ message: 'month là bắt buộc khi time_type là "day"' })
  @ApiProperty({
    name: 'month',
    description: 'Tháng thống kê (1-12)',
    type: 'number',
    example: 1,
    required: false,
  })
  month?: number;

  @ValidateIf((o) => o.time_type === EnumTypeOfTimeStatistics.DAY)
  @IsNumber({}, { message: 'startDay phải là số nguyên' })
  @Min(1, { message: 'startDay phải từ 1' })
  @IsNotEmpty({ message: 'startDay là bắt buộc khi time_type là "day"' })
  @Validate(ValidDayRangeConstraint)
  @ApiProperty({
    name: 'startDay',
    description: 'Ngày bắt đầu thống kê (1-31)',
    type: 'number',
    example: 1,
    required: false,
  })
  startDay?: number;

  @ValidateIf((o) => o.time_type === EnumTypeOfTimeStatistics.DAY)
  @IsNumber({}, { message: 'endDay phải là số nguyên' })
  @Min(1, { message: 'endDay phải từ 1' })
  @IsNotEmpty({ message: 'endDay là bắt buộc khi time_type là "day"' })
  @Validate(ValidDayRangeConstraint)
  @ApiProperty({
    name: 'endDay',
    description: 'Ngày kết thúc thống kê (1-31)',
    type: 'number',
    example: 31,
    required: false,
  })
  endDay?: number;
}
