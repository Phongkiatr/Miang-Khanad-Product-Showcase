/**
 * Product-related utility functions and constants
 */

export const LINE_OA_ID = '@miang-khanad';

/**
 * Formats a number as Thai Baht currency
 */
export function formatPrice(price: number): string {
  return `฿${price.toLocaleString('th-TH')}`;
}

/**
 * Builds a message for LINE OA inquiry
 */
export function buildLineMessage(
  productName: string,
  color?: string,
  size?: string
): string {
  let msg = `สวัสดีครับ สนใจ${productName}`;
  if (color) msg += ` สี${color}`;
  if (size) msg += ` ไซส์ ${size}`;
  msg += ' ครับ';
  return msg;
}

/**
 * Builds the full LINE OA deep link URL
 */
export function buildLineUrl(message: string): string {
  return `https://line.me/R/oaMessage/${LINE_OA_ID}/?${encodeURIComponent(message)}`;
}
