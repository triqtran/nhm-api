import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface CoursesAttributes {
  CourseID: string;
  CourseCode: string;
  CourseTitle: string;
  SchedulingType: string;
  LearningType: string;
  CourseCategories: string;
  StartDate: Date;
  EndDate: Date;
  CourseTimeZone: string;
  created_at: Date;
  updated_at?: Date;
}

export interface IngredientInput
  extends Optional<CoursesAttributes, 'updated_at'> {}
export interface IngredientOutput extends Required<CoursesAttributes> {}

class Courses
  extends Model<CoursesAttributes, IngredientInput>
  implements CoursesAttributes
{
  public CourseID!: string;
  public CourseCode!: string;
  public CourseTitle!: string;
  public SchedulingType!: string;
  public LearningType!: string;
  public CourseCategories!: string;
  public StartDate!: Date;
  public EndDate!: Date;
  public CourseTimeZone!: string;
  public created_at!: Date;
  public updated_at?: Date;
}

Courses.init(
  {
    CourseID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    CourseCode: {
      type: DataTypes.STRING,
    },
    CourseTitle: {
      type: DataTypes.STRING,
    },
    SchedulingType: {
      type: DataTypes.STRING,
    },
    LearningType: {
      type: DataTypes.STRING,
    },
    CourseCategories: {
      type: DataTypes.STRING,
    },
    StartDate: {
      type: DataTypes.DATE,
    },
    EndDate: {
      type: DataTypes.DATE,
    },
    CourseTimeZone: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'courses',
  }
);

export default Courses;
