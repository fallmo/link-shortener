import nodemailer from 'nodemailer'

interface mailArgs {
    from : {name: string, email: string},
    to: string,
    subject: string,
    text: string;
    html: string
}

export const sendMail = async ({from, to, subject, text, html}: mailArgs) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 0,
            secure: true, 
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS, 
            },
          });
        
          const info = await transporter.sendMail({
            from: `"${from.name}" ${from.email}`,
            to,
            subject,
            text, 
            html
          });
          console.log('Email Sent ', info.messageId)
          
        }catch(err){
        console.log("Email Failed ", err)
    }
}