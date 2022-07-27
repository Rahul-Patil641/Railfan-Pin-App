const router = require('express').Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
//register user

router.post("/register", async (req, res) => {
    try {
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
  
      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user._id);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

//login user
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(400).json("Invalid username or password");
        return;
        //validate password
        const validPAssword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !validPAssword && res.status(400).json("Invalid username or password");
        return;
        res.status(200).json({_id: user._id, username:  user.username});
    }catch(err){
        res.status(500).json(err);
        return;
    }
})
module.exports = router;