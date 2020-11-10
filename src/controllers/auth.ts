import { Request, Response } from 'express';
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import IResp from '../types/response';
import {loginValid, registerValid} from '../validation/auth'
import xRequest from '../types/request';

export const loginControl = async (req: Request, res:Response) => {
    try{
        const {email, password} = req.body
        const {error} = loginValid({email, password});
        if(error) throw {client: true, message: error};
        
        const userExists = await User.findOne({email});
        if(!userExists) throw {client: true, message: "Email is not registered"};

        const validPassword = await bcrypt.compare(password, userExists.password);
        if(!validPassword) throw {client: true, message: "Incorrect credentials"};

        const token = jwt.sign({_id: userExists._id}, process.env.TOKEN_SECRET!)

        const response: IResp = {success: true, data: {token, name: userExists.name, email: userExists.email}}
        return res.status(200).header("token", token).json(response);

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
        const {_id} = req.user;
        const user = await User.findById(_id, 'name email');
        if(!user) throw {client: true};

        const response: IResp = {
            success: true,
            data: {name: user.name, email: user.email}
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