export type Category = 'clothing' | 'instrument';

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: Category;
  price: number;
  mainImage: string;
  images: string[];
  variants: ProductVariant[];
  material?: string;
  origin: string;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'salaw-premium-01',
    name: 'สะล้อพรีเมียม',
    subtitle: 'เครื่องสายแห่งล้านนา',
    description:
      'สะล้อฝีมือช่างเชียงใหม่รุ่นที่สามสลักลวดลายดอกจำปีบนกะโหลกไม้ประดู่แท้ เสียงอันนุ่มลึกสะท้อนวิญญาณแห่งขุนเขาและสายหมอก ใช้สายไหมเกรดพิเศษทนทานต่อความชื้น เหมาะแก่ทั้งนักดนตรีมืออาชีพและนักสะสมงานศิลป์',
    category: 'instrument',
    price: 8900,
    mainImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    ],
    variants: [
      { id: 'v1', color: 'ประดู่แดง', colorHex: '#8B4513', stock: 3 },
      { id: 'v2', color: 'ไม้มะค่า', colorHex: '#5C3317', stock: 2 },
    ],
    material: 'ไม้ประดู่แท้, สายไหมคุณภาพพิเศษ',
    origin: 'เชียงใหม่',
    featured: true,
  },
  {
    id: 'sueng-classic-01',
    name: 'ซึง คลาสสิก',
    subtitle: 'พิณสี่สายแห่งขุนเขา',
    description:
      'ซึงโบราณที่ยังคงกรรมวิธีดั้งเดิม ทำจากไม้ขนุนอายุกว่า 30 ปี เสียงกังวานนุ่มอุ่น เหมาะกับการบรรเลงเดี่ยวและในวงดนตรีพื้นเมือง ผ่านการขัดเกลาด้วยน้ำมันรักธรรมชาติ ไม่ใช้สารเคมี สัมผัสและกลิ่นของไม้แท้ที่หาได้ยากในยุคนี้',
    category: 'instrument',
    price: 6500,
    mainImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    ],
    variants: [
      { id: 'v1', color: 'ไม้ขนุนธรรมชาติ', colorHex: '#D4A76A', stock: 4 },
      { id: 'v2', color: 'ย้อมรักดำ', colorHex: '#2C1810', stock: 1 },
    ],
    material: 'ไม้ขนุน, น้ำมันรักธรรมชาติ',
    origin: 'ลำพูน',
    featured: true,
  },
  {
    id: 'sueng-student-01',
    name: 'ซึง รุ่นฝึกหัด',
    subtitle: 'สำหรับผู้เริ่มต้นเรียนรู้',
    description:
      'ซึงคุณภาพสูงในราคาที่เข้าถึงได้ เหมาะสำหรับนักเรียนและผู้ที่เพิ่งเริ่มสนใจดนตรีล้านนา ทำจากไม้ไม้สักเกรดคัดพิเศษ โทนเสียงใสและสม่ำเสมอ ง่ายต่อการจูนและดูแลรักษา',
    category: 'instrument',
    price: 3200,
    mainImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    ],
    variants: [
      { id: 'v1', color: 'ไม้สักธรรมชาติ', colorHex: '#C4A265', stock: 8 },
    ],
    material: 'ไม้สักเกรด A',
    origin: 'เชียงราย',
  },
  {
    id: 'woven-shirt-indigo-01',
    name: 'เสื้อทอมือ ผ้าคราม',
    subtitle: 'ลายไหลน้ำ สีครามธรรมชาติ',
    description:
      'เสื้อทอมือจากผ้าฝ้ายย้อมครามธรรมชาติ ลายทอเป็นรูปแบบไหลน้ำแบบโบราณที่สืบทอดมาจากช่างทอในอำเภอแม่แจ่ม ทุกผืนผ่านกรรมวิธีย้อมสีครามด้วยมือ ทำให้แต่ละชิ้นมีความแตกต่างอันเป็นเอกลักษณ์ ยิ่งซัก ยิ่งนุ่ม',
    category: 'clothing',
    price: 2800,
    mainImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80',
    ],
    variants: [
      { id: 'v1', color: 'ครามเข้ม', colorHex: '#2B3C6B', size: 'S', stock: 2 },
      { id: 'v2', color: 'ครามเข้ม', colorHex: '#2B3C6B', size: 'M', stock: 4 },
      { id: 'v3', color: 'ครามเข้ม', colorHex: '#2B3C6B', size: 'L', stock: 3 },
      { id: 'v4', color: 'ครามเข้ม', colorHex: '#2B3C6B', size: 'XL', stock: 1 },
      { id: 'v5', color: 'ครามอ่อน', colorHex: '#5B7FBF', size: 'S', stock: 3 },
      { id: 'v6', color: 'ครามอ่อน', colorHex: '#5B7FBF', size: 'M', stock: 5 },
      { id: 'v7', color: 'ครามอ่อน', colorHex: '#5B7FBF', size: 'L', stock: 2 },
      { id: 'v8', color: 'ครามอ่อน', colorHex: '#5B7FBF', size: 'XL', stock: 0 },
    ],
    material: 'ฝ้ายทอมือ 100%, ย้อมครามธรรมชาติ',
    origin: 'แม่แจ่ม, เชียงใหม่',
    featured: true,
  },
  {
    id: 'woven-dress-01',
    name: 'ชุดเดรสผ้าทอ ลายดอกลำดวน',
    subtitle: 'ศิลปะผ้าทอแบบยกดอก',
    description:
      'ชุดเดรสทรงอิสระจากผ้าทอมือลายดอกลำดวนยกดอก ใช้เส้นไหมแท้บางส่วนแทรกในผ้าฝ้ายเพื่อให้มีประกายเล็กน้อยเมื่อกระทบแสง ปลายแขนและคอเสื้อตกแต่งด้วยผ้าปักมือลายเครือดอก สวมใส่สบาย เหมาะทั้งงานทางการและลำลองระดับสูง',
    category: 'clothing',
    price: 4500,
    mainImage: 'https://images.unsplash.com/photo-1623091411395-09e79fdbfcf3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1623091411395-09e79fdbfcf3?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    ],
    variants: [
      { id: 'v1', color: 'ขาวนวล', colorHex: '#F5F0E8', size: 'S', stock: 2 },
      { id: 'v2', color: 'ขาวนวล', colorHex: '#F5F0E8', size: 'M', stock: 3 },
      { id: 'v3', color: 'ขาวนวล', colorHex: '#F5F0E8', size: 'L', stock: 1 },
      { id: 'v4', color: 'ดำคลาสสิก', colorHex: '#1C1C1C', size: 'S', stock: 3 },
      { id: 'v5', color: 'ดำคลาสสิก', colorHex: '#1C1C1C', size: 'M', stock: 4 },
      { id: 'v6', color: 'ดำคลาสสิก', colorHex: '#1C1C1C', size: 'L', stock: 2 },
      { id: 'v7', color: 'ดำคลาสสิก', colorHex: '#1C1C1C', size: 'XL', stock: 1 },
    ],
    material: 'ฝ้ายทอมือ 80%, ไหมแท้ 20%',
    origin: 'น่าน',
  },
  {
    id: 'woven-scarf-01',
    name: 'ผ้าพันคอทอมือ ลายน้ำไหล',
    subtitle: 'ลายโบราณ ความงามไร้กาลเวลา',
    description:
      'ผ้าพันคอทอมือ 100% ฝ้ายธรรมชาติ ลายน้ำไหลแบบดั้งเดิมของชาวไทยวน ขนาดพอดีใช้งาน สามารถพันคอ คลุมไหล่ หรือใช้เป็นผ้าคาดเอวได้ ซักง่าย ทนทาน และยิ่งใช้ยิ่งนุ่มขึ้น',
    category: 'clothing',
    price: 980,
    mainImage: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80',
    ],
    variants: [
      { id: 'v1', color: 'ครามเข้ม', colorHex: '#2B3C6B', stock: 10 },
      { id: 'v2', color: 'แดงชาด', colorHex: '#C13B2A', stock: 7 },
      { id: 'v3', color: 'ขาวนวล', colorHex: '#F5F0E8', stock: 5 },
      { id: 'v4', color: 'ดำ', colorHex: '#1C1C1C', stock: 8 },
    ],
    material: 'ฝ้ายธรรมชาติ 100%',
    origin: 'ลำปาง',
  },
];

export const CATEGORIES: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'clothing', label: 'เครื่องแต่งกาย' },
  { key: 'instrument', label: 'เครื่องดนตรี' },
];

export const LINE_OA_ID = '@miang-khanad';

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

export function buildLineUrl(message: string): string {
  return `https://line.me/R/oaMessage/${LINE_OA_ID}/?${encodeURIComponent(message)}`;
}

export function formatPrice(price: number): string {
  return `฿${price.toLocaleString('th-TH')}`;
}
