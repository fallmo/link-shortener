import {createClient} from 'redis'
import {promisify} from 'util'
import { writeLog } from '../logs';
import Url from '../models/Url';
const URL = process.env.REDIS_URL || "6379";
const client = createClient(URL);

export const setRedis = (key: string, value: string) => {
     client.set(key, value);
}

export const getRedis = async (key: string) => {
   const get = promisify(client.get).bind(client);
    try{
        const val = await get(key);
        return val; 
    }catch(err){
        writeLog({type: "error", text: `Failed Redis Get: ${err.message}`})
        return null;
    }  
}

export const delRedis = (key: string) => {
    client.del(key);
}

export const preCacheUrls = async () => {
    const urls = await Url.find({}, "ref_id original_url");
    urls.forEach(url => {
        setRedis(url.ref_id, url.original_url);
    })
    writeLog({type: "default", text: `Redis Cached: ${urls.length} links`})

}
