import { ContinueResourceResponse } from './types';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import BookDAL from 'dals/BookDAL';

interface IResourceBusiness {
  listContinue: (student_id: number) => Promise<any>;
}

class ResourceBusiness implements IResourceBusiness {
  listContinue(student_id: number): Promise<any> {
    return GameExerciseDAL.getByStudentId(student_id)
  };
}

export default new ResourceBusiness();
