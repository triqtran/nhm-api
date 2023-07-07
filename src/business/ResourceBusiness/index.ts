import { ContinueResourceResponse } from './types';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import BookDAL from 'dals/BookDAL';

interface IResourceBusiness {
  listContinue: (student_id: number) => Promise<any>;
}

class ResourceBusiness implements IResourceBusiness {
  listContinue(student_id: number): Promise<any> {
    return Promise.all([
      GameExerciseDAL.getByStudentId(student_id),
      BookDAL.getByStudentId(student_id),
    ])
      .then(([gameExercises, books]) => {
        const wrapGameData = gameExercises.map(item => {
          return {
            object_id: item.game_exercise_id,
            student_id: item.student_id,
            object_name: item?.game_info.name,
            object_background_image: item.game_info.background_image,
            // Need to handled this one
            process: 50,
            type: 'Game',
          } as ContinueResourceResponse;
        });
        const wrapBookData = books.map(item => {
          return {
            object_id: item.book_id,
            student_id: item.student_id,
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
