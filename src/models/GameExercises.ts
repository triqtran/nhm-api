import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

export type GameExerciseStatus = 'new' | 'released' | 'closed';

interface GameExercisesAttributes {
  id: number;
  name: string;
  status: GameExerciseStatus;
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
