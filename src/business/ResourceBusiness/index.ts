import {
  ContinueResourceResponse,
  EbookResponse,
  GameExerciseResponse,
  GetAllGameLevelResponse,
  QuestionResponse,
} from './types';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import BookDAL from 'dals/BookDAL';

interface IResourceBusiness {
  listContinue: (student_id: number) => Promise<ContinueResourceResponse[]>;
  listEbook: (level?: string) => Promise<EbookResponse[]>;
  listGame: (level?: string) => Promise<GameExerciseResponse[]>;
  listLevelsOfGame: (
    game_exercise_id: number
  ) => Promise<GetAllGameLevelResponse>;
  getQuestionsOfLevel: (
    game_exercise_id: number,
    level: string
  ) => Promise<QuestionResponse[]>;
}

class ResourceBusiness implements IResourceBusiness {
  listContinue(student_id: number): Promise<ContinueResourceResponse[]> {
    return Promise.all([
      GameExerciseDAL.listGameStudentByStudentId(student_id),
      BookDAL.listBookStudentByStudentId(student_id),
    ])
      .then(([gameExercises, books]) => {
        const wrapGameData = gameExercises.map(item => {
          const correctAnswerToCompleteGame =
            item.game_info.total_level * item.game_info.stars_to_win;
          return {
            object_name: item.game_info.name,
            object_background_image: item.game_info.background_image,
            process:
              (item.total_correct_answers / correctAnswerToCompleteGame) * 100,
            type: 'Game',
          } as ContinueResourceResponse;
        });
        const wrapBookData = books.map(item => {
          return {
            object_name: item?.book_info.name,
            object_background_image: item.book_info.background_image,
            process:
              (item.current_chapter / item.book_info.total_chapters) * 100,
            type: 'Book',
          } as ContinueResourceResponse;
        });

        return [...wrapGameData, ...wrapBookData];
      })
      .catch(err => {
        throw err;
      });
  }

  listEbook(level?: string): Promise<EbookResponse[]> {
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
  listGame(level?: string): Promise<GameExerciseResponse[]> {
    return GameExerciseDAL.listGameWithoutPaging({ level })
      .then(games =>
        games.map(
          game =>
            ({
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
            } as GameExerciseResponse)
        )
      )
      .catch(err => {
        throw err;
      });
  }

  listLevelsOfGame(game_exercise_id: number): Promise<GetAllGameLevelResponse> {
    return GameExerciseDAL.getAllLevelViaGameId(game_exercise_id);
  }

  getQuestionsOfLevel(
    game_exercise_id: number,
    level: string
  ): Promise<QuestionResponse[]> {
    return GameExerciseDAL.listQuestionsOfLevel(game_exercise_id, level);
  }
}

export default new ResourceBusiness();
