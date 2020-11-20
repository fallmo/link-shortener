import {nanoid} from 'nanoid';
import Url from '../models/Url'
import Refresh from '../models/Refresh'



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