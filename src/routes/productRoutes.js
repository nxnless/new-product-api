import express from 'express';
import { 
  getAllProducts, 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: รหัสสินค้า (MongoDB ObjectId)
 *           example: 60d0fe4f5311236168a109ca
 *         name:
 *           type: string
 *           description: ชื่อสินค้า
 *           example: Wireless Mouse
 *         price:
 *           type: number
 *           description: ราคาสินค้า
 *           example: 490
 *         description:
 *           type: string
 *           description: รายละเอียดสินค้า
 *           example: เมาส์ไร้สายเพื่อสุขภาพ
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T12:00:00.000Z
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: Wireless Mouse
 *         price:
 *           type: number
 *           example: 490
 *         description:
 *           type: string
 *           example: เมาส์ไร้สายเพื่อสุขภาพ
 */

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: ดึงข้อมูลสินค้าทั้งหมด
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: สำเร็จ และคืนค่ารายการสินค้า
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 */
router.get('/', getAllProducts);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: ดึงข้อมูลสินค้าตาม ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสสินค้า (ID)
 *     responses:
 *       200:
 *         description: ค้นพบสินค้า
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: ไม่พบสินค้าตาม ID ที่ระบุ
 */
router.get('/:id', getProductById);

// ป้องกันและจำกัดสิทธิ์ Route ถัดลงไปจากนี้ทั้งหมด ต้องล็อกอินผ่าน token ก่อนเสมอ
router.use(protect);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: สร้างสินค้าใหม่ (ต้องยืนยันตัวตน)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: สร้างสินค้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       401:
 *         description: ไม่ได้รับอนุญาต (ไม่ได้ส่ง Token หรือ Token ไม่ถูกต้อง)
 */
router.post('/', createProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   patch:
 *     summary: แก้ไขข้อมูลสินค้า (ต้องยืนยันตัวตน)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสสินค้าที่ต้องการแก้ไข
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: แก้ไขข้อมูลสำเร็จ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       404:
 *         description: ไม่พบสินค้าที่ต้องการแก้ไข
 */
router.patch('/:id', updateProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: ลบสินค้า (ต้องยืนยันตัวตน)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสสินค้าที่ต้องการลบ
 *     responses:
 *       204:
 *         description: ลบสินค้าสำเร็จ (ไม่มีข้อมูลส่งกลับ)
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       404:
 *         description: ไม่พบสินค้าที่ต้องการลบ
 */
router.delete('/:id', deleteProduct);

export default router;