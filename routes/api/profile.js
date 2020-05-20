const express = require("express");

const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// route GET api/profile/me
//Get the current user
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("User", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ errors: error.array() });
    }
    const {
      status,
      company,
      website,
      location,
      bio,
      githubUsername,
      skills,
      instagram,
      linkedin,
      github,
    } = req.body;
    let profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubUsername) profileFields.githubUsername = githubUsername;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

    profileFields.social = {};

    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (github) profileFields.social.github = github;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //Update Profile
      if (profile) {
        profile = await Profile.updateOne(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile)
      }
     //Create Profile
     profile = new Profile(profileFields);

     
     await profile.save();
     
      res.json(profile)

    } catch (error) {
        return res.status(500).send('Server Error')
    }
  }
);

// route GET api/profile/all
//Get the all profiles
router.get("/all", async (req, res) => {
    try {
      const profile = await Profile.find({}).populate("User", ["name", "avatar"]);
      if (!profile) {
        return res.status(400).json({ msg: "There is no profile" });
      }
      res.json(profile);
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  });


// route GET api/profile/getuser/id(etc 1,2)
//Get the user profile by id 
  router.get("/getuser/:user_id", async (req, res) => {
    try {
      const profile = await Profile.find({user:req.params.user_id}).populate("User", ["name", "avatar"]);


      if (!profile) {
        return res.status(400).json({ msg: "There is no profile" });
      }
      res.json(profile);
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  });


  // route Delete api/profile
//Delete the User,Profile 
  router.delete("/",auth, async (req, res) => {
    try {
        //Delete Profile
      await Profile.findOneAndDelete({user:req.user.id})
  
      //Delete User
      await User.findOneAndDelete({_id:req.user.id})

      if (!profile) {
        return res.status(400).json({ msg: "There is no profile" });
      }
      res.json('User Deleted');
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  });

// route PUT api/profile/experience
//Add an experience to your profile
  router.put("/experience",[auth,[
    check("title","Title is required").not().isEmpty(),
    check("company","Company is required").not().isEmpty(),
    check("location","location is required").not().isEmpty(),
    check("from","Starting date is required").not().isEmpty(),
    check("description","Description is required").not().isEmpty()

  ]],async (req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
      return res.status(400).json({msg:error.array()})
    }
    try {
      const {
        title,
        company,
        location,
        from,
        to,
        description,
        currentlyWorking
      } = req.body
      let experience = {}
      if(to) experience.to = to
      if(currentlyWorking) experience.currentlyWorking = currentlyWorking
      experience.title = title
      experience.from = from
      experience.location = location
      experience.description = description
      experience.company = company

      let profile = await Profile.findOne({ user : req.user.id})
      //Unshift method put the given object to head of the array
      profile.Experience.unshift(experience)

     await profile.save()

     res.json(profile).status(200)
      
    } catch (error) {
     return res.json({msg:error}).status(500)
    }

  });

  // route Delete api/profile/experience
//Delete an experience from your profile

router.delete('/experience/:exp_id',auth,async (req,res)=>{

  try {
    let profile = await Profile.findOne({user:req.user.id})
    let exp = await profile.Experience.map(item =>item.id).indexOf(req.params.exp_id)

    profile.Experience.splice(exp,1)

    await profile.save()

    res.json(profile)   
  } catch (error) {
    return res.json({msg:error}).status(500)
  }
 
})


module.exports = router;
