import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import globalErrorHandler from './middleware/errorMiddleware.js';
import AppError from './utils/appError.js';

// กำหนด __dirname สำหรับ ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// โหลดตั้งค่าสภาพแวดล้อม
dotenv.config();

// เชื่อมต่อฐานข้อมูล
connectDB();

const app = express();

// --- ตั้งค่า SWAGGER CONFIGURATION ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Documentation',
      version: '1.0.0',
      description: 'เอกสารอธิบาย API สำหรับระบบ Auth และ Products',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
  },
  // ใช้ path.join เพื่อระบุ Absolute Path ไปยังโฟลเดอร์ routes
  apis: [
    path.join(__dirname, './routes/*.js'),
    path.join(__dirname, './routes/**/*.js')
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// มิดเดิลแวร์พื้นฐาน
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // จำเป็นสำหรับการแกะข้อมูลคุกกี้ฝั่งไคลเอนต์

// ลงทะเบียนหน้า Swagger UI (เข้าดูได้ที่ http://localhost:5000/api-docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ลงทะเบียนเส้นทางการประมวลผล (API Routes)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);

// ดักจับกรณีผู้ใช้พยายามระบุเส้นทางที่ไม่มีจริงในระบบ (Fallback 404 Route)
app.all('*', (req, res, next) => {
  next(new AppError(`ไม่พบที่อยู่เว็บ '${req.originalUrl}' บนเซิร์ฟเวอร์นี้`, 404));
});

// ศูนย์รวมดักจับจัดการข้อผิดพลาดประมวลผล (Global Error Middleware)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[System Server] Application running in '${process.env.NODE_ENV}' mode on port ${PORT}`);
  console.log(`[Swagger Docs] Available at http://localhost:${PORT}/api-docs`);
});