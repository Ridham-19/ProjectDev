import nodeMailer from "nodemailer";

export const sendEmail = async ({to, subject, message}) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            service: process.env.SMTP_SERVICE,
        });
        const mailOptions = {
            from: `ProjectDev Admin: ${process.env.SMTP_USER}`,
            // from: `"HAPPY BIRTHDAY🎁" 😊 <${process.env.SMTP_USER}>`,
            to,
            subject,
            // subject: "Happy Birthday! 🎂",
            html: message,
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error(error.message || "Cannot send email");
    }
}