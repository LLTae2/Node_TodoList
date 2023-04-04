const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "todo_db",
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.get("/todos", (req, res) => {
  connection.query("SELECT * FROM todos", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    } else {
      res.json(results);
    }
  });
});

app.post("/todos", (req, res) => {
  const { title, description } = req.body;

  connection.query(
    "INSERT INTO todos (title, description) VALUES (?, ?)",
    [title, description],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      } else {
        res.json({ id: result.insertId, title, description });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
