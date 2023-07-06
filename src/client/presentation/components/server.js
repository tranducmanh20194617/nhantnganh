const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: '/storage/app/public/test123' });

// Định nghĩa route xử lý yêu cầu upload file
app.post('/upload', upload.single('file'), (req, res) => {
    // Lấy thông tin về file đã tải lên
    const { originalname, filename } = req.file;

    // Trả về đường dẫn file đã tải lên cho client
    res.json({ filename: filename });
});

// Khởi chạy server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
