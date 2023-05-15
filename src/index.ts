import express from 'express';
const app = express();
app.use(express.json());
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';

const PORT = 3000;

app.use('/user', authenticateToken,  userRoutes);
app.use('/tweet', authenticateToken, tweetRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.send("Hello World");
})


app.listen(PORT, () => {
});