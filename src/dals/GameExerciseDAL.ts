import GameExercises from 'models/GameExercises';
import GameExerciseDetails from 'models/GameExerciseDetails';
import { Op, col, literal } from 'sequelize';
import GameExerciseStudents from 'models/GameExerciseStudents';
import GameExerciseResults from 'models/GameExerciseResults';

const logError = (funcName: string, err: string) => {
  console.log('------------------------------');
  console.error(`GameExerciseDAL.${funcName}: ${err}`);
  console.log('------------------------------');
};

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
  GameExerciseStudents & {
    game_info: GameExercises;
  };

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
  getAllLevelViaGameId(
    game_exercise_id: number
  ): Promise<GameExerciseDetails[]>;
  listQuestionsOfLevel(
    game_exercise_id: number,
    level: string
  ): Promise<GameExerciseDetails[]>;
  getGameStudentViaIdLevel(
    game_exercise_id: number,
    level: string
  ): Promise<GameExerciseStudents>;
  upsertGameExerciseStudent(data: GameExerciseStudents): Promise<boolean>;
  createGameExerciseResult(
    data: GameExerciseResults
  ): Promise<GameExerciseResults>;

  listGameStudentViaIdStudentId(
    game_exercise_id: number,
    student_id: number
  ): Promise<GameExerciseStudents[]>;

  listQuestionsOfLevelWithFilter(
    game_exercise_id: number,
    level: string,
    student_id: number
  ): Promise<GameExerciseDetails[]>;

  clearGameExerciseStudentViaExerciseIdStudentId(
    game_exercise_id: number,
    student_id: number
  ): Promise<boolean>;

  clearGameExerciseResultViaExerciseIdStudentId(
    game_exercise_id: number,
    student_id: number
  ): Promise<boolean>;

  getGameExerciseDetail(
    id: number
  ): Promise<GameExerciseResponseIncludingGameExerciseStudent>;

  getNextLevelsOfGame(
    game_exercise_id: number,
    current_level_index: number
  ): Promise<GameExerciseDetails>;
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
      where: {
        student_id,
        total_correct_answers: {
          [Op.lte]: col('game_info`.`stars_to_win'),
        },
      },
      include: {
        model: GameExercises,
        as: 'game_info',
        required: true,
        where: { is_trial },
        attributes: ['name', 'total_level', 'background_image', 'stars_to_win'],
      },
      order: [['updated_at', 'asc']],
    })
      .then(res => {
        if (res.length <= 0) {
          logError(
            'listGameStudentByStudentId',
            'Student has not played any game yet!'
          );
          return [];
        }

        if (!res[res.length - 1].next_level) return [];

        return res.map(
          item => item.dataValues
        ) as GameExerciseStudentsResponseIncludingGameExercises[];
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

  getAllLevelViaGameId(
    game_exercise_id: number
  ): Promise<GameExerciseDetails[]> {
    return GameExerciseDetails.findAll({
      where: { game_exercise_id },
      order: [['level_index', 'asc']],
      group: ['level', 'level_index'],
      attributes: ['level', 'level_index'],
    })
      .then(resp => {
        return resp.map(item => ({
          level: item.level,
          level_index: item.level_index,
        })) as GameExerciseDetails[];
      })
      .catch(throwError('getAllLevelViaGameId'));
  }

  listQuestionsOfLevel(
    game_exercise_id: number,
    level: string
  ): Promise<GameExerciseDetails[]> {
    return GameExerciseDetails.findAll({
      where: { game_exercise_id, level },
      attributes: [
        'question',
        'audio_url',
        'answers',
        'answers_image',
        'right_answer_index',
      ],
    })
      .then(resp => resp?.map(item => item.dataValues as GameExerciseDetails))
      .catch(throwError('listQuestionsOfLevel'));
  }

  getGameStudentViaIdLevel(
    game_exercise_id: number,
    level: string
  ): Promise<GameExerciseStudents> {
    return GameExerciseStudents.findOne({ where: { game_exercise_id, level } })
      .then(resp => resp?.dataValues as GameExerciseStudents)
      .catch(throwError('getGameStudent'));
  }

  upsertGameExerciseStudent(data: GameExerciseStudents): Promise<boolean> {
    return GameExerciseStudents.findOne({
      where: {
        game_exercise_id: data.game_exercise_id,
        student_id: data.student_id,
        level: data.level,
      },
    })
      .then(gameExerciseStudent => {
        if (!gameExerciseStudent)
          return GameExerciseStudents.create({
            ...data,
            total_correct_answers: 1,
          });
        return gameExerciseStudent.update({
          total_correct_answers: gameExerciseStudent.total_correct_answers + 1,
        });
      })
      .then(() => true)
      .catch(throwError('upsertGameExerciseStudent'));
  }

  createGameExerciseResult(
    data: GameExerciseResults
  ): Promise<GameExerciseResults> {
    return GameExerciseResults.create(data)
      .then(created => created.dataValues as GameExerciseResults)
      .catch(throwError('upsertGameExerciseStudent'));
  }

  listGameStudentViaIdStudentId(game_exercise_id: number, student_id: number) {
    return GameExerciseStudents.findAll({
      where: { game_exercise_id, student_id },
    })
      .then(
        resp => resp?.map(item => item.dataValues) as GameExerciseStudents[]
      )
      .catch(throwError('listGameStudentViaIdStudentId'));
  }

  listQuestionsOfLevelWithFilter(
    game_exercise_id: number,
    level: string,
    student_id: number
  ): Promise<GameExerciseDetails[]> {
    return GameExerciseDetails.findAll({
      where: {
        game_exercise_id,
        level,
        [Op.or]: [
          {
            question: {
              [Op.notIn]: literal(
                `(SELECT question FROM \`game_exercise_results\` WHERE game_exercise_id = ${game_exercise_id} AND student_id = ${student_id} AND level = ${level} AND is_correct = 1)`
              ),
            },
          },
          {
            audio_url: {
              [Op.notIn]: literal(
                `(SELECT audio_url FROM \`game_exercise_results\` WHERE game_exercise_id = ${game_exercise_id} AND student_id = ${student_id} AND level = ${level} AND is_correct = 1)`
              ),
            },
          },
        ],
      },
      attributes: [
        'question',
        'audio_url',
        'answers',
        'answers_image',
        'right_answer_index',
      ],
    })
      .then(resp => resp?.map(item => item.dataValues as GameExerciseDetails))
      .catch(throwError('listQuestionsOfLevelWithFilter'));
  }

  clearGameExerciseStudentViaExerciseIdStudentId(
    game_exercise_id: number,
    student_id: number
  ): Promise<boolean> {
    return GameExerciseStudents.destroy({
      where: { game_exercise_id, student_id },
    })
      .then(resp => {
        if (resp) return true;
        return false;
      })
      .catch(throwError('clearGameExerciseStudentViaExerciseIdStudentId'));
  }

  clearGameExerciseResultViaExerciseIdStudentId(
    game_exercise_id: number,
    student_id: number
  ): Promise<boolean> {
    return GameExerciseResults.destroy({
      where: { game_exercise_id, student_id },
    })
      .then(resp => {
        if (resp) return true;
        return false;
      })
      .catch(throwError('clearGameExerciseStudentViaExerciseIdStudentId'));
  }

  getGameExerciseDetail(
    id: number
  ): Promise<GameExerciseResponseIncludingGameExerciseStudent> {
    return GameExercises.findOne({
      where: { id },
      include: {
        model: GameExerciseStudents,
        as: 'game_student',
        required: false,
        order: [['updated_at', 'desc']],
      },
    })
      .then(
        resp =>
          resp?.dataValues as GameExerciseResponseIncludingGameExerciseStudent
      )
      .catch(throwError('getGameExerciseDetail'));
  }

  getNextLevelsOfGame(
    game_exercise_id: number,
    current_level_index: number
  ): Promise<GameExerciseDetails> {
    return GameExerciseDetails.findOne({
      where: {
        game_exercise_id,
        level_index: current_level_index + 1,
      },
      group: ['level', 'level_index'],
      attributes: ['level', 'level_index'],
    })
      .then(resp => {
        return resp?.dataValues as GameExerciseDetails;
      })
      .catch(throwError('getNextLevelsOfGame'));
  }
}

export default new GameExercisesDAL();
