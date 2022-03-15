const express = require("express");
const router = express.Router();
const db = require("./dbConnection");
const { signupValidation, loginValidation } = require("./validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// `Account_ID` int NOT NULL,
// `Email` varchar(25) NOT NULL,
// `Password` varchar(25) NOT NULL,
// `First_Name` varchar(25) NOT NULL,
// `Last_Name` varchar(25) NOT NULL


router.post("/account", signupValidation, (req,res,next) =>{
console.log("inside post /account");
db.query(
    `SELECT * FROM account WHERE LOWER(email) = LOWER(${db.escape( req.body.email)});`,
    (err,result ) => {
        console.log("inside first db.query account");
        if(result.length){
            console.log("sadge");
            return res.status(409).send({
                msg : "This user already exists!",
            });
        }else {
            console.log("YES! SIGN IN IS GUD");
            db.query(
               `INSERT INTO account (Account_ID, Email, Password, First_Name, Last_Name)
               VALUES (${db.escape(req.body.accountID)}, ${req.body.email}
               , ${req.body.password}, ${req.body.firstName}, ${req.body.lastName})`, 
               (err, result) => {
                   console.log("inside second db.query account");
                   if(err){
                    console.log(err);
                    return res.status(400).send({
                        msg : err,
                    });
                   }

                   return res.status(201).send({
                    msg : `The email: ${req.body.email} is now registered!`,
                   });
               }

            );
        }
    }
);

});


// `Account_ID` int NOT NULL,
// `Email` varchar(25) NOT NULL,
// `Password` varchar(25) NOT NULL,
// `First_Name` varchar(25) NOT NULL,
// `Last_Name` varchar(25) NOT NULL




function verifyToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else{
        return res.sendStatus(403);
    }

}
module.exports = router;