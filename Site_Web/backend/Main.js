const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2/promise");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const { exit } = require("process");

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());


const Router = require("./Router");


async function SetUpDb() {
  try{
    //await db.query({ sql:"DROP TABLE users"});
    let result=await db.query({ sql:"CREATE TABLE users ( ID int NOT NULL AUTO_INCREMENT, Username varchar(128) NOT NULL,Password varchar(128),Email varchar(128),Preference varchar(256),Admin	tinyint(1),PRIMARY KEY (ID))"});
  }
  catch(e){
    if(e.code="ER_TABLE_EXISTS_ERROR"){
      console.log("User Table exists")
    }
    else{ 
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

try{
  SetUpDb().catch((error) => { console.log(error);exit();});

  new Router(app, db);
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'build,"index.html'));
  });

  app.listen(3000);

}
catch(e){
  console.log(e)
}



