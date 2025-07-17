export const removeAccents = (str: string): string => {
  return str
    .normalize('NFD') // Phân tách ký tự và dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .toLowerCase(); // Chuyển thành chữ thường
};
