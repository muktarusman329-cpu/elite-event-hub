import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const safename = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_.]/g, '');
    cb(null, `${Date.now()}-${safename}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isImageMime = file.mimetype?.startsWith('image/');
    const isImageExtension = /\.(avif|gif|jpe?g|png|webp)$/i.test(file.originalname || '');
    if (!isImageMime && !isImageExtension) {
      cb(new Error('Only image uploads are allowed.'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
