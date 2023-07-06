import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: '/storage/app/public/test123/', // Đường dẫn đến thư mục lưu trữ ảnh
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const fileName = `${Date.now()}${ext}`;
            cb(null, fileName);
        },
    }),
});

export default async function handler(req: Request, res: Response) {
    try {
        await upload.single('image')(req, res, (error: any) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to upload image' });
            } else {
                const file = req.file;
                const fileName = file?.filename;

                res.json({ message: 'Image uploaded successfully', fileName });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}
