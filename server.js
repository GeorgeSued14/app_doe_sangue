const express = require("express")
const server = express()

// configure o server for open file statics
server.use(express.static('public'))

//allow body of form
server.use(express.urlencoded({ extended:true }))

//conect database
const Pool = require('pg').Pool
const db = new Pool({
    user: 'george',
    password: 'senha',
    host: 'localhost',
    port: 5432,
    database: 'donors'
})

//configure the template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
    
})

//configure apresentation of page
server.get("/", (req, res) => {
    sql = "SELECT * FROM donor"  
    db.query(sql, function(err, result) {
        if (err) return res.send("Erro de banco de dados")
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

//get data of form
server.post("/", (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    try {
        if (name == "" || email =="" || blood == "") {
            return res.send("Preencha os campos obrigatórios");
        } else {
            const sql = `
                INSERT INTO donor ("name", "email", "blood") 
                VALUES($1,$2,$3)`

            const values = [name, email, blood]
        
            db.query(sql, values)
        }
        return res.redirect("/") 
    
    } catch (error) {
        return res.send("Ocorreu algum erro, verifique os campos")

    }
})

// allow access port
server.listen(3000, () => {
    console.log("Iniciei o servidor.")
})
