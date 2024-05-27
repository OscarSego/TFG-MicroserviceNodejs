import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('lamparasoportos', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;