import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./context/themeContext";

createRoot(document.getElementById("root")).render(
	<ThemeProvider>
		<BrowserRouter>
			<App />
			<Toaster />
		</BrowserRouter>
	</ThemeProvider>
);
