import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import { Outlet } from "react-router";
const HomepageLayout = () => {
	return (
		<div className="min-h-dvh h-full flex flex-col items-center justify-between">
			<Navbar />
			<main className={`relative flex-grow lg:max-w-7xl max-w-3xl w-full h-full px-4 md:px=8 lg:px-12`}>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default HomepageLayout;
