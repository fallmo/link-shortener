import { NextFunction, Response } from "express";
import IResp from '../types/response'
import xRequest from '../types/request'
import jwt from 'jsonwebtoken'

interface loginParams {
    email: string,
    password: string
}

interface registerParams {
    name: string;
    email: string;
    password: string;
}

export const loginValid = (params: loginParams) => {
    const {email, password} = params;

    if(!email) return {error: "Email is Required"};
    if(typeof email !== "string") return {error: "Email must be string"};
    if(!email.includes('@') || !email.includes(".")) return {error: "Email not valid"};
    if(email.length < 7 || email.length > 80) return {error: "Email must contain 7-80 characters"}

    if(!password) return {error: "Password is required"};
    if(typeof password !== "string") return {error: "Password must be string"};
    if(password.length < 6 || password.length > 80) return {error: "Password must contain 6-80 characters"}

    return {error: null};
}

export const registerValid =  (params: registerParams) => {
    const {name, email, password} = params;

    if(!name) return {error: "Name is required"};
    if(typeof name !== "string") return {error: "Name must be string"};
    if(name.length < 3 || name.length > 40) return {error: "Name must contain 3-40 characters"}

    if(!email) return {error: "Email is Required"};
    if(typeof email !== "string") return {error: "Email must be string"};
    if(!email.includes('@') || !email.includes(".")) return {error: "Email not valid"};
    if(email.length < 7 || email.length > 80) return {error: "Email must contain 7-80 characters"}

    if(!password) return {error: "Password is required"};
    if(typeof password !== "string") return {error: "Password must be string"};
    if(password.length < 6 || password.length > 80) return {error: "Password must contain 6-80 characters"}
    
    return {error: null};
}

export const isAuthed = async (req: xRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.header('token');
        if(!token) throw {client: true};

        try{
            const verified = jwt.verify(token, process.env.TOKEN_SECRET!);
            req.user = verified;
            next();
        }catch(err){
            throw {client: true};
        }
        
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