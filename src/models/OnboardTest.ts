import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

export type OnboardTestsStatus = 'new' | 'released' | 'closed';

interface OnboardTestsAttributes {
  id: number;
  name: string;
  link: string;
  status: OnboardTestsStatus;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<OnboardTestsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<OnboardTestsAttributes> {}

class OnboardTests
  extends Model<OnboardTestsAttributes, IngredientInput>
  implements OnboardTestsAttributes
{
  public id!: number;
  public name!: string;
  public link!: string;
  public status!: OnboardTestsStatus;
  public password!: string;
  public ayotree_student_id?: number;
  public created_at!: Date;
  public updated_at?: Date;
}

OnboardTests.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    sequelize: dbConnection,
    tableName: 'onboard_tests',
  }
);

export default OnboardTests;
