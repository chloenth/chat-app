import multer from 'multer';

// Configure Multer (for handling file uploads)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Middleware to handle single file upload (expecting "avatar" from frontend)
export const uploadMiddleware = upload.single('avatar');
