import express from 'express';

import routes from './routes';
import { errorHandler, errorLogger } from './middlewares/errorhandler';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', routes);
app.use(errorLogger); // Error Logger
app.use(errorHandler); // Error Handler

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});

module.exports = app;
