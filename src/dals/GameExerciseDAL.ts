import GameExercises from 'models/GameExercises';
import GameExerciseDetails from 'models/GameExerciseDetails';
import { col, fn } from 'sequelize';
import GameExerciseStudents from 'models/GameExerciseStudents';

const logError = (funcName: string, err: string) =>
  `GameExerciseDAL.${funcName}: ${err}`;

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

type GameExerciseStudentsResponseIncludingGameExercises =
  GameExerciseStudents & { game_info: GameExercises };

type GameExercisesWithDetail = GameExercises & {
  details?: GameExerciseDetails[];
};

type GameExerciseResponseIncludingGameExerciseStudent = GameExercises & {
  game_student: GameExerciseStudents[];
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
  list(where: any): Promise<ListGameExerciesResponse>;
  getById(id: number): Promise<GameExercises>;
  listGameStudentByStudentId(
    student_id: number,
    is_trial?: boolean
  ): Promise<GameExerciseStudentsResponseIncludingGameExercises[]>;
  getGameStudentLatest(
    student_id: number
  ): Promise<GameExerciseStudents | null>;
  listGameWithoutPaging(
    filters: any
  ): Promise<GameExerciseResponseIncludingGameExerciseStudent[]>;
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
        'level',
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

  list(where: any): Promise<ListGameExerciesResponse> {
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

  listGameStudentByStudentId(
    student_id: number,
    is_trial = false
  ): Promise<GameExerciseStudentsResponseIncludingGameExercises[]> {
    return GameExerciseStudents.findAll({
      where: { student_id },
      attributes: [
        'game_exercise_id',
        'student_id',
        [fn('sum', col('total_correct_answers')), 'total_correct_answers'],
      ],
      include: {
        model: GameExercises,
        as: 'game_info',
        required: true,
        where: { is_trial },
        attributes: ['name', 'total_level', 'background_image', 'stars_to_win'],
      },
      group: 'game_exercise_id',
    })
      .then(res => {
        if (res?.length > 0)
          return res.map(
            item => item.dataValues
          ) as GameExerciseStudentsResponseIncludingGameExercises[];
        logError(
          'listGameStudentByStudentId',
          'Student has not played any game yet!'
        );
        return [];
      })
      .catch(throwError('listGameStudentByStudentId'));
  }
  getGameStudentLatest(
    student_id: number
  ): Promise<GameExerciseStudentsResponseIncludingGameExercises | null> {
    return GameExerciseStudents.findOne({
      where: {
        student_id,
      },
      order: [['updated_at', 'desc']],
      include: [
        {
          model: GameExercises,
          as: 'game_info',
          required: true,
          attributes: [
            'id',
            'name',
            'background_image',
            'total_level',
            'type',
            'stars_to_win',
            'level',
          ],
        },
      ],
    })
      .then(result => {
        if (!result?.dataValues) return null;
        return result?.dataValues as GameExerciseStudentsResponseIncludingGameExercises;
      })
      .catch(throwError('getGameStudentLastest'));
  }

  listGameWithoutPaging(
    filters: any
  ): Promise<GameExerciseResponseIncludingGameExerciseStudent[]> {
    return GameExercises.findAll({
      where: filters,
      include: {
        model: GameExerciseStudents,
        as: 'game_student',
        required: false,
        order: [['updated_at', 'desc']],
      },
    })
      .then(resp => {
        if (resp.length <= 0) {
          logError('listGameWithoutPaging', 'Not found any game');
          return [];
        }
        return resp.map(
          item =>
            item.dataValues as GameExerciseResponseIncludingGameExerciseStudent
        );
      })
      .catch(throwError('listGameWithoutPaging'));
  }
}

export default new GameExercisesDAL();
