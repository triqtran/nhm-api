import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface StudentUserTrackingsAttributes {
  id: number;
  student_user_id: number;
  action: string;
  platform: string;
  created_at: Date;
}
export interface IngredientInput extends Optional<StudentUserTrackingsAttributes, 'id'> {}
export interface IngredientOuput extends Required<StudentUserTrackingsAttributes> {}

class StudentUserTrackings extends Model<StudentUserTrackingsAttributes, IngredientInput> implements StudentUserTrackingsAttributes {
  public id!: number;
  public student_user_id!: number;
  public action!: string
  public platform!: string;
  public created_at!: Date;
}

StudentUserTrackings.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  student_user_id: { type: DataTypes.INTEGER, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  platform: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.TIME, allowNull: false },
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'student_user_trackings',
})

export default StudentUserTrackings;
