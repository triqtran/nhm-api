import { ContinueResourceResponse } from './types';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import BookDAL from 'dals/BookDAL';

interface IResourceBusiness {
  listContinue: (student_id: number) => Promise<any>;
}

class ResourceBusiness implements IResourceBusiness {
  listContinue(student_id: number): Promise<any> {
    return Promise.all([
      GameExerciseDAL.listBookStudentByStudentId(student_id),
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
}

export default new ResourceBusiness();
