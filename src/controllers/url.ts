import {Response, Request} from 'express'
import Url from '../models/Url';
import xRequest from "../types/request";
import IResp from '../types/response'
import { urlValid } from '../validation/url';
import {checkRecaptcha, generateRef} from '../utils'
import { delRedis, setRedis } from '../config/redis';
import IUrl from '../types/url';
import { writeLog } from '../logs';


export const getUrlControl = async (req: xRequest, res: Response) => {
    try{
        const user = req.user;

        const filter = user.admin ? {}: {user_id: user._id}
        const urls = await Url.find(filter)

        const response: IResp = {
            success: true,
            data: urls
        }
        writeLog({type: "default", text: `Links Retrieved: User ${user._id}`});
        return res.status(200).json(response);

    }catch(err){
        const status = err.client ? 403 : 500;
        const message = err.client ? "Access Denied": "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        writeLog({type: "error", text: `Failed Links Retrieved: ${message}`});
        return res.status(status).json(response);
    }
}
export const addUrlControl = async (req: xRequest, res: Response) => {
    try{
        const user = req.user;

        const {original_url} = req.body;
        const {error} = urlValid(req.body)
        if(error) throw {client: true, message: error};

        const duplicate = await Url.exists({user_id: user._id, original_url })
        if(duplicate) throw {client: true, message: "Url already shortened"};

        const {error: err, ref_id} = await generateRef(5);
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
        
        res.status(201).json(response);
        writeLog({type: "success", text: `Link Shortened: ${original_url}  => ${ref_id}`});
        return setRedis(newUrl.ref_id, newUrl.original_url)
    }catch(err){
        if(res.headersSent) return console.log("Error after response sent", err);
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message: "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        writeLog({type: "error", text: `Failed Link Shortening: ${message}`});
        return res.status(status).json(response);
    }
}

export const addGuestControl = async (req: Request, res: Response) => {
    try{
        const {original_url, recaptcha} = req.body;
        const {error} = urlValid(req.body)
        if(error) throw {client: true, message: error};

        const human = await checkRecaptcha(recaptcha);
        if(!human) throw {client: true, message: "Recaptcha verification failed"};

        const {error: err, ref_id} = await generateRef(7);
        if(err) throw new Error(err);

        const newUrl = new Url({
            original_url,
            ref_id,
        })
        await newUrl.save();

        const response: IResp = {
            success: true,
            data: newUrl
        }

        res.status(201).json(response);
        writeLog({type: "success", text: `Guest Link Shortened: ${original_url}  => ${ref_id}`});
        return setRedis(newUrl.ref_id, newUrl.original_url)
    }catch(err){
        if(res.headersSent) return console.log("Error after response sent", err);
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message: "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }

        writeLog({type: "error", text: `Failed Guest Link Shortening: ${message}`});
        return res.status(status).json(response);
    }
}


export const addChromeControl = async (req: Request, res: Response) => {
    try{
        const {original_url} = req.body;
        const {error} = urlValid(req.body)
        if(error) throw {client: true, message: error};

        const {error: err, ref_id} = await generateRef(6);
        if(err) throw new Error(err);

        const newUrl = new Url({
            original_url,
            ref_id,
        })
        
        await newUrl.save();

        const response: IResp = {
            success: true,
            data: newUrl
        }

        res.status(201).json(response);
        writeLog({type: "success", text: `Ext Link Shortened: ${original_url}  => ${ref_id}`});
        return setRedis(newUrl.ref_id, newUrl.original_url)
    }catch(err){
        if(res.headersSent) return console.log("Error after response sent", err);
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message: "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        writeLog({type: "error", text: `Failed Ext Link Shortening: ${message}`});
        return res.status(status).json(response);
    }
}


export const delUrlControl = async (req: xRequest, res: Response) => {
    try{
        const user = req.user;

        const link_id = req.params._id;
        if(!link_id) throw {client: true, message: "Link ID required"}

        const urlToDelete = await Url.findById(link_id);
        if(!urlToDelete) throw {client: true, message: "Link does not exist"};

        // Except if user is admin..
        if(urlToDelete.user_id !== user._id && !user.admin) throw { client: true, message: "Permission denied"};

        await urlToDelete.remove()

        const response: IResp = {
            success: true,
            data: {_id: link_id}
        }
        res.status(200).json(response);
        writeLog({type: "success", text: `Link Deletion: ${urlToDelete._id}`});
        return delRedis(urlToDelete.ref_id);
    }catch(err){
        if(res.headersSent) return console.log("Error after response sent", err);
        const exception = "Cast to ObjectId failed"
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : err.message.includes(exception) ? "Link does not exist" : "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        
        writeLog({type: "error", text: `Failed Link Deletion: ${message}`});
        return res.status(status).json(response);
    }
}


export const extSyncControl = async (req: xRequest, res: Response) => {
    interface errType {
        [key: string]: {
            client: boolean,
            message: string;
        }
    }
    interface completedType {
        [key: string]: IUrl
    }
    try {
        const user = req.user;
        const completed: completedType = {};
        const errors: errType = {};
        
        const {urls}: {urls: string[]} = req.body;
        if(!urls) throw {client: true, message: "URLs are required"};
        if(!Array.isArray(urls)) throw {client: true, message: "URLs must be an array"};

        for(const _id of urls){
            let error;
            let completeUrl;
            try{
                if(typeof _id !== "string") throw {client: true, message: "URL id must be a string"};

                const url = await Url.findById(_id);
                if(!url) throw {client: true, message: `URL with id: ${_id} does not exist`};
                if(url.user_id) throw {client: true, message: `URL with id: ${_id} already assigned user` };

                url.user_id = user._id;
                await url.save();
                completeUrl = url;
            }catch(err){
                 error = {
                    client: err.client,
                    message: err.message
                }
            }finally{
                if(error) errors[_id] = error;
                else if(completeUrl){
                    completed[completeUrl._id] = completeUrl;
                }
            }
        }
        const response:IResp = {success: true, data: {completed, errors}} 
        writeLog({type: "default", text: `Ext Links Sync: User ${user._id}`});
        return res.status(200).json(response);
    } catch (err) {
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message: "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        writeLog({type: "error", text: `Failed Ext Link Sync: ${message}`});
        return res.status(status).json(response);
    }
}