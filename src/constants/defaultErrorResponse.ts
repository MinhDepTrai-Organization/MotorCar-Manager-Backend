export const DEFAULT_ERROR_MESSAGE =
  'Something went wrong. Please try again later.';

export type ErrorResponseBody = {
  success: boolean;
  status: number;
  path: string;
  message: string | string[];
};

// Hàm tạo giá trị mặc định
export const defaultErrorResponseBody = (
  overrides?: Partial<ErrorResponseBody>,
): ErrorResponseBody => ({
  success: false,
  status: 500,
  path: '',
  message: DEFAULT_ERROR_MESSAGE,
  ...overrides,
});
