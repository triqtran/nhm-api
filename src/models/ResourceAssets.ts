import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import dbConnection from './dbConnection';

export type Resorce_Assets_Type = 'voice' | 'audio' | 'ebook' | 'image';

interface ResourceAssetsAttributes {
  id: number;
  alias?: string;
  name?: string;
  link: string;
  type: Resorce_Assets_Type;
  created_at: Date;
  updated_at?: Date;
}
export interface IngredientInput extends Optional<ResourceAssetsAttributes, 'id' | 'updated_at'> {}
export interface IngredientOuput extends Required<ResourceAssetsAttributes> {}

class ResourceAssets
  extends Model<ResourceAssetsAttributes, IngredientInput>
  implements ResourceAssetsAttributes
{
  public id!: number;
  public alias?: string;
  public name?: string;
  public link!: string;
  public type!: Resorce_Assets_Type;
  public created_at!: Date;
  public updated_at?: Date | undefined;
}

ResourceAssets.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    alias: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: false,
    sequelize: dbConnection,
    tableName: 'resource_assets',
  }
);

export default ResourceAssets;
