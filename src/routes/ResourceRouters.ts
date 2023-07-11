import express from 'express';
import bodyParser from 'body-parser';
import { ResourceControllers as ctrl } from 'controllers';
import { authHandler, levelHandler } from 'middlewares/jwtResponse';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get(
  '/continues',
  authHandler,
  ctrl.listContinue as express.RequestHandler
);

router.get(
  '/ebooks',
  authHandler,
  levelHandler,
  ctrl.listEbook as express.RequestHandler
);

router.get(
  '/game-exercises',
  authHandler,
  levelHandler,
  ctrl.listGame as express.RequestHandler
);

router.get(
  '/game-exercises/:id/levels',
  authHandler,
  ctrl.listLevelsOfGame as express.RequestHandler
);

router.get(
  '/game-exercises/:id/levels/:level',
  authHandler,
  ctrl.listQuestionsOfLevel as express.RequestHandler
);

router.post(
  '/ebooks/student',
  authHandler,
  ctrl.saveChapterOfBook as express.RequestHandler
);

router.post(
  '/game-exercises/student',
  authHandler,
  ctrl.saveGameExerciseResult as express.RequestHandler
);

export default router;
