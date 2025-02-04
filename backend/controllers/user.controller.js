import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async(req,res)=>{
    try{
        const {fullname,email,phoneNumber,password,role}=req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message : 'Somthing is wrong ... ',
                success : false
            });
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message : 'User Already exist ...',
                success : false
                
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);  // hash len 10
        await User.create({
            fullname,
            email,
            phoneNumber,
            password : hashedPassword,
            role
        })
        return res.status(201).json({
            message : 'Account is created Successfully...',
            success :true
        })
    }catch (error){
        console.log(error);
    }
}

export const login = async (req,res) =>{
    try{
        const {email,password,role} =req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message : 'Something is wrong',
                success : false
            })
        }

        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : 'Email or Password is Wrong',
                success : false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message : 'Email or Password is Wrong',
                success : false
            })
        }
        if(role!=user.role){
            return res.status(400).json({
                message : " Account doeen't exist with this role ",
                success : false
            })
        }

        const tokenData ={
            userId : user._id     //store the user data in token
        }

        user = {
            _id : user.id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber : user.phoneNumber,
            role :user.role,
            profile : user.profile
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn : '1d'});
        return res.status(200).cookie("token",token,{maxAge : 1*24*60*60*1000,httpsOnly : true,sameSite:'strict'}).json({
            message : `Welcome back ${user.fullname}`,
            user,
            success : true
        })
    } catch(error){
        console.log(error);
    }
}

export const logout= async (req,res) =>{
    try {
        return res.status(200).cookie("token", {maxAge : 0}).json({
            message : 'Logout Successfully...',
            success : true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req,res) => {
    try {
        const {fullname, email, phoneNumber, bio, skills} = req.body;
        const file=req.file;
        //cloudinary file
        let skillsArray;
        if(skills){
        skillsArray = skills.split(",");
        }
        const userId=req.id;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message : 'User not found',
                success : false
            })
        }
        if(fullname) user.fullname = fullname;
        if(email) user.email =email;
        if(phoneNumber)  user.phoneNumber=phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills)  user.profile.skills=skillsArray;    

        await user.save();

        //resume here
        user = {
            _id : user.id,
            fullname : user.fullname,
            email : user.email,
            phoneNumber : user.email,
            role :user.role,
            profile : user.profile
        }
        

        return res.status(200).json({
            message : 'User updated Successfully...',
            user,
            success : true
        })
    } catch (error) {
        console.log(error);
    }
}