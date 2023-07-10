import express from 'express';
import bodyParser from 'body-parser';
import { ResourceControllers as ctrl } from 'controllers';
import { authHandler } from 'middlewares/jwtResponse';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get(
  '/continues',
  authHandler,
  ctrl.listContinue as express.RequestHandler
);

router.get('/ebooks', authHandler, ctrl.listEbook as express.RequestHandler);

router.get(
  '/game-exercises',
  authHandler,
  ctrl.listGame as express.RequestHandler
);

export default router;
