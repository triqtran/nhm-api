import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

type NHM_Account_Type = 'admin' | 'teacher';

interface NHMAccountsAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: NHM_Account_Type;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<NHMAccountsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<NHMAccountsAttributes> {}

class NHMAccounts
  extends Model<NHMAccountsAttributes, IngredientInput>
  implements NHMAccountsAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
  public role?: NHM_Account_Type;
  public created_at!: Date;
  public updated_at?: Date;
}

NHMAccounts.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'nhm_accounts',
  }
);

export default NHMAccounts;
