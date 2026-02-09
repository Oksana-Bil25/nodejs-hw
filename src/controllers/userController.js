import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    // 1. Перевіряємо, чи був завантажений файл
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    // 2. Завантажуємо файл у Cloudinary
    const uploadResult = await saveFileToCloudinary(req.file.buffer);

    // 3. Оновлюємо поле avatar у базі даних
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: uploadResult.secure_url },
      { new: true },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    // 4. Відправляємо відповідь - ТІЛЬКИ { url: ... }
    res.status(200).json({
      url: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};