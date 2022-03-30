const express = require("express");
const router = express.Router();
const db = require("./dbconnection");
const { signupValidation, loginValidation } = require("./validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");


// --- ACCOUNT --- //

// router.post("/account", signupValidation, (req,res,next) =>{
// console.log("inside post /account");
// db.query(
//     `SELECT * FROM account WHERE LOWER(email) = LOWER(${db.escape( req.body.email)});`,
//     (err,result ) => {
//         console.log("inside first db.query account");
//         if(result.length){
//             console.log("sadge");
//             return res.status(409).send({
//                 msg : "This user already exists!",
//             });
//         }else {
//             console.log("YES! SIGN IN IS GUD");
//             db.query(
//                `INSERT INTO account (Account_ID, Email, Password, First_Name, Last_Name)
//                VALUES (${db.escape(req.body.accountID)}, ${req.body.email}
//                , ${req.body.password}, ${req.body.firstName}, ${req.body.lastName})`, 
//                (err, result) => {
//                    console.log("inside second db.query account");
//                    if(err){
//                     console.log(err);
//                     return res.status(400).send({
//                         msg : err,
//                     });
//                    }

//                    return res.status(201).send({
//                     msg : `The email: ${req.body.email} is now registered!`,
//                    });
//                }

//             );
//         }
//     }
// );
// });

router.post("/account/:id/:email/:pass/:fName/:lName", (req,res)=> {
    db.query(`insert into account (Account_ID, Email, Password, First_Name, Last_Name) VALUES 
    (${req.params.id}, "${req.params.email}", "${req.params.pass}", "${req.params.fName}", "${req.params.lName}")`,
    (err,result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg: err,
            });
        }
        return res.status(200).send({
            msg : `account added : ${req.params.email}`,
        })
    });


});

router.get("/account", (req,res) => {
    db.query("select * from account", (err,result) => {
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }else {
        return res.send(result).status(200);
    }
    });
}
);

router.get("/account/:Account_ID", (req,res) => {
db.query(`SELECT * from account where Account_ID = ${req.params.Account_ID}`, (err,result) =>{
    if(err){
        console.log(err);
        return res.status(400).send({
            msg : err,
        })
    }else{
        return res.send(result);
    }
}
    
);
});

router.put("/account/:id/:email/:pass/:fName/:lName", (req,res)=> {
    db.query(`UPDATE account SET Email = '${req.params.email}', Password = '${req.params.pass}', First_Name = '${req.params.fName}', Last_Name = '${req.params.lName}' WHERE Account_ID = ${req.params.id}`,
    (err,result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg: err,
            });
        }
        return res.status(200).send({
            msg : `account updated : ${req.params.email}`,
        })
    });
});

router.delete("/account/:Account_ID", (req,res) =>{
  
    db.query(`DELETE from account where Account_ID = ${req.params.Account_ID}`, (err,result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
               msg : err, 
              
            });
        }else{
        return res.status(200).send({
            msg : `successfully deleted account : ${req.params.Account_ID}`,
        });
    }
    });
});


// --- PROFILE ---//

router.post("/profile/:accountID", (req, res) => {
    const accountID = req.params.accountID;
    const stmt = "INSERT INTO profile (Account_ID, Profile_Picture_URL, Degree, Biography, Resume, LinkedIn, GitHub) VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL)";
    db.query (stmt, accountID, (err, result) => {
        if (err) 
            console.log(err);
        else
            res.status(200).send({
                msg : `successfully added profile id: ${req.params.pID}`,
            })
    });
});



router.post("/profile/:pID/:aID/:picURL/:degree/:bio/:resume/:linkedIn/:github", (req, res) => {
   // const accountID = req.body.aID;
    // const stmt = `INSERT INTO profile (Profile_ID,Account_ID, Profile_Picture_URL, Degree, Biography, Resume, LinkedIn, GitHub) VALUES 
    // (${req.body.pID}, ${req.body.aID}, "${req.body.picURL}", "${req.body.degree}", "${req.body.bio}", "${req.body.resume}", "${req.body.linkedIn}",
    // "${req.body.github}")`;
    db.query ( `INSERT INTO profile (Profile_ID ,Account_ID, Profile_Picture_URL, Degree, Biography, Resume, LinkedIn, GitHub) VALUES 
    (${req.params.pID}, ${req.params.aID}, "${req.params.picURL}", "${req.params.degree}", "${req.params.bio}", "${req.params.resume}", "${req.params.linkedIn}",
    "${req.params.github}")`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                msg : err,
            })
        }
        return res.status(200).send({
            msg : `successfully added profile id: ${req.params.pID}`,
        })
        
    });
});

router.get("/profile", (req, res) => {
    db.query ("SELECT * FROM profile", (err, result) => {
        if (err) 
           return console.log(err);
        else
          return res.send(result).status(200);
    });
});

