import { Document } from "mongoose";

export default interface emailVerify extends Document{
    reference: string;
    user_id: string;
}