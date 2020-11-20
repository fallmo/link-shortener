import nodemailer from 'nodemailer'

interface mailArgs{
    user_id: string;
    user_name: string;
    user_email: string;
    reference: string;
}
export const sendMail = async ({user_id, user_name, user_email, reference}: mailArgs) => {
    const linkTarget = `/${reference}/${user_id}`;
    const htmlMail = createVerfiyMail(user_name, linkTarget);

    try{
        
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 0,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER, // generated ethereal user
              pass: process.env.SMTP_PASS, // generated ethereal password
            },
          });
        
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"gripURL" <noreply@gripurl.com>', // sender address
            to: user_email, // list of receivers
            subject: "Email Verification", // Subject line
            text: "Verify your email address", // plain text body
            html: htmlMail, // html body
          });
          console.log('Email Sent ', info.messageId)
          console.log(user_email);
        }catch(err){
        console.log("Email Failed ", err)
    }
    
}


const createVerfiyMail = (name: string, link: string) => {
    const route = "http://localhost:3000/verify"
    return `
    <div>
        <h1>Dear ${name},</h1>
        <p><a href="${route}${link}">Click Here</a> to verify your email.</p>
    </div>
    `
}