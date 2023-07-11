import express from 'express';
import bodyParser from 'body-parser';
import { StudentUsersController as ctrl } from 'controllers';
import {
  StudentUserBodyReq,
  StudentUserParamsReq,
} from 'controllers/StudentUsersController/interfaces';
import { authHandler } from 'middlewares/jwtResponse';
import { parsePaging } from 'middlewares';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post(
  '/create',
  authHandler,
  ctrl.addNewStudent as express.RequestHandler
);

router.put(
  '/update/:id',
  authHandler,
  ctrl.updateStudent as express.RequestHandler<
    StudentUserParamsReq,
    StudentUserBodyReq
  >
);

router.get(
  '/list',
  authHandler,
  parsePaging,
  ctrl.listStudents as express.RequestHandler
);

router.get('/hello', (req, res, next) => {
  res.send('Hello Student Users!');
});

router.get(
  '/profile',
  authHandler,
  ctrl.getStudentOwnProfile as express.RequestHandler
);

router.get(
  '/:id',
  ctrl.getStudentById as express.RequestHandler<StudentUserParamsReq>
);

router.post('/login', ctrl.signInStudent as express.RequestHandler);

router.post('/signup', ctrl.signUpStudent as express.RequestHandler);

router.post('/logout', authHandler, ctrl.logout as express.RequestHandler);

router.post('/forgot-password', ctrl.forgotPassword as express.RequestHandler);

export default router;
