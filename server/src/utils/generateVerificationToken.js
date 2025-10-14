import crypto from "crypto";
// generate verification token and expiry date
const generateVerificationToken = async () => {
	const token = crypto.randomBytes(20).toString("hex");
	const expiresIn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
	return { token, expiresIn };
};

export default generateVerificationToken;
