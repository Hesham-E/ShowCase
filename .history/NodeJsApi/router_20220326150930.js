const express = require("express");
const router = express.Router();
const db = require("./dbconnection");
const { signupValidation, loginValidation } = require("./validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");


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

router.get("/account", (req,res) => {
    db.query("select * from account", (err,result) => {
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        return res.status(200).send({
           msg : "successfully retrieved all accounts", 
        });
    });
}
);

router.get("/account/:Account_ID", (req, res) => {
    db.query(
      `select * from account where Account_ID = ${req.params.Account_ID}`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send({
            msg: err,
          });
        }
        return res.status(200).send(JSON.parse(JSON.stringify(result)));
      }
    );
});

router.delete("/account/:Account_ID", (req,res) =>{

    db.query(
      `delete from account where Account_ID = ${req.params.Account_ID}`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send({
            msg: err,
          });
        }
        return res.status(200).send({
          msg: `Successfully deleted account with ID: ${req.params.Account_ID}`,
        });
      }
    );
}

);


// --- PROFILE ---//
router.post("/profiles", (req, res) => {
    const accountID = req.body.accountID;
    const stmt = "INSERT INTO Profile (Account_ID, Profile_Picture_URL, Degree, Biography) VALUES (?, NULL, NULL, NULL)";
    db.query (stmt, accountID, (err, result) => {
        if (err) 
            console.log(err);
    });
});

router.get("/profiles", (req, res) => {
    db.query ("SELECT * FROM Profile", (err, result) => {
        if (err) 
            console.log(err);
        else
            res.send(result);
    });
});

router.get("/profile/:profileID", (req, res) => {
    const id = req.params.profileID;
    const stmt = "SELECT * FROM Profile WHERE Profile_ID = ?";
    db.query(stmt, req.params.profileID, (err, result) => {
      if (err) console.log(err);
      else res.send(result);
    });
});

router.put("/profile/update/:profileID", (req, res) => {
    const id = req.params.profileID;
    const url = req.body.url;
    const degree = req.body.degree;
    const bio = req.body.bio;
    const stmt = "UPDATE Profile SET Profile_Picture_URL = ?, Degree = ?, Biography = ? WHERE Profile_ID = ?";
    db.query(stmt, [url, degree, bio, req.params.profileID], (err, result) => {
      if (err) console.log(err);
    });
});

router.delete("profile/delete/:profileID", (req, res) => {
    const id = req.params.profileID;
    const stmt = "DELETE FROM Profile WHERE Profile_ID = ?";
    db.query(stmt, req.params.profileID, (err, result) => {
        if (err) 
            console.log(err);
    });
});



// --- LINKS --- //

router.post("/links", (req, res) => {
    const accountID = req.body.accountID;
    const profileID = req.body.profileID;
    const link = req.body.link;
    const stmt = "INSERT INTO Links (Profile_ID, Account_ID, Link) VALUES (?, ?, ?)";
    db.query (stmt, [profileID, accountID, link], (err, result) => {
        if (err) 
            console.log(err);
    });
});

router.get("/links", (req, res) => {
    db.query ("SELECT * FROM Links", (err, result) => {
        if (err) 
            console.log(err);
        else
            res.send(JSON.parse(JSON.stringify(result)));
    });
});

router.get("/links/:accountID/:profileID", (req, res) => {
    const accountID = req.params.accountID;
    const profileID = req.params.profileID;
    const stmt = "SELECT FROM Links WHERE Profile_ID = ? AND Account_ID = ?";
    db.query (stmt, [profileID, accountID], (err, result) => {
        if (err) 
            console.log(err);
        else
            res.send(result);
    });
});

router.put("/link/update/:accountID/:profileID", (req, res) => {
    const accountID = req.params.accountID;
    const profileID = req.params.profileID;
    const newLink = req.params.body;
    const stmt = "UPDATE Links SET Link = ? WHERE Account_ID = ? AND Profile_ID = ?";
    db.query(stmt, [newLink, accountID, profileID], (err, result) => {
        if (err) 
            console.log(err);
    });
});

router.delete("profile/delete/:accountID/:profileID", (req, res) => {
    const accountID = req.params.accountID;
    const profileID = req.params.profileID;
    const stmt = "DELETE FROM Links WHERE Account_ID = ? AND Profile_ID = ?";
    db.query(stmt, [accountID, profileID], (err, result) => {
        if (err) 
            console.log(err);
    });
});

// `Account_ID` int NOT NULL,
// `Email` varchar(25) NOT NULL,
// `Password` varchar(25) NOT NULL,
// `First_Name` varchar(25) NOT NULL,
// `Last_Name` varchar(25) NOT NULL
/*
CREATE TABLE `post` (
  `Post_ID` int NOT NULL,
  `Profile_ID` int NOT NULL,
  `Account_ID` int NOT NULL,
  `Caption` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_photos`
--

CREATE TABLE `post_photos` (
  `Post_ID` int NOT NULL,
  `Profile_ID` int NOT NULL,
  `Account_ID` int NOT NULL,
  `Photo_URL` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/
router.post("/post_photos", (req,res)=>{
db.query(`insert into post_photos (Post_ID, Profile_ID, Account_ID, Photo_URL) VALUES (
    ${req.body.post_id}, ${req.body.profileID}, ${req.body.accountID}, ${req.body.photo_url}
)`, (err,result)=>{
    if(err){
        console.log(err);
        return res.status(400).send({
            msg : err,
        });
    }
    return res.status(200).send({
        msg : "succesfully added a new post photo",
    })
});
});

router.get("/post_photos", (req,res) =>{
    db.query("select * from post_photos", (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        return res.status(200).send({
            msg : "successfully retrieved all post photos",
        });

    });

});

router.get("post_photos/:Post_ID", (req,res)=>{
    db.query(`select from post_photos where Post_ID = ${req.body.id}`,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }

        return res.status(200).send({
            msg : `successfully retrieved post photo: ${req.body.id}`,
        })
    });

});

router.delete("post_photos/:Post_ID", (req,res)=>{
    db.query(`delete from post_photos where Post_ID = ${req.body.id}`, (err,result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        return res.status(200).send({
            msg : `successfully deleted post photo: ${req.body.id}`,
        });
    });

});



router.post("/post", (req,res)=>{
    db.query(`insert into post (Post_ID, Profile_ID, Account_ID, Caption) VALUES (${res.body.post_id}, ${res.body.profile_id}, ${res.body.account_id},
         ${res.body.caption})`, (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            })
        }
        return res.status(200).send({
            msg : "successfully added post",
        })

    });
});

router.get("/post", (req, res) => {
db.query("select * from post", (err, result) =>{
    if(err){
        console.log(err);
       return res.status(400).send({
            msg : err,
        });
    }
    return res.status(200).send({
        msg : "successfully retrieved all posts",
    })

});

});

router.get("post/:Post_ID", (req, res) => {
db.query(`select from post where Post_ID = ${req.body.id}`, (err,result) =>{
    if(err){
        console.log(err);
        return res.status(400).send({
            msg : err,
        });
    }
    return res.status(200).send({
        msg : `successfully retrieved post: ${req.body.id}`
    });
});
});

router.delete("post/:Post_ID",(req,res)=>{
    db.query(`delete from post where Post_ID = ${req.body.id}`, (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            })
        }

        return res.status(200).send({
            msg : `successfully deleted post: ${req.body.id}`,
        })
    });
});

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
