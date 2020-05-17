const express = require('express')

const router = express.Router();

// route GET api/user
router.get('/',(req,res)=>{
    res.send('User Router')
})

module.exports = router;