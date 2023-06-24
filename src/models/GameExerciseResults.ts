import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface GameExerciseResultsAttributes {
  id: number;
  game_exercise_id: number;
  student_id: number;
  question: string;
  // answers: "Dog,Cat,Mouse,Duck"
  answers: string;
  // it means that: (Dog: 0), (Cat: 1), (Mouse: 2), (Duck: 3)
  right_answer_index: number;
  student_answer_index: number;
  is_correct: boolean;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<GameExerciseResultsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<GameExerciseResultsAttributes> {}

class GameExerciseResults
  extends Model<GameExerciseResultsAttributes, IngredientInput>
  implements GameExerciseResultsAttributes
{
  public id!: number;
  public game_exercise_id!: number;
  public student_id!: number;
  public question!: string;
  public answers!: string;
  public right_answer_index!: number;
  public student_answer_index!: number;
  public is_correct!: boolean;
  public created_at!: Date;
  public updated_at?: Date;
}

GameExerciseResults.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    game_exercise_id: { type: DataTypes.INTEGER.UNSIGNED },
    student_id: { type: DataTypes.INTEGER.UNSIGNED },
    question: { type: DataTypes.STRING, allowNull: false },
    answers: { type: DataTypes.STRING, allowNull: false },
    right_answer_index: { type: DataTypes.INTEGER, allowNull: false },
    student_answer_index: { type: DataTypes.INTEGER },
    is_correct: { type: DataTypes.BOOLEAN },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'game_exercise_results',
  }
);

export default GameExerciseResults;
