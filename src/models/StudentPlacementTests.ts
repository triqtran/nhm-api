import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

export type Placement_Test_Status = 'new' | 'released' | 'closed';

interface StudentPlacementTestsAttributes {
  id: number;
  student_user_id: number;
  placement_test_id: number;
  is_onboard_test: boolean;
  is_done: boolean;
  closed_date?: Date;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<StudentPlacementTestsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentPlacementTestsAttributes> {}

class StudentPlacementTests extends Model<StudentPlacementTestsAttributes, IngredientInput> implements StudentPlacementTestsAttributes {
  public id!: number;
  public student_user_id!: number;
  public placement_test_id!: number;
  public is_onboard_test!: boolean;
  public is_done!: boolean;
  public closed_date?: Date | undefined;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

StudentPlacementTests.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  student_user_id: { type: DataTypes.INTEGER, allowNull: false },
  placement_test_id: { type: DataTypes.INTEGER, allowNull: false },
  is_onboard_test: { type: DataTypes.BOOLEAN, allowNull: false },
  is_done: { type: DataTypes.BOOLEAN, allowNull: false },
  closed_date: { type: DataTypes.TIME },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'student_placement_tests',
})

export default StudentPlacementTests;
