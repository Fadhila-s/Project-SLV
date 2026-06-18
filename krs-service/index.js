const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
    db = mysql.createConnection({
        host: "mysql-krs",
        user: "root",
        password: "root",
        database: "krs_db"
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