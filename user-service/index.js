const client = require("prom-client");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

let db;

if (process.env.NODE_ENV !== "test") {
    db = mysql.createConnection({
        host: "mysql-user",
        user: "root",
        password: "root",
        database: "user_db"
    });

    db.connect((err) => {
        if (err) {
            console.log("Gagal konek database:", err.message);
        } else {
            console.log("Berhasil konek ke MySQL");
        }
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

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
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