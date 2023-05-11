import express from 'express';
const app = express();
app.use(express.json());
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';

const PORT = 8585;

app.use('/user', userRoutes);
app.use('/tweet', tweetRoutes);

app.get('/', (req, res) => {
    res.send("Hello World");
})


app.listen(PORT, () => {
    console.log(`App listening`);
    
});