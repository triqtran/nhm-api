import Book from 'models/Book';
import BookStudent from 'models/BookStudents';
import GameExerciseDetails from 'models/GameExerciseDetails';
import GameExerciseResults from 'models/GameExerciseResults';
import GameExerciseStudents from 'models/GameExerciseStudents';
import GameExercises from 'models/GameExercises';

type ContinueResourceType = 'Game' | 'Book';

export type UpsertBookStudentRequest = BookStudent;

export type SaveGameExerciseResultRequest = GameExerciseResults;

export type ContinueListRequest = {
  student_id: number;
};

export type ContinueResourceResponse = {
  object_id?: number;
  student_id?: number;
  object_name: string;
  object_background_image: string;
  process?: number;
  type: ContinueResourceType;
  object_other_info: Object;
};

export type EbookResponse = Book & { current_chapter: number };

export type GameExerciseResponse = GameExercises & {
  current_level: string | number;
  detail_levels: string[];
  total_correct_answers: number;
  total_levels_completed: number;
  is_finish: boolean;
};

export type GetAllGameLevelResponse = {
  processing?: GameExerciseStudents[];
  levels?: GameExerciseDetails[];
};

export type QuestionResponse = GameExerciseDetails;

export type LevelsQuestionsResponse = {
  total_correct_answers: number;
  questions: QuestionResponse[];
};
