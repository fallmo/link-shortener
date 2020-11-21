import { Document } from "mongoose";

export default interface IRefresh extends Document{
    user_email: string;
    userAgent: string;
}