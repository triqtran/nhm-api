import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface GameExerciseStudentsAttributes {
  game_exercise_id: number;
  student_id: number;
  level: string;
  total_correct_answers: number;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<
    GameExerciseStudentsAttributes,
    'game_exercise_id' | 'student_id' | 'updated_at'
  > {}
export interface IngredientOutput
  extends Required<GameExerciseStudentsAttributes> {}

class GameExerciseStudents
  extends Model<GameExerciseStudentsAttributes, IngredientInput>
  implements GameExerciseStudentsAttributes
{
  public game_exercise_id!: number;
  public student_id!: number;
  public level!: string;
  public total_correct_answers!: number;
  public created_at!: Date;
  public updated_at?: Date;
}

GameExerciseStudents.init(
  {
    game_exercise_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    level: { type: DataTypes.STRING, allowNull: true },
    total_correct_answers: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'game_exercise_students',
  }
);

export default GameExerciseStudents;
