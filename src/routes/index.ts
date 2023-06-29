import express, { Application } from 'express';
import StudentUsersRoutes from './StudentUsersRoutes';
import NHMAccountsRoutes from './NHMAccountsRouters';

const routes: Application = express();

routes.use('/student-users', StudentUsersRoutes);

routes.use('/nhm-accounts', NHMAccountsRoutes);

export default routes;
