const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let db;

if (process.env.NODE_ENV !== "test") {
    db = mysql.createConnection({
        host: "mysql-user",
        user: "root",
        password: "root",
        database: "user_db"
    });
}

app.get("/", (req,res)=>{

    db.query(
        "SELECT * FROM users",
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

app.get("/health", (req,res)=>{
    res.status(200).json({
        status:"ok"
    });
});

app.post("/", (req,res)=>{

    const {nama,email,password,role} = req.body;

    db.query(
        "INSERT INTO users(nama,email,password,role) VALUES(?,?,?,?)",
        [nama,email,password,role],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"User berhasil ditambahkan"
            });
        }
    );

});

module.exports = app;