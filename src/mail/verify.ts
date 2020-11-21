import EmailVerify from '../models/EmailVerify'
import { sendMail } from './send';

interface verifyArgs{
    _id: string,
    name: string,
    email: string;
}
export const sendVerification = async (user: verifyArgs) => {
    try{
        const emailVerif = await EmailVerify.create({user_id: user._id});
        const link = 'http://localhost:3030/verify/'+emailVerif._id;
        const from = {name:"gripURL", email: "noreply@gripurl.com" }
        const to = user.email
        const subject = "Email Verification";
        const text = "Click the link to verify your email"
        const html = createHtml({link, name: user.name});
        const mailSent = await sendMail({from, to, subject, text, html})
    }catch(err){
        console.log('Error setting up mail ', err.message);
    }
}


interface htmlArgs{
    link: string,
    name: string,
}
function createHtml(args: htmlArgs){
return `
<div>
    <h1>Dear ${args.name},</h1>
    <p><a href="${args.link}">Click Here</a> to verify your email.</p>
</div>
`
}