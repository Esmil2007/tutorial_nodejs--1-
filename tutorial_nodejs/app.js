const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3");

const app = express(); // Armazena as chamadas e propriedades da biblioteca EXPRESS

const PORT = 8500;

//conexão com baco de dados 
const db = new sqlite3.Database("users.db");

db.serialize(() => {
    db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
    )

});



app.use('/static', express.static(__dirname + '/static'));

// configuração express para processar POST com BODY PARAMETERS 
app.use(express.urlencoded({ extended: true }));
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
app.post("/cadastro", (req, res) => {
    //res.render("pages/dashboard");
    const { username, password } = req.body;
    // 1. Verficar se o usuario existe
    const query1 = "SELECT * FROM users WHERE username=?"
    const query2 = "INSERT INTO users (username, password) values (?, ?)"
    db.get(query1, [username], (err, row) => {

        if (err) throw err;

        if (row) {
            res.send("usuario ja existe");
        }
        else {
            db.get(query2, [username, password], (err, row) => {
                if (err) throw err;

                console.log(JSON.stringify(row))
                res.redirect("/login");
            })
        }
    })

})
app.get("/login", (req, res) => {
    res.render("pages/login");
    console.log("GET /login")
});
app.post("/login", (req, res) => {
    //res.render("pages/dashboard");
    const { username, password } = req.body;
    // 1. Verficar se o usuario existe
    const query = "SELECT * FROM users WHERE username=? AND password=?"
    db.get(query, [username, password], (err, row) => {
        if (err) throw err;

        console.log(JSON.stringify(row))
        if (row) {
            res.redirect("/dashboard");
        } else {
            res.send("usuário invalido")
        }


    })
    // 2. se existir o usuario existir e a senha for válida BD, executar processo de login

    // 3. se não, executar processo de negação de login

    console.log("POST /login")
    console.log(JSON.stringify(req.body));
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
