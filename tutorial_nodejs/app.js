const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3");

const app = express(); // Armazena as chamadas e propriedades da biblioteca EXPRESS

const PORT = 8500;

app.use('/static', express.static(__dirname + '/static'));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    console.log("GET /");
    res.render("pages/index");
});

app.get("/sobre", (req, res) => {
    res.render("pages/sobre");
    console.log("GET /sobre")
});
app.get("/cadastro", (req, res) => {
    res.render("pages/cadastro");
    console.log("GET /cadastro")
});

app.get("/login", (req, res) => {
    res.render("pages/login");
    console.log("GET /login")
});
app.get("/dashboard", (req, res) => {
    res.render("pages/dashboard")
    console.log("GET /dashboard")
});
app.listen(PORT, () => {
    console.log(`Servidor sendo executado na porta ${PORT}`);
});
app.get("/static", (req, res) => {
    res.send(`Você está na página static!`);
    console.log("GET /static");
    console.log(__dirname + "\\static");
});
