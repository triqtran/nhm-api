import {
  ContinueResourceResponse,
  EbookResponse,
  GameExerciseResponse,
} from './types';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import StudentsDAL from 'dals/StudentsDAL';
import BookDAL from 'dals/BookDAL';
import GameExercises from 'models/GameExercises';

interface IResourceBusiness {
  listContinue: (student_id: number) => Promise<ContinueResourceResponse[]>;
  listEbook: (student_id: number) => Promise<EbookResponse[]>;
  listGame: (student_id: number) => Promise<GameExerciseResponse[]>;
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

  listEbook(student_id: number): Promise<EbookResponse[]> {
    return StudentsDAL.getStudentById(student_id)
      .then(student => BookDAL.listBookWithoutPaging({ level: student.level }))
      .then(books =>
        books.map(
          item =>
            ({
              background_image: item.background_image,
              name: item.name,
              short_description: item.short_description,
              description: item.description,
              total_chapters: item.total_chapters,
              current_chapter: item.book_student?.current_chapter || 0,
              url_file: item.url_file,
            } as EbookResponse)
        )
      )
      .catch(err => {
        throw err;
      });
  }
  listGame(student_id: number): Promise<GameExerciseResponse[]> {
    return StudentsDAL.getStudentById(student_id)
      .then(student =>
        GameExerciseDAL.listGameWithoutPaging({ level: student.level })
      )
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
              stars_to_win: game.stars_to_win,
              type: game.type,
            } as GameExerciseResponse)
        )
      )
      .catch(err => {
        throw err;
      });
  }
}

export default new ResourceBusiness();
