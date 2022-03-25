const express = require("express");
const router = express.Router();
const db = require("./dbconnection");
const { signupValidation, loginValidation } = require("./validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");


// --- ACCOUNT --- //

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

router.get("/account/:Account_ID", (res,req) => {
    db.query(`select from account where Account_ID = ${req.body.id}`, (err,result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        return res.status(200).send({
            msg : `successfully retrieved account: ${req.body.id}`,
        });
    });
});

router.delete("/account/:Account_ID", (req,res) =>{

    db.query(`delete from account where = ${req.body.id}`, (err,result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
               msg : err, 
            });
        }
        return res.status(200).send({
            msg : `successfully deleted account : ${req.body.id}`,
        });
    });
}

);


// --- PROFILE ---//

router.post("/profiles", (req, res) => {
    const accountID = req.body.accountID;
    const stmt = "INSERT INTO Profile (Account_ID, Profile_Picture_URL, Degree, Biography, Resume, LinkedIn, GitHub) VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL)";
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
    const stmt = "SELECT FROM Profile WHERE Profile_ID = ?";
    db.query (stmt, id, (err, result) => {
        if (err) 
            console.log(err);
        else
            res.send(result);
    });
});

// was not sure how to implement when there are multiple columns for the primary key
router.put("/profile/update/:accountID/:profileID", (req, res) => {
    const id = req.params.profileID;
    const url = req.body.url;
    const degree = req.body.degree;
    const bio = req.body.bio;
    const resume = req.body.resume;
    const linkedin = req.body.linkedin;
    const git = req.body.github;
    const stmt = 
        "UPDATE Profile SET Profile_Picture_URL = ?, Degree = ?, Biography = ?, Resume = ?, LinkedIn = ?, GitHub = ? WHERE Profile_ID = ?";
    db.query(stmt, [url, degree, bio, resume, linkedin, git, id], (err, result) => {
        if (err) 
            console.log(err);
    });
});

router.delete("profile/delete/:profileID", (req, res) => {
    const id = req.params.profileID;
    const stmt = "DELETE FROM Profile WHERE Profile_ID = ?";
    db.query(stmt, id, (err, result) => {
        if (err) 
            console.log(err);
    });
}); 



// --- POST_PHOTOS --- //

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


// --- POST --- //

router.post("/post", (req,res)=>{
    db.query(`insert into post (Post_ID, Profile_ID, Account_ID, Title, Caption) VALUES (${res.body.post_id}, ${res.body.profile_id}, ${res.body.account_id},
         ${res.body.title}, ${res.body.caption})`, (err,result)=>{
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
