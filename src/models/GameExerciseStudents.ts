import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';
import GameExercises from './GameExercises';
import GameExerciseDetails from './GameExerciseDetails';

interface GameExerciseStudentsAttributes {
  game_exercise_id: number;
  student_id: number;
  level: string;
  level_index: number;
  next_level: number;
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
  public level_index!: number;
  public next_level!: number;
  public total_correct_answers!: number;
  public created_at!: Date;
  public updated_at?: Date;
}

GameExerciseStudents.init(
  {
    game_exercise_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    level_index: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    level: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    next_level: { type: DataTypes.TINYINT, allowNull: true },
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

GameExerciseStudents.belongsTo(GameExercises, {
  as: 'game_info',
  foreignKey: 'game_exercise_id',
  targetKey: 'id',
});

GameExercises.hasMany(GameExerciseStudents, {
  as: 'game_student',
  foreignKey: 'game_exercise_id',
});

GameExercises.hasMany(GameExerciseDetails, {
  as: 'game_detail',
  foreignKey: 'game_exercise_id',
});

export default GameExerciseStudents;
