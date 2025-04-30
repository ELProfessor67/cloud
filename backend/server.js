import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import ErrorMiddleware from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "dotenv/config";

const app = express();
app.use(bodyParser.json({ limit: '10gb' }));
app.use(bodyParser.urlencoded({ limit: '10gb', extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));






// Routes
app.use('/users', userRoutes);
app.use('/folders', folderRoutes);
app.use('/files', fileRoutes);


app.use(ErrorMiddleware);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
