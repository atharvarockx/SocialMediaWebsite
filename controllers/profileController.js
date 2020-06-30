const User=require("../models/user");
const Follow=require("../models/follow");
const Post=require("../models/post");
const express=require("express");
const router=express.Router();
const middlewareUser=require('../middleware/user');
const middlewarePost=require('../middleware/post');
const md5=require('md5')

router.get("/:username",async function(req,res){
    try{
        let urlusername=req.params.username;
        if(typeof(urlusername)!=="string"){
            return res.render("404");
        }
        else{
            let foundUser = await User.findOne({username:req.params.username});
            // console.log(foundUser)
            let data= await middlewareUser.sharedData(foundUser._id,req.session.visitorId);
            let isFollowing=data[0]
            let postCount=data[1]
            
            let followerCount=data[2]
            let followingCount=data[3]
            console.log(isFollowing)
            if(!foundUser){
                return res.render("404");
            }
            else{
                let avatar=getAvatar(foundUser.email)
                res.render("profile",{
                    avatar:avatar,
                    currentPage:"posts",
                    posts:foundUser.posts,
                    username:foundUser.username,
                    isFollowing:isFollowing,
                    foundUser:foundUser,
                    visitorId: req.session.visitorId,
                    postCount:postCount,
                    followerCount:followerCount,
                    followingCount:followingCount
                })
            }    
        }       
    }
    catch{
        res.render("404");
    }   
})

router.get("/:username/followers",async function(req,res){
    try{
        let urlusername=req.params.username;
        if(typeof(urlusername)!=="string"){
            return res.render("404");
        }
        else{
            let foundUser = await User.findOne({username:req.params.username});
            // console.log(foundUser)
            let data= await middlewareUser.sharedData(foundUser._id,req.session.visitorId);
            let isFollowing=data[0]
            let postCount=data[1]
            
            let followerCount=data[2]
            let followingCount=data[3]
            let followers= await Follow.find({followedId:foundUser._id}).select('authorId authorUsername')

            var respo=followers.map((followed)=>{
                return User.findOne({_id:followed.authorId}).select("email");
            }) 
            let getVal= await Promise.all(respo)
            // console.log(getVal)
            var avatars=[]
            getVal.forEach(function(ids){
                avatars.push(getAvatar(ids.email))
            })
            console.log(avatars)
            // console.log(followerIdList)
            // console.log(follower)
            if(!foundUser){
                return res.render("404");
            }
            else{
                // res.json(followers)
                let avatar=getAvatar(foundUser.email)
                res.render("profile-followers",{
                    avatar:avatar,
                    avatars:avatars,
                    currentPage:"followers",
                    followers:followers,
                    username:foundUser.username,
                    isFollowing:isFollowing,
                    foundUser:foundUser,
                    visitorId: req.session.visitorId,
                    postCount:postCount,
                    followerCount:followerCount,
                    followingCount:followingCount
                })
            }    
        }       
    }
    catch{
        res.render("404");
    }   
})

router.get("/:username/following",async function(req,res){
    try{
        let urlusername=req.params.username;
        if(typeof(urlusername)!=="string"){
            return res.render("404");
        }
        else{
            let foundUser = await User.findOne({username:req.params.username});
            // console.log(foundUser)
            let data= await middlewareUser.sharedData(foundUser._id,req.session.visitorId);
            let isFollowing=data[0]
            let postCount=data[1]
            
            let followerCount=data[2]
            let followingCount=data[3]
            let following= await Follow.find({authorId:foundUser._id}).select('followedId followedUsername')
            
            var respo=following.map((followed)=>{
                return User.findOne({_id:followed.followedId}).select("email");
            }) 
            let getVal= await Promise.all(respo)
            // console.log(getVal)
            var avatars=[]
            getVal.forEach(function(ids){
                avatars.push(getAvatar(ids.email))
            })
            console.log(avatars)
            // console.log(followerIdList)
            // console.log(follower)
            if(!foundUser){
                return res.render("404");
            }
            else{
                // res.json(followers)
                let avatar=getAvatar(foundUser.email)
                res.render("profile-following",{
                    avatar:avatar,
                    avatars:avatars,
                    currentPage:"following",
                    following:following,
                    username:foundUser.username,
                    isFollowing:isFollowing,
                    foundUser:foundUser,
                    visitorId: req.session.visitorId,
                    postCount:postCount,
                    followerCount:followerCount,
                    followingCount:followingCount
                })
            }    
        }       
    }
    catch{
        res.render("404");
    }   
})

getAvatar=function(email){
    return `https://gravatar.com/avatar/${md5(email)}?s=128`
}
module.exports=router;