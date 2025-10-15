import { NODE_ENV } from "../config/config.js";
// email validation
export const isValidEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
};

// cookie option
const isProduction = NODE_ENV === "production";
const cookieOption = {
	httpOnly: true,
	secure: isProduction,
	sameSite: isProduction ? "none" : "lax",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export { isValidEmail, cookieOption };
