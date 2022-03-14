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


router.post("/account", signupValidation, (req,res,next) =>{




});