const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const path = require("path");

let postHit = 0;
let getHit = 0;

app.use("/static", express.static(__dirname + "/"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".//home.html"));
});

app.get("/logIn", (req, res) => {
  res.sendFile(path.join(__dirname, ".//login.html"));
});

app.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, ".//signup.html"));
});

app.get("/clientSwaggers", (req, res) => {
  res.sendFile(path.join(__dirname, ".//clientSwaggers.json"));
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "connected");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "4537db",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql: connected");
});

db.promise = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(new Error());
      } else {
        resolve(result);
      }
    });
  });
};

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type ,Authorization, Content-Length, X-Requset-With",

    true
  );
  next();
});

app.use(express.json());

app.post("/users", (req, res) => {
  let body = "";
  let question = "";
  req.on("data", function (chunk) {
    if (chunk != null) {
      body += chunk;
    }
  });

  req.on("end", async function () {
    let Q = JSON.parse(body);
    console.log(Q);
    const hashedPassword = await bcrypt.hash(Q.password, 10);
    console.log(hashedPassword);
    console.log(Q.userId);
    let signUpQuery = `Insert ignore into users(userId, password) values("${Q.userId}","${hashedPassword}")`;
    let signupCheck = `SELECT count(*) from users where userId ='${Q.userId}'`;

    db.promise(signupCheck, (err, result) => {
      if (err) {
        throw err;
      }
    })
      .then((result) => {
        let dupCheck = result;
        console.log(dupCheck);

        try {
          if (dupCheck[0]["count(*)"] == 1) {
            res.send("Please insert different user input");
          } else {
            db.query(signUpQuery, (err, result) => {
              if (err) {
                throw err;
              }
            });
            res.send("singup success");
          }
        } catch {
          res.end(500).send();
        }
      })
      .catch((err) => console.log(err));
  });
  postHit++;
});

app.post("/users/login", async (req, res) => {
  let body = "";

  req.on("data", function (chunk) {
    if (chunk != null) {
      body += chunk;
    }
  });

  req.on("end", function () {
    let Q = JSON.parse(body);
    console.log(Q.userId);
    // const hashedPassword = bcrypt.hash(Q.password, 10);
    // console.log(hashedPassword);
    // let query = `Insert ignore into users(userId, password) values("ss","${hashedPassword}")`;

    let query = `SELECT userId, password from users where userId = '${Q.userId}'`;
    // let query = `SELECT userId from users where userId = '2'`;

    db.promise(query)
      // (err, result)
      .then((result) => {
        // let Q = JSON.parse(body);
        console.log(result.length);
        // console.log(result[0].userId.length);

        if (result.length == 0) {
          console.log("line115");
          res.status(400).send("cannot find user");
        } else {
          try {
            if (bcrypt.compare(result[0].password, Q.password)) {
              console.log("success");
              res.send("success");
            } else {
              res.send("not allowed");
            }
          } catch {
            res.end(500).send();
          }
        }
      })

      .catch((err) => {
        console.log(err);
      });
  });
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/postHitRate", (req, res) => {
  console.log(postHit);
  res.send(`${postHit}`);
});

app.get("/medicalStaff", (req, res) => {
  connection.query(
    "SELECT * FROM patient where patientsid=1",
    (err, result) => {
      if (err) throw err;
      console.log(result);
    }
  );
});

app.post("/medicalStaff", (req, res) => {
  connection.query(
    'INSERT INTO medicalstaff(name,position) values("Yong","Attending Physician")',
    (err, result) => {
      if (err) {
        throw error;
      }
      console.timeLog(result);
    }
  );
});

app.put("/medicalStaff", (req, res) => {
  connection.query(
    `update patient set name = "Sara Melody" where patientsid =1`,
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result);
    }
  );
});

app.delete("/medicalStaff", (req, res) => {
  connection.query(
    `update patient set name = "Sara Melody" where patientsid =1`,
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result);
    }
  );
});

app.get("/swaggers", (req, res) => {
  const fs = require("fs");
  let rawdata = fs.readFileSync("clientSwaggers.json");
  let student = JSON.parse(rawdata);
  console.log(student);

  res.send(student);
});
