import { DataTypes, Model, Optional, TINYINT } from 'sequelize';
import dbConnection from './dbConnection';

export type GameExerciseStatus = 'new' | 'released' | 'closed';
export type GameExerciseType = 'pin_yin' | 'vocabulary';

interface GameExercisesAttributes {
  id: number;
  name: string;
  status: GameExerciseStatus;
  background_image: string;
  total_level: number;
  type: GameExerciseType;
  description: string;
  how_to_play: string;
  // intro: "Review the Pin yin,Practice listening"
  intro: string;
  stars_to_win?: number;
  level: string;
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
  public background_image!: string;
  public total_level!: number;
  public type!: GameExerciseType;
  public description!: string;
  public how_to_play!: string;
  public intro!: string;
  public level!: string;
  public stars_to_win!: number;
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
    background_image: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'pin_yin',
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    how_to_play: { type: DataTypes.STRING, allowNull: true },
    intro: { type: DataTypes.STRING, allowNull: true },
    level: { type: DataTypes.STRING(50), allowNull: true },
    stars_to_win: { type: DataTypes.TINYINT, defaultValue: 10 },
    is_trial: { type: TINYINT, allowNull: false, defaultValue: false },
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
