const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const DB_FILE = path.join(__dirname, "db", "student.json");

app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));

  res.render("index", { data });
});

app.get("/students", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));

  res.json({
    success: true,
    data,
  });
});

app.get("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const data = JSON.parse(fs.readFileSync(DB_FILE));

  const student = data.find((el) => el.id == studentId);

  if (!student) {
    res.status(404).send({
      message: `Berilgan ID: ${studentId} topilmadi`,
    });
    return;
  }

  res.json({
    success: true,
    data: student,
  });
});

app.post("/students", (req, res) => {
  const { userId, name, age, major, gpa } = req.body;

  if (!name || !age || !major || !gpa) {
    res.status(400).json({
      message: "Berilgan field'lar to'liq emas",
    });
    return;
  }

  const data = JSON.parse(fs.readFileSync(DB_FILE));

  const maxId = data.length > 0 ? Math.max(...data.map(s => s.id)) : 0;

  const newStudent = {
    id: maxId + 1,
    name,
    age,
    major,
    gpa,
  };

  data.push(newStudent);

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  res.redirect("/"); 

  res.status(201).json({
    success: true,
    data: newStudent,
  });
});

app.put("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const { userId, name, age, major, gpa } = req.body;

  if (!name || !age || !major || !gpa) {
    res.status(400).json({
      message: "Berilgan field'lar to'liq emas",
    });
    return;
  }

  const data = JSON.parse(fs.readFileSync(DB_FILE));
  const studentIndex = data.findIndex((el) => el.id == studentId);

  if (studentIndex === -1) {
    res.status(404).json({
      message: `Berilgan ID: ${studentId} topilmadi`,
    });
    return;
  }

  const updateStudent = {
    id: Number(studentId),
    userId,
    name,
    age,
    major,
    gpa,
  };

  data.splice(studentIndex, 1, updateStudent);

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  res.status(204).send();
});

app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const data = JSON.parse(fs.readFileSync(DB_FILE));

  const studentIndex = data.findIndex((el) => el.id == studentId);

  if (data.length === studentIndex.length) {
    res.status(404).send({
      message: `Berilgan ID: ${studentId} topilmadi`,
    });
    return;
  }

  data.splice(studentIndex, 1);

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  res.redirect("/");

  res.status(204).send();
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
