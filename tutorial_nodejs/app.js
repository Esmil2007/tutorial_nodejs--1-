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

app.use(
    session({
        secret: "senhaforte",
        resave: true,
        saveUninitialized: true,
    })
);

app.use('/static', express.static(__dirname + '/static'));

// configuração express para processar POST com BODY PARAMETERS 
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    console.log("GET /");
    res.render("pages/index", { titulo: "index" });
});

app.get("/sobre", (req, res) => {
    res.render("pages/sobre", { titulo: "index" });
    console.log("GET /sobre")
});
app.get("/cadastro", (req, res) => {
    res.render("pages/cadastro", { titulo: "index" });
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
    res.render("pages/login", { titulo: "index" });
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
            // 2. se existir o usuario existir e a senha for válida BD, executar processo de login
            req.session.username = username;
            req.session.loggedin = true;
            res.redirect("/dashboard");
        } else {
            // 3. se não, executar processo de negação de login
            res.send("usuário invalido")
        }


    })




    console.log("POST /login")
    console.log(JSON.stringify(req.body));
});


app.get("/dashboard", (req, res) => {

    if (req.session.loggedin) {

        console.log("GET /dashboard")
        //Listar todos usuarios 
        const query = "SELECT * FROM users"
        db.all(query, [], (err, row) => {
    
            if (err) throw err
            res.render("pages/dashboard", { titulo: "index", dados: row });
    
        })
    }
    else{
        res.send("Usuario não logado")
    }
 


});
app.get("/logout", (req, res) => {
    console.log("GET/logout");
    req.session.destroy(()=>{
        res.redirect("/login")
    })
});

app.listen(PORT, () => {
    console.log(`Servidor sendo executado na porta ${PORT}`);
});


app.get("/static", (req, res) => {
    res.send(`Você está na página static!`);
    console.log("GET /static");
    console.log(__dirname + "\\static");
});
