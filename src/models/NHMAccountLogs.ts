import { DataTypes, Model, Optional } from "sequelize";
import dbConnection from './dbConnection';

interface NHMAccountLogsAttributes {
  id: number;
  nhm_account_id: number;
  action: string;
  created_at: Date;
}
export interface IngredientInput extends Optional<NHMAccountLogsAttributes, 'id'> {}
export interface IngredientOuput extends Required<NHMAccountLogsAttributes> {}

class NHMAccountLogs extends Model<NHMAccountLogsAttributes, IngredientInput> implements NHMAccountLogsAttributes {
  public id!: number;
  public nhm_account_id!: number;
  public action!: string;
  public created_at!: Date;
}

NHMAccountLogs.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  nhm_account_id: { type: DataTypes.NUMBER, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.TIME, allowNull: false },
}, {
  timestamps: true,
  sequelize: dbConnection,
  paranoid: true,
  tableName: 'nhm_account_logs',
})

export default NHMAccountLogs;
