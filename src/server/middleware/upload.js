import multer from "multer";
import path from "path";
import fs from "fs";

// আপলোড ফোল্ডার না থাকলে তৈরি করবে
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ফাইলগুলো 'uploads' ফোল্ডারে জমা হবে
  },
  filename: (req, file, cb) => {
    // ফাইলের নাম ইউনিক করার জন্য টাইমস্ট্যাম্প যোগ করা
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // সর্বোচ্চ ৫ মেগাবাইট
});

export default upload;