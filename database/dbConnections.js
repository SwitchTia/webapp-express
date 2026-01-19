import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "blog",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to Mysql");
});

export default connection;