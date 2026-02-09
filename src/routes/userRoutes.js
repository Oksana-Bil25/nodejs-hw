import { Router } from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.patch(
  '/me/avatar',
  authenticate, // 1. Перевіряємо токен доступу користувача
  upload.single('avatar'), // 2. Очікуємо файл у полі "avatar" (max 2MB, тільки зображення)
  updateUserAvatar, // 3. Завантажуємо в Cloudinary та оновлюємо БД
);

export default router;
