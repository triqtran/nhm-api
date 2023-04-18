import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface StudentPlacementTestResultsAttributes {
  id: number;
  student_placement_test_id: number;
  question: string;
  answers: string;
  right_answer_index: number;
  student_answers?: string;
  is_correct?: boolean;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<StudentPlacementTestResultsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentPlacementTestResultsAttributes> {}

class StudentPlacementTestResults extends Model<StudentPlacementTestResultsAttributes, IngredientInput> implements StudentPlacementTestResultsAttributes {
  public id!: number;
  public student_placement_test_id!: number;
  public question!: string;
  public answers!: string;
  public right_answer_index!: number;
  public student_answers?: string;
  public is_correct?: boolean;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

StudentPlacementTestResults.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  student_placement_test_id: { type: DataTypes.INTEGER, allowNull: false },
  question: { type: DataTypes.STRING, allowNull: false },
  answers: { type: DataTypes.STRING, allowNull: false },
  right_answer_index: { type: DataTypes.INTEGER, allowNull: false },
  student_answers: { type: DataTypes.STRING },
  is_correct: { type: DataTypes.BOOLEAN },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'student_placement_test_results',
})

export default StudentPlacementTestResults;
