const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routes = require('./routes/routers');

const port = process.env.PORT || 4000;

const app = express();
const URI = process.env.MONGODB_URI;

(async () => {
    try {
        await mongoose.connect(URI);
    } catch (error) {
        console.log(error);
    }
})();


app.use(
    cors({
        origin: ["https://top1000imdbmovies.onrender.com", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

const PAGE_SIZE = 10;
app.get('/posts', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * PAGE_SIZE;
        const db = mongoose.connection.db;
        const posts = await db.collection('movies').find().skip(skip).limit(PAGE_SIZE).toArray();
        res.status(200).json({ data: posts, status: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
});

app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
