import {Response} from 'express'
import Url from '../models/Url';
import User from '../models/User';
import xRequest from "../types/request";
import IResp from '../types/response'
import { urlValid } from '../validation/url';
import {generateRef} from '../utils'


export const getUrlControl = async (req: xRequest, res: Response) => {
    try{
        const {_id} = req.user;
        const user = await User.findById(_id, 'admin')
        if(!user) throw {client: true};

        const filter = user.admin ? {}: {user_id: _id}
        const urls = await Url.find(filter)

        const response: IResp = {
            success: true,
            data: urls
        }

        return res.status(200).json(response);

    }catch(err){
        const status = err.client ? 403 : 500;
        const message = err.client ? "Access Denied": "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response);
    }
}
export const addUrlControl = async (req: xRequest, res: Response) => {
    try{
        const {_id} = req.user;
        const user = await User.findById(_id, 'admin')
        if(!user) throw {client: true, message: "Invalid auth token"};

        const {original_url} = req.body;
        const {error} = urlValid(req.body)
        if(error) throw {client: true, message: error};

        const duplicate = await Url.exists({user_id: _id, original_url })
        if(duplicate) throw {client: true, message: "Url already shortened"};

        const {error: err, ref_id} = await generateRef();
        if(err) throw new Error(err);

        const newUrl = new Url({
            original_url,
            ref_id,
            user_id: user._id
        })
        await newUrl.save();

        const response: IResp = {
            success: true,
            data: newUrl
        }

        return res.status(201).json(response);

    }catch(err){
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message: "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response);
    }
}


export const delUrlControl = async (req: xRequest, res: Response) => {
    try{
        const {_id} = req.user;
        const {_id: link_id} = req.body;
        if(!link_id) throw {client: true, message: "Link ID required"}

        const urlToDelete = await Url.findById(link_id);
        if(!urlToDelete) throw {client: true, message: "Link does not exist"};

        if(urlToDelete.user_id !== _id) throw { client: true, message: "Permission denied"};

        await urlToDelete.remove()

        const response: IResp = {
            success: true,
            data: {_id: link_id}
        }
        return res.status(200).json(response);
    }catch(err){
        const exception = "Cast to ObjectId failed"
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : err.message.includes(exception) ? "Link does not exist" : "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        
        return res.status(status).json(response);
    }
}