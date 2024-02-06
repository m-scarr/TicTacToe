import { Sequelize } from "sequelize";
import config from "../config/database.js";

const env = process.env.NODE_ENV || "development";

const db = {};

const sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    config[env]
);

const modelFileNames = ["user"];

for (let i = 0; i < modelFileNames.length; i++) {
    const modelFileName = modelFileNames[i];
    const model = await import(`./${modelFileName}.js`);
    db[modelFileName.charAt(0).toUpperCase() + modelFileName.slice(1)] = model.default(sequelize, Sequelize.DataTypes);
}

Object.keys(db).forEach((modelName) => {
    if (typeof db[modelName].associate === "function") {
        db[modelName].associate(db);
    }
    if (typeof db[modelName].initializeHooks === "function") {
        db[modelName].initializeHooks(db);
    }
});

try {
    await sequelize.sync();
    console.log('Tables synchronized successfully.');
} catch (error) {
    console.error('Error synchronizing tables:', error);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
