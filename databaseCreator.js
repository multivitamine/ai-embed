const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./product.db');

db.run(
  'CREATE TABLE productVectors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, vector TEXT)',
);
db.close();
