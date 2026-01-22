import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;

    // 1. Створюємо Query-об'єкти (Ланцюжок методів Mongoose)
    const notesQuery = Note.find();
    const countQuery = Note.find();

    // Використовуємо .where() згідно з вимогами ментора
    if (tag) {
      notesQuery.where('tag').equals(tag);
      countQuery.where('tag').equals(tag);
    }

    if (search) {
      notesQuery.where({ $text: { $search: search } });
      countQuery.where({ $text: { $search: search } });
    }

    // Додаємо пагінацію та сортування до основного запиту
    notesQuery.skip(skip).limit(limit).sort({ createdAt: -1 });

    // 2. Використовуємо Promise.all для одночасного виконання обох запитів
    const [notes, totalNotes] = await Promise.all([
      notesQuery.exec(),
      countQuery.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalNotes / limit);

    res.status(200).json({
      page: Number(page),
      perPage: limit,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
