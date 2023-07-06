import express from 'express';
import bodyParser from 'body-parser';
import { ResourceControllers as ctrl } from 'controllers';
import { authHandler } from 'middlewares/jwtResponse';


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get(
  '/continue/:student_id/:course_id',
  authHandler,
  ctrl.listContinue as express.RequestHandler
);

export default router;
