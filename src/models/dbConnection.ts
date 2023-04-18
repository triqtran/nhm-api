import { Sequelize as SequelizeType } from "sequelize";
import config from '@config';
const dbhost = config.DB_HOST;
const dbport = config.DB_PORT;
const dbdriver = config.DB_DRIVER;
const dbuser = config.DB_USER;
const dbpass = config.DB_PASS;
const dbschema = config.DB_SCHEMA;

export default new SequelizeType(dbschema, dbuser, dbpass, {
  host: dbhost,
  port: dbport,
  dialect: dbdriver,
  pool: { max: 30, min: 0, idle: 30, acquire: 30000 },
  dialectOptions: { dateStrings: true, typeCast: true },
  timezone: "+07:00"
});
