const express = require('express')

const router = express.Router();

const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const secretKey = config.get('jwtSecret')
const { check, validationResult } = require("express-validator");


// route post api/auth
//Login 
router.post(
    "/",
    [
      check("email", "Please enter a valid E-mail").isEmail(),
      check(
        "password",
        "Please enter a password"
      ).exists(),
    ],
    async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      let { email, password } = req.body;
      try {
        let user =await User.findOne({email});
        if(!user){
          return res.status(400).json({ error:[{ msg:'Invalid credentials'  }] })
        }
         
         const isMatch = await bcrypt.compare(password,user.password)
         
          if(!isMatch){
            return res.status(400).json({ error:[{ msg:'Invalid credentials'  }] })
          }
          else{
            const payload = {
                user : {
                    id : user.id
                }
              }
              jwt.sign(payload,secretKey,{
                  expiresIn:144000
              },(err,token)=>{
                  if(err) throw err;
                  res.json({token})
              })
          }

         
  
      } catch (error) {
          console.log(error.message)
          return res.status(500).send('Server Error')
      }
  
     
    }
  );
  

module.exports = router;