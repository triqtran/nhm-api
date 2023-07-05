import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

export type VocabularyStatus = 'new' | 'released' | 'closed';

interface VocabularyBookAttributes {
  id: number;
  name: string;
  status: VocabularyStatus;
  url_file: string;
  uploaded_by_id: number;
  uploaded_by_name: string;
  description: string;
  total_chapters: number;
  course_id: number;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<VocabularyBookAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<VocabularyBookAttributes> {}

class VocabularyBook
  extends Model<VocabularyBookAttributes, IngredientInput>
  implements VocabularyBookAttributes
{
  public id!: number;
  public name!: string;
  public url_file!: string;
  public status!: VocabularyStatus;
  public total_chapters!: number;
  public description!: string;
  public uploaded_by_id!: number;
  public uploaded_by_name!: string;
  public course_id!: number;
  public created_at!: Date;
  public updated_at?: Date;
}

VocabularyBook.init(
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
    uploaded_by_id: { type: DataTypes.INTEGER, allowNull: true },
    uploaded_by_name: { type: DataTypes.STRING, allowNull: true },
    course_id: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'vocabulary_books',
  }
);

export default VocabularyBook;
