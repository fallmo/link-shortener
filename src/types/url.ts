import {Document} from 'mongoose'

export default interface IUrl extends Document{
    original_url: string;
    ref_id: string;
    user_id?: string;
    date: string;
}