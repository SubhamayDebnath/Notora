import nodemailer from "nodemailer";
import { SMTP_EMAIL, SMTP_PASSWORD } from "../config/config.js";

const sendEmail = async function (email, subject, message) {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		secure: true,
		auth: {
			user: SMTP_EMAIL,
			pass: SMTP_PASSWORD,
		},
	});

	await transporter.sendMail({
		from: SMTP_EMAIL,
		to: email,
		subject: subject,
		html: message,
	});
};

export default sendEmail;
