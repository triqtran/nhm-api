import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface StudentNotifictionsAttributes {
  id: number;
  notification_id: number;
  student_ids: string;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<StudentNotifictionsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentNotifictionsAttributes> {}

class StudentNotifictions
  extends Model<StudentNotifictionsAttributes, IngredientInput>
  implements StudentNotifictionsAttributes
{
  public id!: number;
  public notification_id!: number;
  public student_ids!: string;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

StudentNotifictions.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    notification_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    student_ids: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'student_notifications',
  }
);

export default StudentNotifictions;
