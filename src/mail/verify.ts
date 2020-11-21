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
        const from = {name:"gripURL", email: "support@gripurl.com" }
        const to = user.email
        const subject = "Email Verification";
        const text = `Verify your email by visiting the following link: \n ${link}`;
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
<div style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen,    Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;border: 1px solid rgba(0, 0, 0, 0.15);">
<div style="
padding: 15px;
border-bottom:  1px solid rgba(0, 0, 0, 0.15);
">
    <h3 style="
font-size: 25px;
color: #007bff;
margin: 0;
">grip<span style="
color: #ff7a75;
">URL</span></h3> </div>
<div style="
padding: 10px 15px;
font-weight: 300;
">
    <div>
        <h1 style="
margin: 0;
font-weight: 400;
color: #007bff;
">Verify your email address</h1> </div>
    <div style="
">
        <h3 style="font-weight: 500;">Hi ${args.name},</h3> </div>
    <div>
        <p style="
text-align: center;
">Thank you for signing up. To use your account you'll first need to confirm your email by clicking the button below.</p>
    </div>
    <div> <a href="${args.link}" style="
color: unset;
text-decoration: unset;
display: block;
padding: 10px 20px;
border-radius: 5px;
border: 1px solid transparent;
box-shadow: 0 1px 2px 0 #00000030;
text-align: center;
white-space: nowrap;
color: #fff;
background-color: #007bff;
cursor: pointer;
">Verify Now</a> </div>
    <div>
        <p style="">Should you have any questions, you are welcome to reply to this email.</p>
    </div>
    <div>
        <p>Thanks,</p>
        <p>GRIPURL Support</p>
    </div>
</div>
</div>
`
}