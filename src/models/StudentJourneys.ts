import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface StudentJourneysAttributes {
  id: number;
  student_id: number;
  learning_level: string;
  course_package: string;
  is_current: boolean;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<StudentJourneysAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentJourneysAttributes> {}

class StudentJourneys
  extends Model<StudentJourneysAttributes, IngredientInput>
  implements StudentJourneysAttributes
{
  public id!: number;
  public student_id!: number;
  public learning_level!: string;
  public course_package!: string;
  public is_current!: boolean;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

StudentJourneys.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    learning_level: { type: DataTypes.STRING, allowNull: false },
    course_package: { type: DataTypes.STRING, allowNull: false },
    is_current: { type: DataTypes.BOOLEAN, allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'student_journeys',
  }
);

export default StudentJourneys;
