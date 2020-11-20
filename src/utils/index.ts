import fetch from 'node-fetch'
import {nanoid} from 'nanoid';
import Url from '../models/Url'
import Refresh from '../models/Refresh'
import EmailVerify from '../models/EmailVerify';



export const generateRef = async (len: number = 7) : Promise<{error?: string, ref_id?: string}>  => {
    try{
        const ref_id = nanoid(len);
        const collided = await Url.exists({ref_id});
        if(collided) return generateRef(len);
        else return {ref_id};
    }catch(err){
        return {error: err.message}
    }
}


export const generateToken = async (): Promise<{error?:string, token?: string}> => {
    try{
        const token = nanoid()
        const collided = await Refresh.exists({token});
        if(collided) return generateToken();
        else return {token};
    }catch(err){
        return {error: err.message}
    }
}

export const generateEmailRef = async (): Promise<{error?: string, reference?: string}> => {
    try{
        const reference = nanoid();
        const collided = await EmailVerify.exists({reference});
        if(collided) return generateEmailRef();
        else return {reference}
    }catch(err){
        return {error: err.message}
    }
}


export const checkRecaptcha = async (val: string) => {
    if(!val) return false;
    try{
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${val}`, {
            method: "POST"
        })
        const data = await response.json();
        if(data.success) return true;
        else return false;
    }catch(err){
        return false
    }
}

