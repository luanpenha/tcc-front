import path from 'path';
import multer from 'multer';
import fs from 'fs';

const uploadsFolder = process.env.UPLOADS_FOLDER || 'uploads';
const uploadPath = path.resolve(uploadsFolder);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9\.\-_]/g, '-');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const fileFilter = (allowedExtensions) => (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    return cb(null, true);
  }
  return cb(new Error(`Formato de arquivo não suportado: ${extname}`));
};

export const uploadPrintFile = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: fileFilter(['.stl', '.obj']),
}).single('file');

export const uploadGalleryImages = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: fileFilter(['.jpeg', '.jpg', '.png', '.webp']),
}).array('images', 5);
