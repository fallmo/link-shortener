import {Request} from 'express'

export default interface xRequest extends Request{
    user?: any;
}