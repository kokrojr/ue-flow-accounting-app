const nodemailer = require("nodemailer");

class EmailService {
    static async sendInvoiceEmail(toEmail, subject, body, pdfPath) {
        const transporter = nodemailer.createTransport({
            // Configure with SMTP server credentials
        });

        const mailOptions = {
            from: "your-email@example.com",
            to: toEmail,
            subject: subject,
            text: body,
            attachments: [{ filename: "Invoice.pdf", path: pdfPath }]
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}

module.exports = EmailService;