router.get("/profile/:profileID", (req, res) => {
    const id = req.params.profileID;
    const stmt = "SELECT * FROM profile WHERE Profile_ID = ?";
    db.query(stmt, req.params.profileID, (err, result) => {
      if (err) {
          console.log(err);
          return res.status(400).send({
              msg : err,
          })
        }
      else res.status(200).send(result);
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
        "UPDATE profile SET Profile_Picture_URL = ?, Degree = ?, Biography = ?, Resume = ?, LinkedIn = ?, GitHub = ? WHERE Profile_ID = ?";
    db.query(stmt, [url, degree, bio, resume, linkedin, git, id], (err, result) => {
        if (err) 
            console.log(err);
    

    const stmt = "UPDATE profile SET Profile_Picture_URL = ?, Degree = ?, Biography = ? WHERE Profile_ID = ?";
    db.query(stmt, [url, degree, bio, req.params.profileID], (err, result) => {
      if (err) console.log(err);
      
    });
});
});

router.delete("/profile/:profileID", (req, res) => {
    // const id = req.params.profileID;
   // const stmt = `DELETE FROM profile WHERE Profile_ID = ${req.params.profileID}`;
    db.query(`DELETE FROM profile WHERE Profile_ID = ${req.params.profileID}`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                msg: err,
            });
        }
        return res.status(200).send({
            msg : `successfully deleted profile id : ${req.params.profileID}`,
        })

    });
}); 



// --- POST_PHOTOS --- //

router.post("/post_photos/:post_id/:profileID/:accountID/:photo_url", (req,res)=>{
    db.query(`insert into post_photos (Post_ID, Profile_ID, Account_ID, Photo_URL) VALUES (
        ${req.params.post_id}, ${req.params.profileID}, ${req.params.accountID}, "${req.params.photo_url}"
    )`, (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        return res.status(200).send({
            msg : `succesfully added a new post photo url : ${req.params.photo_url}`,
        })
    });
});

router.post ("/post_photos/:Post_ID/:Profile_ID/:Account_ID", (req,res) => {
    const post_id = req.params.Post_ID;
    const profile_id = req.params.Profile_ID;
    const account_id = req.params.Account_ID;
    const photo_url = req.body.Photo_URL;
    const stmt = 
        "insert into post_photos (Post_ID, Profile_ID, Account_ID, Photo_URL) VALUES (?,?,?,?)";
    db.query(stmt, [post_id, profile_id, account_id, photo_url], (err, result) => { 

        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        return res.status(200).send({
            msg : `succesfully added a new post photo url : ${req.params.photo_url}`,
        })
    });
});

router.put("/post_photos/:Post_ID", (req, res) => {
    const id = req.params.Post_ID;
    const url = req.body.Photo_URL;
    const stmt = 
        "UPDATE post_photos SET Photo_URL = ? WHERE Post_ID = ?";
    db.query(stmt, [url, id], (err, result) => {
        if (err) 
            console.log(err);
        else res.status(200).send(result);
    
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
        return res.status(200).send(result);

    });

});

router.get("/post_photos/:url", (req,res)=>{
    db.query(`select * from post_photos where Photo_URL = "${req.params.url}"`,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }

        return res.status(200).send(result);
    });

});

router.delete("/post_photos/:url", (req,res)=>{
    db.query(`delete from post_photos where Photo_URL = "${req.params.url}"`, (err,result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        return res.status(200).send({
            msg : `successfully deleted post photo: ${req.params.url}`,
        });
    });

});


// --- POST --- //

router.post("/post/:post_id/:profile_id/:account_id/:title/:caption", (req,res)=>{
    db.query(`insert into post (Post_ID, Profile_ID, Account_ID, Title, Caption) VALUES (${req.params.post_id}, ${req.params.profile_id}, ${req.params.account_id},
         "${req.params.title}", "${req.params.caption}")`, (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            })
        }
        return res.status(200).send({
            msg : `successfully added post id : ${req.params.post_id}`,
        })

    });
});

router.post("/post/:profile_id/:account_id/:title/:caption", (req,res)=>{
    db.query(`insert into post (Profile_ID, Account_ID, Title, Caption) VALUES (${req.params.profile_id}, ${req.params.account_id},
         "${req.params.title}", "${req.params.caption}")`, (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            })
        }
        return res.status(200).send({
            msg : `successfully added post`,
        })

    });
});

router.put("/post/:Post_ID", (req, res) => {
    const id = req.params.Post_ID;
    const title = req.body.Title;
    const caption = req.body.Caption;
    const stmt = 
        "UPDATE post SET Title = ?, Caption = ? WHERE Post_ID = ?";
    db.query(stmt, [title, caption, id], (err, result) => {
        if (err) 
            console.log(err);
        else res.status(200).send(result);
    
    });
});

router.get ("/post/last_id", (req, res) =>{
    db.query("SELECT * FROM post Where Post_ID = (SELECT LAST_INSERT_ID())", (err, result) =>{
        if(err){
            console.log(err);
            return res.status(400).send({
                msg : err,
            });
        }
        console.log(result);
        return res.status(200).send(result);
    })
});

router.get("/post", (req, res) => {
db.query("select * from post", (err, result) =>{
    if(err){
        console.log(err);
       return res.status(400).send({
            msg : err,
        });
    }
    return res.status(200).send(JSON.parse(JSON.stringify(result)))

});

});

router.get("/post/:Post_ID", (req, res) => {
db.query(
  `select * from post WHERE Post_ID = ${req.params.Post_ID}`,
  (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        msg: err,
      });
    }
    //return res.status(200).send(JSON.parse(JSON.stringify(result)));
    return res.status(200).send(result);
  }
);
});

router.delete("/post/:Post_ID",(req,res)=>{
    db.query(
      `delete from post where Post_ID = ${req.params.Post_ID}`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send({
            msg: err,
          });
        }

        return res.status(200).send({
          msg: `successfully deleted post: ${req.params.Post_ID}`,
        });
      }
    );
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
