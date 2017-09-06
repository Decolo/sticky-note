const Sequelize = require('sequelize')
const path = require('path')

const sequelize = new Sequelize(undefined, undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',
  // SQLite only
  storage: path.join(__dirname, '../database/database.sqlite')
})

// 数据库自动还会添加一个id、createAt、upDateAt
// id content 112233 223344
const Note = sequelize.define('note', {
  content: {
    type: Sequelize.STRING
  }
})

module.exports = Note



