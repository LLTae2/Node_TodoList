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

app.get("/getTodos", (req, res) => {
  connection.query("SELECT * FROM todos", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    } else {
      res.json(results);
    }
  });
});

app.delete("/deleteTodos/:id", (req, res) => {
  const id = req.params.id;

  connection.query("DELETE FROM todos WHERE id = ?", [id], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    } else if (result.affectedRows === 0) {
      res.status(404).send("삭제할 투두가 없음");
    } else {
      res.json({ id });
    }
  });
});

app.post("/addTodos", (req, res) => {
  const { id, title, description, complete } = req.body;

  connection.query(
    "INSERT INTO todos (id, title, description, complete) VALUES (?, ?, ?, ?)",
    [id, title, description, complete],
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

app.put("/modifyTodos", (req, res) => {
  const { title, description, complete, id } = req.body;
  connection.query(
    "UPDATE todos SET title = ?, description = ?, complete = ?  WHERE id = ?",
    [title, description, complete, id],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal server error");
      } else {
        res.json({
          id: result.id,
          title: result.title,
          description: result.description,
          complete: result.complete,
        });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
