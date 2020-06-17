const lowDb = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');
const adapter = new fileSync('db.json');
const db = lowDb(adapter);

db.defaults({users:[], topics:[]});

module.exports = db;