const errorMiddleware = (err, req, res, _next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Something went wrong";

	const response = {
		success: false,
		statusCode,
		message,
	};

	if (err.errors && err.errors.length > 0) {
		response.errors = err.errors;
	}

	if (err.data) {
		response.data = err.data;
	}

	if (process.env.NODE_ENV === "development") {
		response.stack = err.stack;
	}

	res.status(statusCode).json(response);
};

export default errorMiddleware;
