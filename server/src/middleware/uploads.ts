import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const tempDir = process.env.TEMP_DIR || './tmp';
const maxSizeMB = Number(process.env.MAX_UPLOAD_MB) || 4;

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

function fileFilter(req: any, file: any, cb: any) {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExts = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX allowed.'));
  }
}

export const uploadResume = multer({
  storage,
  limits: { fileSize: maxSizeMB * 1024 * 1024 },
  fileFilter,
});
