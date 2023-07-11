import { DataTypes, Model, Optional } from 'sequelize';
import dbConnection from './dbConnection';
import Courses from './Courses';

export type StudentStatus = 'registered' | 'active' | 'suspended';

interface StudentsAttributes {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone: string;
  status: StudentStatus;
  user_name: string;
  password: string;
  ayotree_student_id?: number;
  ayotree_campus_id?: number;
  ayotree_course_title?: string;
  ayotree_course_code?: string;
  level?: string;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput
  extends Optional<StudentsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentsAttributes> {}

class Students
  extends Model<StudentsAttributes, IngredientInput>
  implements StudentsAttributes
{
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public birthday!: string;
  public email!: string;
  public phone!: string;
  public status!: StudentStatus;
  public user_name!: string;
  public password!: string;
  public ayotree_student_id?: number;
  public ayotree_campus_id?: number;
  public ayotree_course_code?: string;
  public ayotree_course_title?: string;
  public level?: string;
  public created_at!: Date;
  public updated_at?: Date;
}

Students.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    birthday: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'registered',
      values: ['registered', 'active', 'suspended'],
    },
    user_name: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    ayotree_student_id: { type: DataTypes.INTEGER },
    ayotree_campus_id: { type: DataTypes.INTEGER },
    ayotree_course_code: { type: DataTypes.STRING },
    ayotree_course_title: { type: DataTypes.STRING },
    level: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'students',
  }
);

Students.belongsTo(Courses, {
  as: 'course',
  foreignKey: 'ayotree_course_code',
  targetKey: 'CourseCode',
});

export default Students;
