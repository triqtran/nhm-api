import GameExercises from 'models/GameExercises';
import Book from 'models/Book';

type ContinueResourceType = 'Game' | 'Book';

export type ContinueListRequest = {
  student_id: number;
};

export type ContinueResourceResponse = {
  object_id: number;
  student_id: number;
  object_name: string;
  object_background_image: string;
  process: number;
  type: ContinueResourceType;
};
