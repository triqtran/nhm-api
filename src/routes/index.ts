import express, { Application } from 'express';
import StudentUsersRoutes from './StudentUsersRoutes';
import { authHandler } from 'middlewares/jwtResponse';

const routes: Application = express();

routes.use('/student-users', authHandler, StudentUsersRoutes);

export default routes;