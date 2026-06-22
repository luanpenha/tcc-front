import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import printRoutes from './routes/printRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import logRoutes from './routes/logRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(process.env.UPLOADS_FOLDER || 'uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laboratories', laboratoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/prints', printRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/logs', logRoutes);

app.use(errorHandler);

export default app;
