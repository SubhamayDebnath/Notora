import { Link } from "react-router";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Settings, User } from "lucide-react";
const UserAccountDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant="outline">
                    Subhamay
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-34" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link to={'/'} className={`flex items-center gap-2 w-full`}>
                            <User size={26} />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to={'/'} className={`flex items-center gap-2 w-full`}>
                            <Settings size={26} />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className={'p-0'}>
                    <Button className={`w-full text-white hover:bg-red-600 bg-red-500`} size={'sm'} >
                        Logout
                    </Button>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountDropdown