import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface GameExerciseDetailsAttributes {
  id: number;
  game_exercise_id: number;
  question: string;
  audio_url?: string;
  // answers: "Dog|Cat|Mouse|Duck"
  answers: string;
  answers_image: string;
  // it means that: (Dog: 0), (Cat: 1), (Mouse: 2), (Duck: 3)
  right_answer_index: number;

  level: string;
  level_index: number;

  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<
    GameExerciseDetailsAttributes,
    'id' | 'updated_at' | 'created_at'
  > {}
export interface IngredientOuput
  extends Required<GameExerciseDetailsAttributes> {}

class GameExerciseDetails
  extends Model<GameExerciseDetailsAttributes, IngredientInput>
  implements GameExerciseDetailsAttributes
{
  public id!: number;
  public game_exercise_id!: number;
  public question!: string;
  public audio_url?: string;
  public answers!: string;
  public answers_image!: string;
  public right_answer_index!: number;
  public level!: string;
  public level_index!: any;
  public created_at!: Date;
  public updated_at?: Date;
}

GameExerciseDetails.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    game_exercise_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    question: { type: DataTypes.STRING, allowNull: true },
    audio_url: { type: DataTypes.STRING, allowNull: true },
    answers: { type: DataTypes.STRING, allowNull: true },
    answers_image: { type: DataTypes.TEXT, allowNull: true },
    right_answer_index: { type: DataTypes.INTEGER, allowNull: false },
    level: { type: DataTypes.STRING, allowNull: true },
    level_index: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'game_exercise_details',
  }
);

export default GameExerciseDetails;
