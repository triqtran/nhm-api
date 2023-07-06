import express from 'express';
import bodyParser from 'body-parser';
import { StudentUsersController as ctrl } from 'controllers';
import { authHandler } from 'middlewares/jwtResponse';


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post(
  '/create',
  authHandler,
  ctrl.addNewStudent as express.RequestHandler
);

export default router;
