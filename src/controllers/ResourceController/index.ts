import { Request, Response, NextFunction } from 'express';
import IResourceControllers from './interfaces';
import { ResourceBusiness } from 'business';

class ResourceController implements IResourceControllers {
  getStudentOwner(req: Request, res: Response, next: NextFunction): void {
    Promise.allSettled([
      ResourceBusiness.listContinue(req.userDecoded.id),
      ResourceBusiness.listEbook(req.userDecoded.level),
      ResourceBusiness.listGame(req.userDecoded.level),
    ])
      .then(([currentRes, booksRes, gamesRes]) => {
        const current =
          currentRes.status === 'fulfilled' ? currentRes.value : null;
        const books = booksRes.status === 'fulfilled' ? booksRes.value : null;
        const games = gamesRes.status === 'fulfilled' ? gamesRes.value : null;
        res.responseSuccess({ current, books, games });
      })
      .catch(err => res.responseAppError(err));
  }
  listContinue(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.listContinue(req.userDecoded.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  listEbook(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.listEbook(req.userDecoded.level)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  listGame(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.listGame(req.userDecoded.level)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  listLevelsOfGame(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.listLevelsOfGame(
      parseInt(req.params.id),
      req.userDecoded.id
    )
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  listQuestionsOfLevel(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.getQuestionsOfLevel(
      parseInt(req.params.id),
      req.params.level,
      req.userDecoded.id
    )
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  saveChapterOfBook(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.upsertBookStudent({
      ...req.body,
      student_id: req.userDecoded.id,
    })
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  saveGameExerciseResult(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    ResourceBusiness.saveGameExerciseResult({
      ...req.body,
      student_id: req.userDecoded.id,
    })
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  replayGameExercise(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.clearGameExercise(
      parseInt(req.params.id),
      req.userDecoded.id
    )
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
}

export default new ResourceController();
