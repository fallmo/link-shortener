import {nanoid} from 'nanoid';
import Url from '../models/Url'



export const generateRef = async () : Promise<{error?: string, ref_id?: string}>  => {
    try{
        const ref_id = nanoid(7);
        const collided = await Url.exists({ref_id});
        if(collided) return generateRef();
        else return {ref_id};
    }catch(err){
        return {error: err.message}
    }
}