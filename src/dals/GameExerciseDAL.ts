import GameExercises, { GameExercisesAttributes } from 'models/GameExercises';
import GameExerciseDetails from 'models/GameExerciseDetails';
import { WhereOptions } from 'sequelize';

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
  create(data: GameExercises): Promise<GameExercises>;
  createDetail(data: GameExerciseDetails): Promise<GameExerciseDetails>;
  createMultipleDetail(
    data: GameExerciseDetails[]
  ): Promise<GameExerciseDetails[]>;
  updateDetail(
    data: Partial<GameExerciseDetails>,
    id: number
  ): Promise<GameExerciseDetails>;
  updateById(data: Partial<GameExercises>, id: number): Promise<GameExercises>;
  list(
    where: WhereOptions<GameExercisesAttributes>
  ): Promise<ListGameExerciesResponse>;
  getById(id: number): Promise<GameExercises>;
}

class GameExercisesDAL implements IGameExercisesDAL {
  create(data: GameExercises): Promise<GameExercises> {
    return GameExercises.create(data, { returning: true })
      .then(res => {
        if (res?.dataValues) return res.dataValues as GameExercises;
        return throwNewError('Can not create game exercise!');
      })
      .catch(throwError('create'));
  }

  createDetail(data: GameExerciseDetails): Promise<GameExerciseDetails> {
    return GameExerciseDetails.create(data)
      .then(res => {
        if (res?.dataValues) return res.dataValues as GameExerciseDetails;
        return throwNewError('Can not create game exercise detail');
      })
      .catch(throwError('createDetail'));
  }

  createMultipleDetail(
    data: GameExerciseDetails[]
  ): Promise<GameExerciseDetails[]> {
    return GameExerciseDetails.bulkCreate(data)
      .then(res => {
        if (res.length > 0)
          return res?.map(item => item.dataValues) as GameExerciseDetails[];
        return throwNewError('Can not create multiple game exercise detail');
      })
      .catch(throwError('createMultipleDetail'));
  }

  updateDetail(
    data: Partial<GameExerciseDetails>,
    id: number
  ): Promise<GameExerciseDetails> {
    return GameExerciseDetails.update(data, {
      where: { id },
      returning: true,
      fields: [],
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        return throwNewError('Can not update game exercise detail');
      })
      .catch(throwError('updateDetail'));
  }

  updateById(data: Partial<GameExercises>, id: number): Promise<GameExercises> {
    return GameExercises.update(data, {
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
        'background_image',
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

  list(
    where: WhereOptions<GameExercisesAttributes>
  ): Promise<ListGameExerciesResponse> {
    return GameExercises.findAndCountAll({
      where,
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