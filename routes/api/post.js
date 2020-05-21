const express = require("express");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const config = require("config");
const Post = require("../../models/Post");

const router = express.Router();

// route Post api/post/add
//Add post
router.post(
  "/add",
  [auth, [check("description", "Description is required").not().isEmpty()]],
 async (req, res) => {
     const error = validationResult(req)
     if(!error.isEmpty()) res.json({msg:error.array()})

     try {
     let user = await User.findOne({_id:req.user.id}).select('-password')

     let post = new Post({
       description:req.body.description,
       name:user.name,
       avatar:user.avatar,
       user:req.user.id
     })

     let newPost =await post.save();
     res.status(201).json(newPost)

      
     } catch (error) {
         res.status(500).json({msg:error})
     }
    
  }
);

// Get request api/post/me
// Get all the posts
router.get('/me',auth,async (req,res)=>{
    try {
      let posts = await Post.find({user:req.user.id})
     res.json(posts)
    } catch (error) {
      res.status(500).json({msg:error})
    }
})

//Get request api/post/:id
//Get a specific post wit post id
router.get('/:post_id',auth,async (req,res)=>{
  try {
    let post = await Post.findById(req.params.post_id) 
    if(!post){
      return res.status(404).json({msg:'There is no post with this id'})
    }
    res.status(200).json(post)
  } catch (error) {
    if(error.kind === 'ObjectId')  return res.status(404).json({msg:'There is no post with this id'})
      res.status(500).json({msg:'Server Error'})
  }
   

})

//Delete api/post/remove/:id
//Delete a post from posts
router.delete('/remove/:post_id',auth,async (req,res)=>{
  try {
    let post = await Post.findById(req.params.post_id)  
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({msg:'User not authorized'})
    }
    if(!post)  return res.status(404).json({msg:'There is no post with this id'})
    
     await post.remove()

     res.status(200).json({msg:'Post removed'})

  } catch (error) {
    if(error.kind === 'ObjectId') return res.status(404).json({msg:'There is no post with this id'})
    res.status(500).json({msg:'Server Error'})
  }
  
})


//Put request api/post/like/id
//We will add a like with this request
router.put('/like/:post_id',auth,async (req,res)=>{
try {  
  let post = await Post.findById(req.params.post_id)
  if(!post){
    return res.status(404).json({msg:'There is no post with this id'})
  }
  if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ){
    return res.json({msg:'Alredy have been liked'})
  }
  post.likes.unshift({user:req.user.id})

  await post.save()

 res.status(200).json(post.likes)

} catch (error) {
  if(error.kind === 'ObjectId') return res.status(404).json({msg:'There is no post with this id'})
  res.status(500).json({msg:error})
}
})

//Put request api/post/unlike/id
//We will remove a like with this request
router.put('/unlike/:post_id',auth,async (req,res)=>{
  try {  
    let post = await Post.findById(req.params.post_id)
    if(!post){
      return res.status(404).json({msg:'There is no post with this id'})
    }
    if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0 ){
      return res.json({msg:'Post has not been liked'})
    }
   const index = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
  
   post.likes.splice(index,1)

    await post.save()
  
   res.status(200).json(post.likes)
  
  } catch (error) {
    if(error.kind === 'ObjectId') return res.status(404).json({msg:'There is no post with this id'})
    res.status(500).json({msg:error})
  }
  })
  
// route Post api/post/comment
//Add comment 
router.put(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
 async (req, res) => {
     const error = validationResult(req)
     if(!error.isEmpty()) res.json({msg:error.array()})

     try {
     let user = await User.findOne({_id:req.user.id}).select('-password')
     let postComment = await Post.findById(req.params.id)
     
    
     
     let newComment = {
       text:req.body.text,
       name:user.name,
       avatar:user.avatar,
       user:req.user.id
     };
     postComment.comments.unshift(newComment)

     await postComment.save();
     res.status(201).json(postComment.comments)

      
     } catch (error) {
         res.status(500).json({msg:'Server Error'})
     }
    
  }
);

//Delete comment /api/profile/comment/:id/:comment_id
//Delete comment from your comments
router.get('/comment/:id/:comment_id',auth,async (req,res)=>{
  let post = await Post.findById(req.params.id)
  let commentIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id)
  if(commentIndex<0){
    res.status(404).json({msg:'There is no comment with this id'})
  }
  if(comments.user.toString() !== req.user.id ){
    res.status(401).json({msg:'User not authorized'})
  }
  post.comments.splice(commentIndex,1)
  await post.save()
  res.json({post})
  try {
    
  } catch (error) {
    res.status(500).json({msg:'Server Error'})
  }
})



module.exports = router;
