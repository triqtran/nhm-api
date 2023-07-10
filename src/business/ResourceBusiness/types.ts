import Book from 'models/Book';
import GameExercises from 'models/GameExercises';

type ContinueResourceType = 'Game' | 'Book';

export type ContinueListRequest = {
  student_id: number;
};

export type ContinueResourceResponse = {
  object_id?: number;
  student_id?: number;
  object_name: string;
  object_background_image: string;
  process: number;
  type: ContinueResourceType;
};

export type EbookResponse = Book & { current_chapter: number };

export type GameExerciseResponse = GameExercises & {
  current_level: string | number;
  detail_levels: string[];
};
