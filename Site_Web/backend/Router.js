const bcrypt = require("bcrypt");
const { json, raw } = require("express");
const { response } = require("express");
const { Client } = require('@elastic/elasticsearch')
const ElasticClient = new Client({
  node: 'http://localhost:30200',
})


class Router {
  constructor(app, db) {
    this.login(app, db);
    this.logout(app, db);
    this.isLoggedIn(app, db);
    this.register(app, db);
    this.UpdateUsername(app, db);
    this.UpdatePassworld(app, db);
    this.UpdateEmail(app, db);
    this.GetUsers(app, db);
    this.toggleAdmin(app, db);
    this.DeleteUser(app, db);
    this.getNews(app, db);
  }

  DeleteUser(app, db) {
    app.post("/DeleteUser", (req, res) => {
      let UserID = req.body.ID;
      let values = [UserID, UserID];

      db.query(
        "DELETE tranzactii FROM tranzactii INNER join conturi as SConturi on SConturi.ID = tranzactii.SContID INNER join conturi as RConturi on RConturi.ID = tranzactii.RContID WHERE SConturi.UserID = ? or RConturi.UserID = ?",
        values
      );

      db.query("DELETE conturi FROM conturi WHERE conturi.UserID = ?", UserID);

      db.query(
        "DELETE credite FROM `credite` WHERE credite.UserID = ?",
        UserID
      );

      db.query(
        "DELETE conteconomii FROM conteconomii WHERE conteconomii.UserID = ?",
        UserID
      );
      db.query(
        "DELETE users  FROM users WHERE users.ID = ?",
        UserID,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              msg: "Baza de date a intampinat o eroare",
            });

            return;
          } else {
            res.json({
              success: true,
            });
          }
        }
      );
    });
  }

  toggleAdmin(app, db) {
    app.post("/ToggleAdmin", (req, res) => {
      let UserID = req.body.ID;
      let new_admin = req.body.Admin;
      let values = [new_admin, UserID];
      db.query(
        "UPDATE `users` SET Admin = ? WHERE users.ID = ?",
        values,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              msg: "Baza de date a intampinat o eroare",
            });

            return;
          } else {
            res.json({
              success: true,
            });
          }
        }
      );
    });
  }

  GetUsers(app, db) {
    app.post("/GetUsers", (req, res) => {
      let UserID = req.session.userID;
      db.query(
        "SELECT * FROM `users` WHERE ID != ?",
        UserID,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              msg: "Baza de date a intampinat o eroare",
            });

            return;
          } else {
            res.json({
              success: true,
              data: data,
            });
          }
        }
      );
    });
  }

  UpdateUsername(app, db) {
    app.post("/UpdateUsername", (req, res) => {
      let username = req.body.username;
      let values = [username, req.session.userID];
      db.query(
        "UPDATE `users` SET `Username` = ? WHERE `users`.`ID` = ?",
        values,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              msg: "Eroare",
            });
          } else {
            res.json({
              success: true,
            });
            return true;
          }
        }
      );
    });
  }

  UpdatePassworld(app, db) {
    app.post("/UpdatePassworld", (req, res) => {
      let passwolrd = bcrypt.hashSync(req.body.passwolrd, 9);
      let values = [passwolrd, req.session.userID];
      db.query(
        "UPDATE `users` SET `Password` = ? WHERE `users`.`ID` = ?",
        values,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              msg: "Eroare",
            });
          } else {
            res.json({
              success: true,
            });
            return true;
          }
        }
      );
    });
  }

  UpdateEmail(app, db) {
    app.post("/UpdateEmail", (req, res) => {
      let email = req.body.email;
      let values = [email, req.session.userID];
      db.query(
        "UPDATE `users` SET `Email` = ? WHERE `users`.`ID` = ?",
        values,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              msg: "Eroare",
            });
          } else {
            res.json({
              success: true,
            });
            return true;
          }
        }
      );
    });
  }

  register(app, db) {
    app.post("/register", (req, res) => {
      let username = req.body.username;
      let password = bcrypt.hashSync(req.body.password, 9);
      let email = req.body.email;

      RegisterUser(db, username, password, email).then((response) => res.json(response));
      return;
    })
  }

  login(app, db) {
    app.post("/login", (req, res) => {
      let username = req.body.username;
      let password = req.body.password;

      CheckLoginCreds(db, username, password).then((response) => {
        let responseJ = JSON.parse(response);
        req.session.userID = responseJ.id;
        res.json(response)
      });
      return;
    })
  }

  logout(app, db) {
    app.post("/logout", (req, res) => {
      if (req.session.userID) {
        req.session.destroy();
        res.json({
          success: true,
        });
        return true;
      } else {
        res.json({
          success: false,
        });
        return false;
      }
    });
  }

  isLoggedIn(app, db) {
    app.post("/isLoggedIn", (req, res) => {
      if (req.session.userID) {
        CheckIsLoggedIn(db, req.session.userID).then((response) => { res.json(response) })
        return;
      } else {
        res.json({
          success: "false",
        });
        return;
      }
    });
  }

  getNews(app, db) {
    app.post("/getNews", (req, res) => {

      queryElastic(ElasticClient,req.body.maxItems,req.body.from).then((response) => {
        res.json({
          success: "true",
          data: response,
        });
      });
      return
    });
  }

}

