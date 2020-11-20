import {Document} from 'mongoose'

export default interface IUrl extends Document{
    original_url: string;
    ref_id: string;
    clicks: number;
    user_id?: string;
    date: string;
}