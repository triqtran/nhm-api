import GameExercises from 'models/GameExercises';
import GameExerciseDetails from 'models/GameExerciseDetails';

const throwError =
  (funcName: string) =>
  (errMessage = 'Method not implemented.') => {
    console.error(`[GameExerciseDAL.${funcName}]`, errMessage);
    throw errMessage;
  };

const throwNewError = (err = 'Error not implemented.') => {
  throw new Error(err);
};

type ListGameExerciesResponse = {
  data: GameExercises[];
  count: number;
};

type GameExercisesWithDetail = GameExercises & {
  details?: GameExerciseDetails[];
};

interface IGameExercisesDAL {
  create(req: any): Promise<GameExercises>;
  updateById(req: any, id: number): Promise<GameExercises>;
  list(req: any): Promise<ListGameExerciesResponse>;
  getById(id: number): Promise<GameExercises>;
}

class GameExercisesDAL implements IGameExercisesDAL {
  create(req: any): Promise<GameExercises> {
    return GameExercises.create(req, { returning: true }).then(res => {
      if (res?.dataValues) return res.dataValues as GameExercises;
      return throwNewError('Can not create game exercise!');
    });
  }

  updateById(req: any, id: number): Promise<GameExercises> {
    return GameExercises.update(req, {
      where: {
        id,
      },
      fields: [
        'name',
        'status',
        'type',
        'how_to_play',
        'description',
        'intro',
        'total_level',
        'course_id',
        'is_trial',
      ],
      returning: true,
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        return throwNewError('Can not update game exercise!');
      })
      .catch(throwError('updateById'));
  }

  list(req: any): Promise<ListGameExerciesResponse> {
    return GameExercises.findAndCountAll({
      where: req,
    })
      .then(res => {
        const resData = res.rows.map(item => item.dataValues);
        return { count: res.count, data: resData } as ListGameExerciesResponse;
      })
      .catch(throwError('list'));
  }

  getById(id: number): Promise<GameExercisesWithDetail> {
    GameExercises.hasMany(GameExerciseDetails, {
      as: 'details',
      foreignKey: 'game_exercise_id',
    });
    return GameExercises.findOne({
      where: { id },
      include: [
        {
          model: GameExerciseDetails,
          as: 'details',
        },
      ],
    })
      .then(res => {
        if (res?.dataValues) return res.dataValues as GameExercisesWithDetail;
        return throwNewError('Can not find game exercise!');
      })
      .catch(throwError('getById'));
  }
}

export default new GameExercisesDAL();
