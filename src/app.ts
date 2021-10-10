import express from 'express';


const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    return res.send('Hello');
});

app.listen(PORT, () => {
    console.log(`Application listening at http://localhost:${PORT}`);
});

