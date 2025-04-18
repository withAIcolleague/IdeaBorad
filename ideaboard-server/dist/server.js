import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// CORS 설정
app.use(cors({
    origin: ['http://localhost:3000', 'https://businessideaboard.web.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept']
}));
app.use(express.json());
// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ideaboard')
    .then(() => console.log('MongoDB 연결 성공'))
    .catch((err) => console.error('MongoDB 연결 실패:', err));
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [{
            author: { type: String, required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }]
});
const Post = mongoose.model('Post', postSchema);
// API 라우트
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    }
    catch (err) {
        console.error('게시글 조회 에러:', err);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
});
app.post('/api/posts', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }
        const newPost = new Post({
            title,
            content,
            author
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }
    catch (err) {
        console.error('게시글 작성 에러:', err);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
});
// 정적 파일 제공
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
