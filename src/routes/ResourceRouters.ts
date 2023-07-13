import express from 'express';
import bodyParser from 'body-parser';
import { ResourceControllers as ctrl } from 'controllers';
import { authHandler, levelHandler } from 'middlewares/jwtResponse';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get(
  '/student-owner',
  authHandler,
  levelHandler,
  ctrl.getStudentOwner as express.RequestHandler
);

router.get(
  '/continues',
  authHandler,
  ctrl.listContinue as express.RequestHandler
);

router.get(
  '/student-books',
  authHandler,
  levelHandler,
  ctrl.listEbook as express.RequestHandler
);

router.get(
  '/student-games',
  authHandler,
  levelHandler,
  ctrl.listGame as express.RequestHandler
);

router.get(
  '/student-books/:bookId',
  authHandler,
  levelHandler,
  ctrl.getBookDetail as express.RequestHandler
);

router.get(
  '/student-games/:gameExerciseId',
  authHandler,
  levelHandler,
  ctrl.getGameExerciseDetail as express.RequestHandler
);

router.get(
  '/student-games/:id/levels',
  authHandler,
  ctrl.listLevelsOfGame as express.RequestHandler
);

router.get(
  '/student-games/:id/levels/:level',
  authHandler,
  ctrl.listQuestionsOfLevel as express.RequestHandler
);

router.post(
  '/student-books/save',
  authHandler,
  ctrl.saveChapterOfBook as express.RequestHandler
);

router.post(
  '/student-games/save',
  authHandler,
  ctrl.saveGameExerciseResult as express.RequestHandler
);

router.post(
  '/student-games/:id/replay',
  authHandler,
  ctrl.replayGameExercise as express.RequestHandler
);

export default router;
