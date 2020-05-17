const express = require('express')

const router = express.Router();

// route GET api/auth
router.get('/',(req,res)=>{
    res.send('Auth Router')
})

module.exports = router;