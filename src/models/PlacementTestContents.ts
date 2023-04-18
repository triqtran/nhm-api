import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface PlacementTestContentsAttributes {
  id: number;
  placement_test_id: number;
  question: string;
  answers: string;
  right_answer_index: number;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<PlacementTestContentsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<PlacementTestContentsAttributes> {}

class PlacementTestContents extends Model<PlacementTestContentsAttributes, IngredientInput> implements PlacementTestContentsAttributes {
  public id!: number;
  public placement_test_id!: number;
  public question!: string;
  public answers!: string;
  public right_answer_index!: number;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

PlacementTestContents.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  placement_test_id: { type: DataTypes.INTEGER, allowNull: false },
  question: { type: DataTypes.STRING, allowNull: false },
  answers: { type: DataTypes.STRING, allowNull: false },
  right_answer_index: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'placement_test_contents',
})

export default PlacementTestContents;
