import express from 'express';
import bodyParser from 'body-parser';
import { StudentUsersController as ctrl } from 'controllers';
import {
  StudentUserBodyReq,
  StudentUserParamsReq,
} from 'controllers/StudentUsersController/interfaces';
import { authHandler } from 'middlewares/jwtResponse';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post(
  '/create',
  ctrl.addNewStudent as express.RequestHandler,
);

router.put(
  '/update/:id',
  ctrl.updateStudent as express.RequestHandler<StudentUserParamsReq, StudentUserBodyReq>,
);

router.get(
  '/list',
  authHandler,
  ctrl.listStudents as express.RequestHandler,
);

router.get(
  '/hello',
  (req, res, next) => {
    res.send('Hello Student Users!');
  }
);

router.get(
  '/:id',
  ctrl.getStudentById as express.RequestHandler<StudentUserParamsReq>
);

export default router;
