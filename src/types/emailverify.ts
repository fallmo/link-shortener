import { Document } from "mongoose";

export default interface emailVerify extends Document{
    user_id: string;
}