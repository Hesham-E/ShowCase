const express = require("express");
const router = express.Router();
//const db = require("./dbConnection");
//const { signupValidation, loginValidation } = require("./validation");
//const { validationResult } = require("express-validator");
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");


// `Account_ID` int NOT NULL,
// `Email` varchar(25) NOT NULL,
// `Password` varchar(25) NOT NULL,
// `First_Name` varchar(25) NOT NULL,
// `Last_Name` varchar(25) NOT NULL


/*router.post("/account", signupValidation, (req,res,next) =>{




});*/


// --- ACCOUNT ---//

router.post("/account", (req, res) => {
    const accountID = req.body.accountID;
    const stmt = "INSERT INTO Account (Account_ID, Email, Password, First_Name, Last_Name) VALUES (?, NULL, NULL, NULL, NULL)";
    db.query (stmt, accountID, (err, result) => {
        if (err) 
            console.log(err);
    });
});

router.get("/account", (req, res) => {
    db.query ("SELECT * FROM Account", (err, result) => {
        if (err) 
            console.log(err);
        else
            res.send(result);
    });
});

router.get("/account/:accountID", (req, res) => {
    const id = req.params.accountID;
    const stmt = "SELECT FROM Profile WHERE Account_ID = ?";
    db.query (stmt, id, (err, result) => {
        if (err) 
            console.log(err);
        else
            res.send(result);
    });
});

router.delete("account/delete/:accountID", (req, res) => {
    const id = req.params.accountID;
    const stmt = "DELETE FROM Account WHERE Account_ID = ?";
    db.query(stmt, id, (err, result) => {
        if (err) 
            console.log(err);
    });
});