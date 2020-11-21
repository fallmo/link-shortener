import {Request, Response} from 'express'
import EmailVerify from '../models/EmailVerify';
import Url from '../models/Url';
import User from '../models/User';



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
        const context = err.client ? {redirect: true} : {}
        return res.status(+view).render(view, context);
    }
}

export const indexControl = (req: Request, res: Response) => {
    if(req.cookies['apauth'] === "true") return res.redirect('http://localhost:3000');
    return res.render('index');
}

export const verifyControl = async (req: Request, res: Response) => {
    try{
        const {_id} = req.params;

        const emailVerify = await EmailVerify.findById(_id)
        if(!emailVerify) throw {client: true, message: "Link Error"}
    
        const user = await User.findById(emailVerify.user_id);
        if(!user) throw {client: true, message: "User does not exist"};

        user.confirmed = true;
        await user.save()

        res.status(200).render('verify');

        const allVerifies = await EmailVerify.find({user_id: user._id})
        allVerifies.forEach(verify => {
            verify.remove();
        })
        
    }catch(err){
        const exception = "Cast to ObjectId failed";
        if(err.client || err.message.includes(exception)) return res.status(400).render('verify', {error: err.message})
        else return res.status(500).render('500')
    }
}