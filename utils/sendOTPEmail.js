const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Function to send the email with OTP
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Account OTP Verification',
        html: `<p>Your OTP for admin account verification is: <strong>${otp}</strong></p>`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = sendOTPEmail;
