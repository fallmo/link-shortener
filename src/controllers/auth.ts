import { Request, Response } from 'express';
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import IResp from '../types/response';
import {loginValid, registerValid} from '../validation/auth'
import xRequest from '../types/request';
import Refresh from '../models/Refresh';
import { sendVerification } from '../mail/verify';



export const loginControl = async (req: Request, res:Response) => {
    try{
        const {email, password} = req.body
        const {error} = loginValid({email, password});
        if(error) throw {client: true, message: error};
        
        const userExists = await User.findOne({email});
        if(!userExists) throw {client: true, message: "Email is not registered"};
        if(!userExists.confirmed) throw {client: true, message: "Email is not verified"};

        const validPassword = await bcrypt.compare(password, userExists.password);
        if(!validPassword) throw {client: true, message: "Incorrect credentials"};

        const token = jwt.sign({_id: userExists._id, name: userExists.name, email: userExists.email, admin: userExists.admin}, process.env.TOKEN_SECRET!, {expiresIn: "10m" });
       
        const refreshDB = new Refresh({
            user_email: email,
            userAgent: req.header('User-Agent')
        })
        await refreshDB.save();
        const refreshToken = jwt.sign({refresh_id: refreshDB._id}, process.env.REFRESH_SECRET!);

        const response: IResp = {success: true, data: {token, refreshToken, name: userExists.name, email: userExists.email}}
        return res.status(200).cookie("apauth", true, {httpOnly: true}).json(response);

    }catch(err){
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : "Something Went Wrong";
        const response: IResp = {
            success: false,
            message
        }
        res.status(status).json(response); 
    }
}

export const registerControl = async (req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;
        const {error} = registerValid({name, email, password});
        if(error) throw {client: true, message: error};

        const emailRegistered = await User.findOne({email});
        if(emailRegistered) throw {client: true, message: "Email is already registered"}

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({name, email, password: hashPassword});
        await newUser.save();

        const response: IResp = {success: true, data: newUser.email};
        res.status(201).json(response);

        return await sendVerification({ _id: newUser._id, name: newUser.name, email: newUser.email});
    }catch(err){
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : "Something Went Wrong";
        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response); 

    }
}

export const userControl = async (req: xRequest, res: Response) => {
    try{
        const { name, email} = req.user;

        const response: IResp = {
            success: true,
            data: {name,email}
        }

        return res.status(200).json(response)


    }catch(err){
        const status = err.client ? 403 : 500;
        const message = err.client ? "Access Denied" : "Something Went Wrong";
        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response); 
    }

}


export const refreshControl = async (req: Request, res: Response) => {
    try{
        const token = req.header("refresh");
        const userAgent = req.header("User-Agent");
        if(!token || !userAgent) throw {client: true, message: "Missing Information"};
        let refresh_id;

        try{
            const verified = jwt.verify(token, process.env.REFRESH_SECRET!);
            refresh_id = (verified as any).refresh_id;
        }catch(err){
            throw {client: true, message: "Token Verification Failed"};
        }
       
        const valid = await Refresh.findById(refresh_id);
        if(!valid) throw {client: true, message: "Invalid Token"};
    
        if(valid.userAgent !== userAgent){
            await valid.remove();
            throw {client: true, message: "Token not accepted"}
        }

        const user = await User.findOne({email: valid.user_email}, "name email admin")
        if(!user) throw {client: true, message: "User no longer exists"};

        const newToken = jwt.sign({_id: user._id, name: user.name, email:user.email, admin:user.admin}, process.env.TOKEN_SECRET!, {expiresIn: "10m"});
        const response = {success:true, data: {token: newToken}};
        
        return res.status(200).json(response);
    }catch(err){
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : "Something Went Wrong";
        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response); 
    }
}

export const logoutControl = async (req: Request, res: Response) => {
    res.status(202).cookie("apauth", false, {httpOnly: true}).end();
    
    const refreshToken = req.header('refresh');
    if(!refreshToken) return;
    try{
        const verified = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
        const {refresh_id} = (verified as any);
        const session = await Refresh.findById(refresh_id);
        if(session) return await session.remove();
    }catch(err){
        console.log('failed to delete session Err: ',err.message);
    }
}


export const resendControl = async (req: Request, res: Response) => {
    try{
        const {email} = req.body;
        if(!email) throw {client: true, message: "Email is required"};

        const user = await User.findOne({email}, "name confirmed");
        if(!user) throw {client: true, message: "Email is not registered"};

        if(user.confirmed) throw {client: true, message: "Email already verified"};

        const emailSent = await sendVerification({ _id: user._id, name: user.name, email});

        const response:IResp = {success: true, data: {email}};
        return res.status(200).json(response);

    }catch(err){
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : "Something Went Wrong";
        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response); 
    }

}