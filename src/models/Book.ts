import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';
import BookStudent from './BookStudents';

export type BookStatus = 'new' | 'released' | 'closed';

interface BookAttributes {
  id: number;
  name: string;
  status: BookStatus;
  url_file: string;
  uploaded_by_id: number;
  uploaded_by_name: string;
  description: string;
  short_description: string;
  total_chapters: number;
  level: string;
  background_image: string;
  is_trial: boolean;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<BookAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<BookAttributes> {}

class Book
  extends Model<BookAttributes, IngredientInput>
  implements BookAttributes
{
  public id!: number;
  public name!: string;
  public url_file!: string;
  public status!: BookStatus;
  public total_chapters!: number;
  public description!: string;
  public short_description!: string;
  public uploaded_by_id!: number;
  public uploaded_by_name!: string;
  public background_image!: string;
  public is_trial!: boolean;
  public level!: string;
  public created_at!: Date;
  public updated_at?: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    url_file: { type: DataTypes.TEXT, allowNull: false },
    total_chapters: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 4,
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    short_description: { type: DataTypes.STRING, allowNull: true },
    uploaded_by_id: { type: DataTypes.INTEGER, allowNull: true },
    uploaded_by_name: { type: DataTypes.STRING, allowNull: true },
    background_image: { type: DataTypes.TEXT, allowNull: true },
    is_trial: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: false,
    },
    level: { type: DataTypes.STRING(50), allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'books',
  }
);

export default Book;
