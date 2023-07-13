import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface CampusAttributes {
  CampusID: number;
  CampusName: string;
  created_at: Date;
  updated_at?: Date;
}

export interface IngredientInput
  extends Optional<CampusAttributes, 'updated_at'> {}
export interface IngredientOutput extends Required<CampusAttributes> {}

class Campus
  extends Model<CampusAttributes, IngredientInput>
  implements CampusAttributes
{
  public CampusID!: number;
  public CampusName!: string;
  public created_at!: Date;
  public updated_at?: Date;
}

Campus.init(
  {
    CampusID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    CampusName: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'campus',
  }
);

export default Campus;
