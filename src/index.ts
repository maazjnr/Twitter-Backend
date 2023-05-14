import express from 'express';
const app = express();
app.use(express.json());
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';

const PORT = 7000;

app.use('/user', userRoutes);
app.use('/tweet', tweetRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.send("Hello World");
})


app.listen(PORT, () => {
});