async function queryElastic(ElasticClient,maxItems,from) {
  const result = await ElasticClient.search({
    index: 'news',
    from: from,
    query: {
      match_all: {}
    },
    sort: [{
      "pubDate": {
        "order": "desc",
      }
    }],
    size: maxItems
  })

  data = result["hits"]["hits"].map((news) => {
    return {
      id: news._id,
      title: news._source.title,
      description: news._source.description,
      pubDate: news._source.pubDate,
      source: news._source.source,
    }
  })

  return({
    success: true,
    data: data,
    total_returns: result["hits"]["total"]["value"],
  });
}


async function CheckIsLoggedIn(db, sessionId) {
  let values = sessionId;
  const result = await db.query("SELECT * FROM users WHERE ID = ? LIMIT 1", values);

  let rows = result[0]
  let count = 0
  rows.forEach(item => {
    count++;
  })

  if (count > 0) {
    for (const item in rows) {
      return JSON.stringify({
        success: true,
        username: rows[item].Username,
        admin: rows[item].Admin,
      })
    }
  }
  else {
    return JSON.stringify({
      success: error,
    })
  }

}


async function CheckLoginCreds(db, username, password) {

  try {

    let values = username;
    const result = await db.query("SELECT * FROM users WHERE Username = ?", values);

    let rows = result[0]

    let count = 0
    rows.forEach(item => {
      count++;
    })

    if (count > 0) {
      for (const item in rows) {
        if (rows[item].Username == username) {
          if (await bcrypt.compare(password, rows[item].Password)) {
            return JSON.stringify({
              success: true,
              msg: "Success",
              id: rows[item].ID,
            })
          }
          return JSON.stringify({
            success: false,
            msg: "Incorrect password",
          })
        }
      }

      return JSON.stringify({
        success: false,
        msg: "Incorrect credentials",
      })
    }
    else {
      return JSON.stringify({
        success: false,
        msg: "Incorrect credentials",
      })
    }
  }
  catch (e) {
    return JSON.stringify({
      success: false,
      msg: "Unknown error",
    })
  }
}

async function RegisterUser(db, username, password, email) {
  let values = username;
  const result = await db.query("SELECT * FROM users WHERE Username = ?", values);
  let rows = result[0]

  let count = 0
  rows.forEach(item => {
    count++;
  })

  if (count == 0) {
    let values = [username, password, email];
    let result = await db.query("INSERT INTO users (Username, Password,	Email ,Admin) VALUES (? , ? , ? , 32)", values);
    if (result == null) {
      return JSON.stringify({
        success: false,
        msg: "An error has occured",
      })
    }
  }
  else {
    return JSON.stringify({
      success: false,
      msg: "Username is already taken",
    })
  }
}

module.exports = Router;