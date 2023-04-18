import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

export type Student_User_Kind = 'kid' | 'adult';
export type Student_User_Status = 'new' | 'member' | 'disabled';

interface StudentUsersAttributes {
  id: number;
  first_name: string;
  last_name: string;
  registered_user_id: number;
  kind: Student_User_Kind;
  status: Student_User_Status;
  user_name: string;
  password: string;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<StudentUsersAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<StudentUsersAttributes> {}

class StudentUsers extends Model<StudentUsersAttributes, IngredientInput> implements StudentUsersAttributes {
  public id!: number
  public first_name!: string
  public last_name!: string
  public registered_user_id!: number;
  public kind!: Student_User_Kind;
  public status!: Student_User_Status;
  public user_name!: string;
  public password!: string;
  public created_at!: Date;
  public updated_at?: Date;
  
}

StudentUsers.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  registered_user_id: { type: DataTypes.INTEGER, allowNull: false },
  kind: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  user_name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'student_users',
})

export default StudentUsers;
