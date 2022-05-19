import express from "express";
import path from "path";
import { dirname } from "path"
import mysql from "mysql2/promise"
import session from "express-session";
import MySQLStore from "express-mysql-session"
import { exit } from "process";
import Router from "./Router.js";

const dirPath = path.join(dirname("."), '/build');

const app = express();

//load directory build


app.use(express.static(dirPath));
app.use(express.json());


async function SetUpDb() {
  try {
    //await db.query({ sql:"DROP TABLE users"});
    let result = await db.query({ sql: "CREATE TABLE users ( ID int NOT NULL AUTO_INCREMENT, Username varchar(128) NOT NULL,Password varchar(128),Email varchar(128),Preference varchar(512),PRIMARY KEY (ID))" });
  }
  catch (e) {
    if (e.code = "ER_TABLE_EXISTS_ERROR") {
      console.log("User Table exists")
    }
    else {
      throw "Error in database";
    }
  }

  console.log("The database is set up");
}


const db = mysql.createPool({
  host: "localhost",
  port: 30306,
  user: "user",
  password: "password",
  database: 'web',
});

const sessionStore = new MySQLStore(
  {
    expiration: 1825 * 86400 * 1000,
    endConnectiononClose: false,
  },
  db
);


app.use(
  session({
    key: "thisismysecretkey",
    secret: "thisismysecretsecret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1825 * 86400 * 1000,
      httpOnly: false,
    },
  })
);

try {
  SetUpDb().catch((error) => { console.log(error); exit(); });

  new Router(app, db);
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'build,"index.html'));
  });

  app.listen(3000);

}
catch (e) {
  console.log(e)
}



