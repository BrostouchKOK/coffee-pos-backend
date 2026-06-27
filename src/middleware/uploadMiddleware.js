import multer from "multer";
import path from "path";
import fs from "fs";

// Upload folder
const uploadPath = "src/uploads/products";

// Create folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;
