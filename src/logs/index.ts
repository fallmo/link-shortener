import fs from 'fs'
import { nanoid } from 'nanoid';
import path from 'path'

interface LogProps {
    type: "success" | "default" | "error",
    text: string;
}

export const writeLog = ({type, text}: LogProps) => {
    try{
        const existingLog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'log.json'), 'utf-8'));
        const _id = nanoid(12) + (existingLog.length !== null ? existingLog.length :  0);
        const updatedLog = [{_id, type, text, date: new Date()},...existingLog]
        fs.writeFileSync(path.resolve(__dirname, 'log.json'), JSON.stringify(updatedLog));
        return true;
    }catch(err){
        console.log(err)
        return false;
    }
}

export const readLog = () => {
    try{
        const log = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'log.json'), 'utf-8'));
        if(!log) throw new Error("No Log Parsed or Read")
        return {data: log};
    }catch(err){
        console.log(err)
        return {error: err.message};
    }
}

export const clearLog = () => {
    try{
        fs.writeFileSync(path.resolve(__dirname, 'log.json'), JSON.stringify([]));
        return true;
    }catch(err){
        return false;
    }
}