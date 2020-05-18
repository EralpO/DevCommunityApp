const express = require("express");

const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const secretKey = config.get('jwtSecret')

const User = require("../../models/User");

// route POST api/register
// Register user
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid E-mail").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user =await User.findOne({email});
      if(user){
        return res.status(400).json({ error:[{ msg:'User already exist'  }] })
      }
       
      const avatar = gravatar.url(email,{
          s:'200',
          r:'pg',
          d:'mm'
      })
       user = new User({
           name,
           email,
           password,
           avatar
       })
       const salt = await bcrypt.genSalt(8);
       user.password = await bcrypt.hash(password,salt)
       await user.save();
        
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

    } catch (error) {
        console.log(error.message)
        return res.status(500).send('Server Error')
    }

   
  }
);

module.exports = router;
