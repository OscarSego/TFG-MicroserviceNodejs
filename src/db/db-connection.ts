import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('lamparasoporto', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;