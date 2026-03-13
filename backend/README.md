# เมียงขนาด — Backend API

Node.js + Express + Supabase

---

## Setup

```bash
cp .env.example .env
# แก้ไข SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน .env

npm install
npm run dev        # development (node --watch)
npm start          # production
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Project URL จาก Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (Settings → API) |
| `PORT` | Port ที่ต้องการรัน (default: 3001) |
| `ALLOWED_ORIGIN` | Frontend origin สำหรับ CORS |

> ⚠️ **อย่า** ใส่ `SUPABASE_SERVICE_ROLE_KEY` ใน Frontend เด็ดขาด

---

## API Reference

Base URL: `http://localhost:3001`

---

### 🟢 Health Check

```
GET /health
```

---

### 📦 Items

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/items` | ดึงสินค้าทั้งหมด (pagination + filter) |
| `GET` | `/api/items/:id` | ดึงสินค้าตาม ID |
| `POST` | `/api/items` | สร้างสินค้าใหม่ |
| `PATCH` | `/api/items/:id` | แก้ไขสินค้า |
| `DELETE` | `/api/items/:id` | ลบสินค้า |

#### GET /api/items — Query params

| Param | Type | Description |
|---|---|---|
| `page` | int | หน้า (default: 1) |
| `limit` | int | จำนวนต่อหน้า (default: 20, max: 100) |
| `category` | int | กรองตาม item_type id |
| `search` | string | ค้นหาจากชื่อสินค้า |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "สะล้อพรีเมียม",
      "description": "...",
      "price": 8900,
      "imgsrc": "https://...",
      "item_type": { "id": 2, "name": "เครื่องดนตรี" },
      "item_var": { "id": 1, "color": "ประดู่แดง", "ssize": null, "tsize": null }
    }
  ],
  "pagination": { "total": 6, "page": 1, "limit": 20, "totalPages": 1 }
}
```

#### POST /api/items — Body

```json
{
  "name": "สะล้อพรีเมียม",
  "description": "...",
  "price": 8900,
  "item_type": 2,
  "item_var": 1,
  "imgsrc": "https://example.com/image.jpg"
}
```

---

### 🏷️ Item Types

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/item-types` | ดึงหมวดหมู่ทั้งหมด |
| `GET` | `/api/item-types/:id` | ดึงหมวดหมู่ตาม ID |
| `POST` | `/api/item-types` | สร้างหมวดหมู่ใหม่ |
| `PATCH` | `/api/item-types/:id` | แก้ไขหมวดหมู่ |
| `DELETE` | `/api/item-types/:id` | ลบหมวดหมู่ |

#### POST Body
```json
{ "name": "เครื่องดนตรี" }
```

---

### 🎨 Item Variants

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/item-vars` | ดึง variants ทั้งหมด |
| `GET` | `/api/item-vars/:id` | ดึง variant ตาม ID |
| `POST` | `/api/item-vars` | สร้าง variant ใหม่ |
| `PATCH` | `/api/item-vars/:id` | แก้ไข variant |
| `DELETE` | `/api/item-vars/:id` | ลบ variant |

#### POST Body
```json
{
  "color": "ครามเข้ม",
  "ssize": "M",
  "tsize": null
}
```

> `ssize` = เสื้อ size (S/M/L/XL), `tsize` = ไซส์อื่น (เช่น เครื่องดนตรี)

---

### 📋 Inquiry Logs

บันทึกเมื่อลูกค้ากด "สั่งซื้อผ่าน Line"

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/inquiry-logs` | ดึง log ทั้งหมด |
| `GET` | `/api/inquiry-logs/stats` | สถิติ: รวม + สินค้ายอดนิยม Top 5 |
| `GET` | `/api/inquiry-logs/:id` | ดึง log ตาม ID |
| `POST` | `/api/inquiry-logs` | บันทึก inquiry ใหม่ |
| `DELETE` | `/api/inquiry-logs/:id` | ลบ log |

#### POST Body — เรียกก่อนเปิด Line OA
```json
{ "items": 3 }
```

#### GET /api/inquiry-logs/stats — Response
```json
{
  "success": true,
  "data": {
    "total": 42,
    "topItems": [
      { "id": 1, "name": "สะล้อพรีเมียม", "price": 8900, "inquiry_count": 18 },
      { "id": 4, "name": "เสื้อทอมือ ผ้าคราม", "price": 2800, "inquiry_count": 12 }
    ]
  }
}
```

---

## Error Responses

```json
{ "success": false, "message": "Item not found" }

{ "success": false, "message": "Validation failed", "errors": [...] }
```

---

## Frontend Integration

เชื่อมต่อจาก React โดยเปลี่ยน `mockData.ts` ให้ fetch จาก API แทน:

```ts
// แทนที่ PRODUCTS array ด้วย:
const res = await fetch('http://localhost:3001/api/items');
const { data } = await res.json();

// บันทึก inquiry ก่อนเปิด Line:
await fetch('http://localhost:3001/api/inquiry-logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: product.id }),
});
window.open(lineUrl, '_blank');
```
