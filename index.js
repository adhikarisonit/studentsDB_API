const express = require("express");
const cors = require("cors");
const knex = require("knex");
const { v4: uuidv4 } = require("uuid");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      // host: "127.0.0.1",
      // user: "postgres",
      // password: "database",
      // database: "studentDB",
    },
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.status(200).json("Ready to serve");
});

app.post("/register", async (req, res) => {
  try {
    const { name, rollno, dept, code } = req.body;
    await db("user_table").insert({
      uuid: uuidv4(),
      name,
      rollno,
      dept,
      code,
    });
    res.status(200).json("success");
  } catch (e) {
    res.status(400).json("failed");
  }
});

app.get("/profile", async (req, res) => {
  const { code } = req.body;
  try {
    await db("user_table")
      .select("*")
      .where("code", code)
      .then((user) => res.json(user));
  } catch (e) {
    res.status(400).json("failed");
  }
});

app.listen(process.env.PORT || 3000);
