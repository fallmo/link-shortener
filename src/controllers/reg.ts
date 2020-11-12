import {Request, Response} from 'express'
import Url from '../models/Url';

export const redirectTo = async (req: Request, res: Response) => {
    try{
        const {ref_id} = req.params;
        const url = await Url.findOne({ref_id})
        if(!url) throw {client: true, message: "Could not find link"};

        return res.redirect(url.original_url);
    }catch(err){
        // res.render(No url)
        // res.render(500 error)
    }
}