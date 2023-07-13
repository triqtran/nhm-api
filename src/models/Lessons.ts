import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';

interface LessonsAttributes {
  LessonID: string;
  CourseCode: string;
  CourseTitle: string;
  TeacherPIN: string;
  TeacherName: string;
  LessonStart: Date;
  LessonEnd: Date;
  ClassRoomID: string;
  ClassRoomName: string;
  Comment?: string;
  AttendanceSubmitted: boolean;
  DailyReportSubmitted: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface IngredientInput
  extends Optional<LessonsAttributes, 'updated_at'> {}
export interface IngredientOutput extends Required<LessonsAttributes> {}

class Lessons
  extends Model<LessonsAttributes, IngredientInput>
  implements LessonsAttributes
{
  public LessonID!: string;
  public CourseCode!: string;
  public CourseTitle!: string;
  public TeacherPIN!: string;
  public TeacherName!: string;
  public LessonStart!: Date;
  public LessonEnd!: Date;
  public ClassRoomID!: string;
  public ClassRoomName!: string;
  public Comment?: string;
  public AttendanceSubmitted!: boolean;
  public DailyReportSubmitted!: boolean;
  public created_at!: Date;
  public updated_at?: Date;
}

Lessons.init(
  {
    LessonID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    CourseCode: {
      type: DataTypes.STRING,
    },
    CourseTitle: {
      type: DataTypes.STRING,
    },
    TeacherPIN: {
      type: DataTypes.STRING,
    },
    TeacherName: {
      type: DataTypes.STRING,
    },
    LessonStart: {
      type: DataTypes.DATE,
    },
    LessonEnd: {
      type: DataTypes.DATE,
    },
    ClassRoomID: {
      type: DataTypes.STRING,
    },
    ClassRoomName: {
      type: DataTypes.STRING,
    },
    Comment: {
      type: DataTypes.STRING,
    },
    AttendanceSubmitted: {
      type: DataTypes.BOOLEAN,
    },
    DailyReportSubmitted: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'lessons',
  }
);

export default Lessons;
