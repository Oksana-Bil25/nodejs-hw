import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    // 1. Перевіряємо, чи був завантажений файл мідлварою multer
    if (!req.file) {
      throw createHttpError(400, 'No file provided');
    }

    // 2. Завантажуємо файл у Cloudinary (передаємо буфер файлу з пам'яті)
    let uploadResult;
    try {
      uploadResult = await saveFileToCloudinary(req.file.buffer);
    } catch {
      throw createHttpError(500, 'Failed to upload image to Cloudinary');
    }

    // 3. Отримуємо ID користувача. 
    // ВАЖЛИВО: req.user з'являється завдяки мідлварі authenticate
    const userId = req.user._id;

    // 4. Оновлюємо поле avatar у базі даних MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResult.secure_url },
      { new: true }, // Повертати оновлений документ
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    // 5. Відправляємо відповідь з новим посиланням на аватар
    res.status(200).json({
      status: 200,
      message: 'Avatar updated successfully',
      data: {
        avatarUrl: updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};