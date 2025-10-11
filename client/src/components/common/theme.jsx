import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/themeContext";
const Theme = () => {
	const { theme, setTheme } = useTheme();
	// 
	const themes = [
		{ name: "auto", icon: <LaptopMinimal size={20} /> },
		{ name: "light", icon: <Sun size={20} /> },
		{ name: "dark", icon: <Moon size={20} /> },
	];

	const currentIcon = themes.find((t) => t.name ===  theme)?.icon || (
		<LaptopMinimal size={20} />
	);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size={"sm"} variant="outline">
					{currentIcon}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-34" align="end">
				{themes.map(t => (
					<DropdownMenuLabel
						key={t.name}
						onClick={() => setTheme(t.name)}
						className={`flex items-center gap-2 cursor-pointer rounded ${theme === t.name ? "bg-accent" : "hover:bg-accent"
							}`}
					>
						{t.icon}<span>{t.name.charAt(0).toUpperCase() + t.name.slice(1)}</span>
					</DropdownMenuLabel>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Theme;
