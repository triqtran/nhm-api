import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import routes from 'routes';
import models from 'models';
import { appResponse } from 'middlewares';
import { noRouteHandler } from 'middlewares/appResponse';
import { updateCourseAndLesionScheduler } from 'utils/scheduler.js';
// initialize models and connect to database
models();

const app: Application = express();

app.use(cors());
app.use(appResponse as express.RequestHandler);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

updateCourseAndLesionScheduler.start();
// Routes
app.use('/', routes);

app.use('*', noRouteHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on the port: ${process.env.PORT}`);
});
