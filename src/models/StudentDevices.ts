import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface StudentDevicesAttributes {
  id: number;
  student_id: number;
  device_token: string;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<StudentDevicesAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentDevicesAttributes> {}

class StudentDevices
  extends Model<StudentDevicesAttributes, IngredientInput>
  implements StudentDevicesAttributes
{
  public id!: number;
  public student_id!: number;
  public device_token!: string;
  public created_at!: Date;
  public updated_at?: Date;
}

StudentDevices.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: { type: DataTypes.INTEGER.UNSIGNED },
    device_token: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    sequelize: dbConnection,
    tableName: 'student_devices',
  }
);

export default StudentDevices;
