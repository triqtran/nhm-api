import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

export type GameExerciseStatus = 'new' | 'released' | 'closed';
export type GameExerciseType = 'pin_yin' | 'vocabulary';

interface GameExercisesAttributes {
  id: number;
  name: string;
  status: GameExerciseStatus;
  total_level: number;
  type: GameExerciseType;
  description: string;
  how_to_play: string;
  // intro: "Review the Pin yin,Practice listening"
  intro: string;
  course_id: number;
  is_trial: boolean;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<GameExercisesAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<GameExercisesAttributes> {}

class GameExercises
  extends Model<GameExercisesAttributes, IngredientInput>
  implements GameExercisesAttributes
{
  public id!: number;
  public name!: string;
  public status!: GameExerciseStatus;
  public total_level!: number;
  public type!: GameExerciseType;
  public description!: string;
  public how_to_play!: string;
  public intro!: string;
  public course_id!: number;
  public is_trial!: boolean;
  public created_at!: Date;
  public updated_at?: Date;
}

GameExercises.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    total_level: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 4 },
    type: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'pin_yin',
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    how_to_play: { type: DataTypes.STRING, allowNull: true },
    intro: { type: DataTypes.STRING, allowNull: true },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    is_trial: { type: DataTypes.BOOLEAN, allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'game_exercises',
  }
);

export default GameExercises;
