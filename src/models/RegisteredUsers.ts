import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface RegisteredUsersAttributes {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  phone: string;
  email: string;
  is_paid: boolean;
  address?: string;
  nationality?: string;
  sub_name?: string;
  sub_email?: string;
  sub_phone?: string;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<RegisteredUsersAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<RegisteredUsersAttributes> {}

class RegisteredUsers extends Model<RegisteredUsersAttributes, IngredientInput> implements RegisteredUsersAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public birthday!: string;
  public phone!: string;
  public email!: string;
  public is_paid!: boolean;
  public address?: string;
  public nationality?: string;
  public sub_name?: string;
  public sub_email?: string;
  public sub_phone?: string;
  public created_at!: Date;
  public updated_at?: Date;
}

RegisteredUsers.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  birthday: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  is_paid: { type: DataTypes.BOOLEAN, allowNull: false },
  address: { type: DataTypes.STRING },
  nationality: { type: DataTypes.STRING },
  sub_name: { type: DataTypes.STRING },
  sub_email: { type: DataTypes.STRING },
  sub_phone: { type: DataTypes.STRING },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME },
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'registered_users',
})

export default RegisteredUsers;
