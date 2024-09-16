import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import envVar from './config/config.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// built in middleware
app.use(
  express.json({
    limit: '16kb'
  })
);

app.use(
  express.urlencoded({
    limit: '16kb',
    extended: true
  })
);

app.use(express.static('public'));

// third party middleware
app.use(
  cors({
    origin: envVar.frontendUrl,
    credentials: true
  })
);

app.use(morgan('dev'));
app.use(cookieParser());

app.get('/check', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

//  import routes
import userRouter from './routes/user.routes.js';

//  use routes
app.use('/api/v1/user', userRouter);

// default catch for all the other routes
app.use('*', (req, res) => {
  res.status(404).send('404,page Not Found');
});

// custom error handeling middleware
app.use(errorMiddleware);

export default app;
