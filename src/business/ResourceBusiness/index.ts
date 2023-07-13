import {
  ContinueResourceResponse,
  EbookResponse,
  GameExerciseResponse,
  GetAllGameLevelResponse,
  QuestionResponse,
  SaveGameExerciseResultRequest,
  UpsertBookStudentRequest,
} from './types';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import BookDAL from 'dals/BookDAL';
import BookStudent from 'models/BookStudents';
import GameExerciseResults from 'models/GameExerciseResults';
import GameExerciseStudents from 'models/GameExerciseStudents';

interface IResourceBusiness {
  listContinue: (student_id: number) => Promise<ContinueResourceResponse[]>;
  listEbook: (level?: string) => Promise<EbookResponse[]>;
  listGame: (level?: string) => Promise<GameExerciseResponse[]>;
  listLevelsOfGame: (
    game_exercise_id: number,
    student_id: number
  ) => Promise<GetAllGameLevelResponse>;
  getQuestionsOfLevel: (
    game_exercise_id: number,
    level: string,
    student_id: number
  ) => Promise<QuestionResponse[]>;
  upsertBookStudent: (data: UpsertBookStudentRequest) => Promise<boolean>;
  saveGameExerciseResult: (
    data: SaveGameExerciseResultRequest
  ) => Promise<boolean>;

  clearGameExercise(
    game_exercise_id: number,
    student_id: number
  ): Promise<boolean>;
}

class ResourceBusiness implements IResourceBusiness {
  listContinue(student_id: number): Promise<ContinueResourceResponse[]> {
    return Promise.all([
      GameExerciseDAL.listGameStudentByStudentId(student_id),
      BookDAL.listBookStudentByStudentId(student_id),
    ])
      .then(([gameExercises, books]) => {
        const uniqueGameExercises = [
          ...new Map(
            gameExercises.map(item => [item['game_exercise_id'], item])
          ).values(),
        ];
        const wrapGameData = uniqueGameExercises.map(item => {
          return {
            object_name: item.game_info.name,
            object_background_image: item.game_info.background_image,
            type: 'Game',
            object_other_info: {
              current_level: item.level,
              total_correct_answers: item.total_correct_answers,
            },
          } as ContinueResourceResponse;
        });
        const wrapBookData = books.map(item => {
          return {
            object_name: item?.book_info.name,
            object_background_image: item.book_info.background_image,
            type: 'Book',
            object_other_info: {
              current_chapter: item.current_chapter,
            },
          } as ContinueResourceResponse;
        });

        return [...wrapGameData, ...wrapBookData];
      })
      .catch(err => {
        throw err;
      });
  }

  listEbook(level?: string | null): Promise<EbookResponse[]> {
    return BookDAL.listBookWithoutPaging({ level })
      .then(books =>
        books.map(
          item =>
            ({
              background_image: item.background_image,
              name: item.name,
              short_description: item.short_description,
              description: item.description,
              total_chapters: item.total_chapters,
              current_chapter: item.book_student?.current_chapter || null,
              url_file: item.url_file,
            } as EbookResponse)
        )
      )
      .catch(err => {
        throw err;
      });
  }
  listGame(level?: string | null): Promise<GameExerciseResponse[]> {
    return GameExerciseDAL.listGameWithoutPaging({ level })
      .then(games =>
        games.map(game => {
          let totalFinishExercise = 0;
          game.game_student?.forEach(item => {
            if (item.total_correct_answers === game.stars_to_win)
              totalFinishExercise++;
          });
          return {
            background_image: game.background_image,
            total_level: game.total_level,
            name: game.name,
            description: game.description,
            how_to_play: game.how_to_play,
            intro: game.intro,
            current_level: game.game_student?.[0]?.level || null,
            total_correct_answers:
              game.game_student?.[0]?.total_correct_answers || null,
            stars_to_win: game.stars_to_win,
            type: game.type,
            total_levels_completed: totalFinishExercise,
            is_finish: totalFinishExercise === game.total_level,
          } as GameExerciseResponse;
        })
      )
      .catch(err => {
        throw err;
      });
  }

  listLevelsOfGame(
    game_exercise_id: number,
    student_id: number
  ): Promise<GetAllGameLevelResponse> {
    return Promise.all([
      GameExerciseDAL.getAllLevelViaGameId(game_exercise_id),
      GameExerciseDAL.listGameStudentViaIdStudentId(
        game_exercise_id,
        student_id
      ),
    ])
      .then(
        ([levels, processing]) =>
          ({
            levels,
            processing: processing.map(
              item =>
                ({
                  level: item.level,
                  total_correct_answers: item.total_correct_answers,
                } as GameExerciseStudents)
            ),
          } as GetAllGameLevelResponse)
      )
      .catch(err => {
        throw err;
      });
  }

  getQuestionsOfLevel(
    game_exercise_id: number,
    level: string,
    student_id: number
  ): Promise<QuestionResponse[]> {
    return GameExerciseDAL.listQuestionsOfLevelWithFilter(
      game_exercise_id,
      level,
      student_id
    );
  }

  upsertBookStudent(data: BookStudent): Promise<boolean> {
    return BookDAL.upsertBookStudent(data);
  }

  saveGameExerciseResult(data: GameExerciseResults): Promise<boolean> {
    return GameExerciseDAL.createGameExerciseResult({
      ...data,
      is_correct: data.right_answer_index === data.student_answer_index,
    } as GameExerciseResults)
      .then(gameExerciseResult => {
        if (gameExerciseResult.is_correct) {
          return GameExerciseDAL.upsertGameExerciseStudent({
            game_exercise_id: gameExerciseResult.game_exercise_id,
            student_id: gameExerciseResult.student_id,
            level: gameExerciseResult.level,
          } as GameExerciseStudents).then(() => true);
        }
        return true;
      })
      .catch(err => {
        throw err;
      });
  }

  clearGameExercise(
    game_exercise_id: number,
    student_id: number
  ): Promise<boolean> {
    return Promise.all([
      GameExerciseDAL.clearGameExerciseResultViaExerciseIdStudentId(
        game_exercise_id,
        student_id
      ),
      GameExerciseDAL.clearGameExerciseStudentViaExerciseIdStudentId(
        game_exercise_id,
        student_id
      ),
    ])
      .then(([exerciseResult, exerciseStudent]) => {
        if (exerciseResult || exerciseStudent) return true;
        return false;
      })
      .catch(err => {
        throw err;
      });
  }
}

export default new ResourceBusiness();
