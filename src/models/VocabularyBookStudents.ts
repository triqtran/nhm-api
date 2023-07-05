import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface VocabularyBookStudentAttributes {
  id: number;
  vocabulary_book_id: number;
  student_id: number;
  read_chapters: number;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<VocabularyBookStudentAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput
  extends Required<VocabularyBookStudentAttributes> {}

class VocabularyBookStudent
  extends Model<VocabularyBookStudentAttributes, IngredientInput>
  implements VocabularyBookStudentAttributes
{
  public id!: number;
  public vocabulary_book_id!: number;
  public student_id!: number;
  public read_chapters!: number;
  public created_at!: Date;
  public updated_at?: Date;
}

VocabularyBookStudent.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    vocabulary_book_id: { type: DataTypes.INTEGER, allowNull: false },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    read_chapters: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'vocabulary_book_student',
  }
);

export default VocabularyBookStudent;
