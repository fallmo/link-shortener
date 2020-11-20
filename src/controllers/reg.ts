import {Request, Response} from 'express'
import Url from '../models/Url';



export const redirectControl = async (req: Request, res: Response) => {
    try{
        const {ref_id} = req.params;
        const url = await Url.findOne({ref_id})
        if(!url) throw {client: true, message: "Could not find link"};
        url.clicks ++;
        if(url.user_id)  res.redirect(url.original_url);
        else  res.render('ads', {url: url.original_url });
        return await url.save();
    }catch(err){
        const view = err.client ? '404' : '500';
        return res.status(+view).render(view);
    }
}

export const indexControl = (req: Request, res: Response) => {
    if(req.cookies['apauth'] === "true") return res.redirect('http://localhost:3000');
    return res.render('index');
}