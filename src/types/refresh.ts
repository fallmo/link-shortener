import { Document } from "mongoose";

export default interface IRefresh extends Document{
    token: string;
    userAgent: string;
}