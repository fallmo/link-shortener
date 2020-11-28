import  {Response} from 'express'
import { readLog, clearLog } from '../logs';
import Url from '../models/Url';
import User from '../models/User';
import xRequest from '../types/request'
import IResp from '../types/response';

export const getInfoControl = async (req: xRequest, res: Response) => {
    try{
        const user = req.user;
        if(!user.admin) throw {client: true, message: "Access Denied"};

        const urls = await Url.find();
        const users = await User.find({}, "name email admin confirmed date");
        const upgradedUrls = urls.map(url => {
            const user = users.find(user => user._id == url.user_id);  
            return {
                    _id: url._id,
                    ref_id: url.ref_id,
                    original_url: url.original_url,
                    date: url.date, 
                    user: user ? {name: user.name, email: user.email} : null
                }
        })

        const response: IResp = {
            success: true,
            data: {users, links: upgradedUrls}
        }
        return res.status(200).json(response);

    }catch(err){
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response);
    }
}

export const getLogsControl = async (req:xRequest, res: Response) => {
    try{
        const user = req.user;
        if(!user.admin) throw {client: true, message: "Access Denied"}
        const {error, data} = readLog();
        const logs = error ? [] : data;
        const response: IResp = {success: true, data: {logs}}
        return res.status(200).json(response);
    }catch(err){
        const status = err.client ? 400 : 500;
        const message = err.client ? err.message : "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response);
    }
}

export const clearLogsControl = async (req: xRequest, res: Response) => {
    try{
        const user = req.user;
        if(!user.admin) throw {client: true, message: "Access Denied"}
        const cleared = clearLog();
        if(!cleared) throw {client: true, message: "Could not clear log"};
        const response:IResp = {
            success: true,
            data: true,
        }
        return res.status(200).json(response);
    }catch(err){
        const status = err.client ? 403 : 500;
        const message = err.client ? err.message : "Something went wrong";

        const response: IResp = {
            success: false,
            message
        }
        return res.status(status).json(response);
    }
}