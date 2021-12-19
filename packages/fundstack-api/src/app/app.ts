import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/apiRouter';
import {prepareError} from "./utils/errorUtils";
import createError from 'http-errors';

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@dappstack.8mpd8.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority', {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected');
});

app.use('/', apiRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json(prepareError(err.message));
});

export default app;



