import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface StudentUserDeviceTokensAttributes {
  id: number;
  student_user_id: number;
  device_tokens: string;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<StudentUserDeviceTokensAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentUserDeviceTokensAttributes> {}

class StudentUserDeviceTokens extends Model<StudentUserDeviceTokensAttributes, IngredientInput> implements StudentUserDeviceTokensAttributes {
  public id!: number
  public student_user_id!: number;
  public device_tokens!: string;
  public created_at!: Date;
  public updated_at?: Date;
  
}

StudentUserDeviceTokens.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  student_user_id: { type: DataTypes.NUMBER, allowNull: false },
  device_tokens: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'student_user_device_tokens',
})

export default StudentUserDeviceTokens;
