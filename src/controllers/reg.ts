import {Request, Response} from 'express'
import Url from '../models/Url';


export const redirectControl = async (req: Request, res: Response) => {
    try{
        const {ref_id} = req.params;
        const url = await Url.findOne({ref_id})
        if(!url) throw {client: true, message: "Could not find link"};

        if(url.user_id) return res.redirect(url.original_url);
        else return res.render('ads', {url: url.original_url });
    }catch(err){
        const view = err.client ? '404' : '500';
        return res.status(+view).render(view);
    }
}

export const indexControl = (req: Request, res: Response) => {
    return res.render('index');
}