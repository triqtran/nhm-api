import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

export type StudentStatus = 'registered' | 'active' | 'suspended';

interface StudentsAttributes {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone: string;
  status: StudentStatus;
  password: string;
  ayotree_student_id?: number;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<StudentsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentsAttributes> {}

class Students extends Model<StudentsAttributes, IngredientInput> implements StudentsAttributes {
  public id!: number
  public first_name!: string
  public last_name!: string
  public birthday!: string
  public email!: string
  public phone!: string
  public status!: StudentStatus;
  public password!: string;
  public ayotree_student_id?: number;
  public created_at!: Date;
  public updated_at?: Date;
}

Students.init({
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
  status: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  ayotree_student_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'students',
})

export default Students;
