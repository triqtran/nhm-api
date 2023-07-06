import express, { Application } from 'express';
import multer, { Multer } from 'multer';
import StudentUsersRoutes from './StudentUsersRoutes';
import NHMAccountsRoutes from './NHMAccountsRouters';
import ResourceRouters from './ResourceRouters';
import { UploadControllers as ctrl } from 'controllers';

const uploadMulter: Multer = multer();

const routes: Application = express();

routes.post(
  '/uploads',
  uploadMulter.single('uploads'),
  ctrl.uploadFile as express.RequestHandler
);

routes.use('/student-users', StudentUsersRoutes);

routes.use('/nhm-accounts', NHMAccountsRoutes);

routes.use('/resource', ResourceRouters);

export default routes;
