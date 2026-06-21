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
        host: "mysql-krs",
        user: "root",
        password: "root",
        database: "krs_db"
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
        "SELECT * FROM krs",
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

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.post("/",(req,res)=>{

    const {student_id,course_id} = req.body;

    db.query(
        "INSERT INTO krs(student_id,course_id) VALUES(?,?)",
        [student_id,course_id],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"KRS berhasil ditambahkan"
            });
        }
    );
});

module.exports = app;