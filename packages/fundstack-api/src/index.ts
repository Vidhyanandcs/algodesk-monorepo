import app from './app/app';

const port = Number(process.env.PORT);

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
