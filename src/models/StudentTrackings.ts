import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface StudentTrackingsAttributes {
  id: number;
  student_user_id: number;
  action: string;
  platform: string;
  created_at: Date;
}
export interface IngredientInput extends Optional<StudentTrackingsAttributes, 'id'> {}
export interface IngredientOuput extends Required<StudentTrackingsAttributes> {}

class StudentTrackings
  extends Model<StudentTrackingsAttributes, IngredientInput>
  implements StudentTrackingsAttributes
{
  public id!: number;
  public student_user_id!: number;
  public action!: string;
  public platform!: string;
  public created_at!: Date;
}

StudentTrackings.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    student_user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    platform: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'student_trackings',
  }
);

export default StudentTrackings;
