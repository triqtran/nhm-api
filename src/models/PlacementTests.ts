import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

export type Placement_Test_Status = 'new' | 'released' | 'closed';

interface PlacementTestsAttributes {
  id: number;
  name: string;
  status: Placement_Test_Status;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<PlacementTestsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<PlacementTestsAttributes> {}

class PlacementTests extends Model<PlacementTestsAttributes, IngredientInput> implements PlacementTestsAttributes {
  public id!: number;
  public name!: string;
  public status!: Placement_Test_Status;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

PlacementTests.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'placement_tests',
})

export default PlacementTests;
