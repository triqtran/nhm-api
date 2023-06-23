import express from 'express';
import bodyParser from 'body-parser';
import { NHMAccountController as ctrl } from 'controllers';
import {
  NHMAccountBodyReq,
  NHMAccountParamsReq,
} from 'controllers/NHMAccountsController/interfaces';
import { authHandler } from 'middlewares/jwtResponse';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/create', authHandler, ctrl.addNewNHMAccount as express.RequestHandler);

router.put(
  '/update/:id',
  authHandler,
  ctrl.updateNHMAccount as express.RequestHandler<NHMAccountParamsReq, NHMAccountBodyReq>
);

router.get('/list', authHandler, ctrl.listNHMAccounts as express.RequestHandler);

router.get('/hello', (req, res, next) => {
  res.send('Hello Nihaoma Account!');
});

router.get('/profile', authHandler, ctrl.getNHMAccountOwnProfile as express.RequestHandler);

router.get('/:id', ctrl.getNHMAccountById as express.RequestHandler<NHMAccountParamsReq>);

router.post('/login', ctrl.signInNHMAccount as express.RequestHandler);

export default router;
