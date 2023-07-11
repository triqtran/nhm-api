import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';
import Book from './Book';

interface BookStudentAttributes {
  book_id: number;
  student_id: number;
  current_chapter: number;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<BookStudentAttributes, 'created_at' | 'updated_at'> {}
export interface IngredientOuput extends Required<BookStudentAttributes> {}

class BookStudent
  extends Model<BookStudentAttributes, IngredientInput>
  implements BookStudentAttributes
{
  public book_id!: number;
  public student_id!: number;
  public current_chapter!: number;
  public created_at!: Date;
  public updated_at?: Date;
}

BookStudent.init(
  {
    book_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    current_chapter: {
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
    tableName: 'book_student',
  }
);

BookStudent.belongsTo(Book, {
  as: 'book_info',
  foreignKey: 'book_id',
  targetKey: 'id',
});

Book.hasOne(BookStudent, {
  as: 'book_student',
  foreignKey: 'book_id',
});

export default BookStudent;
