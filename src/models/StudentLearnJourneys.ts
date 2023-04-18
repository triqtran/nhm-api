import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface StudentLearnJourneysAttributes {
  id: number;
  student_user_id: number;
  learning_level: string;
  course_package: string;
  is_current: boolean;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<StudentLearnJourneysAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentLearnJourneysAttributes> {}

class StudentLearnJourneys extends Model<StudentLearnJourneysAttributes, IngredientInput> implements StudentLearnJourneysAttributes {
  public id!: number;
  public student_user_id!: number;
  public learning_level!: string;
  public course_package!: string;
  public is_current!: boolean;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

StudentLearnJourneys.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  student_user_id: { type: DataTypes.INTEGER, allowNull: false },
  learning_level: { type: DataTypes.STRING, allowNull: false },
  course_package: { type: DataTypes.STRING, allowNull: false },
  is_current: { type: DataTypes.BOOLEAN, allowNull: false },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'student_learn_journeys',
})

export default StudentLearnJourneys;
