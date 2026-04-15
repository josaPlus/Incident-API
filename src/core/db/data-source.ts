import { envs } from "src/config/envs";
import { Incident } from "src/core/entities/incident.entity";
import { DataSourceOptions } from "typeorm";
import { DataSource } from "typeorm";

export const dataSourceOptions : DataSourceOptions = {
    host: envs.DB_HOST,
    database: envs.DB_NAME,
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    port: envs.DB_PORT,
    type:"postgres",
    entities: [Incident],
    synchronize: false,
    migrations: ["dist/core/db/migrations/*"] // el lugar donde se encuentran mis migraciones, pero en JS
};

export const dataSource = new DataSource(dataSourceOptions)