import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface NotificationsAttributes {
  id: number;
  title: string;
  action: string;
  object_id: string;
  short_description: string;
  description?: string;
  is_read?: boolean;
  is_pushed?: boolean;
  for_student_user?: boolean;
  student_user_id?: number;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<NotificationsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<NotificationsAttributes> {}

class Notifications extends Model<NotificationsAttributes, IngredientInput> implements NotificationsAttributes {
  public id!: number;
  public title!: string;
  public action!: string;
  public object_id!: string;
  public short_description!: string;
  public description?: string | undefined;
  public is_read?: boolean | undefined;
  public is_pushed?: boolean | undefined;
  public for_student_user?: boolean | undefined;
  public student_user_id?: number | undefined;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

Notifications.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  object_id: { type: DataTypes.STRING, allowNull: false },
  short_description: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  is_read: { type: DataTypes.BOOLEAN },
  is_pushed: { type: DataTypes.BOOLEAN },
  for_student_user: { type: DataTypes.BOOLEAN },
  student_user_id: { type: DataTypes.BOOLEAN },
  created_at: { type: DataTypes.TIME, allowNull: false },
  updated_at: { type: DataTypes.TIME }
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'notifications',
})

export default Notifications;
