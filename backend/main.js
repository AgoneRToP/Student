const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const methodOverride = require("method-override");
const { readFileCustom, writeFileCustom } = require("./helpers/functions");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const data = readFileCustom();
  const { limit = 5, page = 1 } = req.query

  const totalCount = data.length
  const totalPages = Math.ceil(data.length / Number(limit))

  res.render("index", {
    totalCount,
    totalPages,
    limit: Number(limit),
    page: Number(page),
    data: data.slice((page - 1) * limit, page * limit),
  });
});

app.get("/students", (req, res) => {
  const data = readFileCustom();
  const { limit = 5, page = 1 } = req.query;

  const totalCount = data.length;
  const totalPages = Math.ceil(data.length / Number(limit));

  res.json({
    success: true,
    data,
    limit: Number(limit),
    page: Number(page),
    data: data.slice((page - 1) * limit, page * limit),
  });
});

app.get("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const data = readFileCustom();

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
      success: false,
      message: "Berilgan field'lar to'liq emas",
    });
    return;
  }

  const data = readFileCustom();

  const maxId = data.length > 0 ? Math.max(...data.map(s => s.id)) : 0;

  const newStudent = {
    id: maxId + 1,
    name,
    age,
    major,
    gpa,
  };

  data.push(newStudent);

  writeFileCustom(data);
  
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
      success: false,
      message: "Berilgan field'lar to'liq emas",
    });
    return;
  }

  const data = readFileCustom();
  const studentIndex = data.findIndex((el) => el.id == studentId);

  if (studentIndex === -1) {
    res.status(404).json({
      success: false,
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

  writeFileCustom(data);

  res.status(204).send();
});

app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const data = readFileCustom();

  const studentIndex = data.findIndex((el) => el.id == studentId);

  if (data.length === studentIndex.length) {
    res.status(404).send({
      success: false,
      message: `Berilgan ID: ${studentId} topilmadi`,
    });
    return;
  }

  data.splice(studentIndex, 1);

  writeFileCustom(data);

  res.redirect("/");

  res.status(204).send();
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
