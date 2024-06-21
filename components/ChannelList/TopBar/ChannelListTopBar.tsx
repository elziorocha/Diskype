import { CloseIcon, ChevronDown } from "@/components/Icons";
import { useState } from "react";
import { menuItems } from "./menuItems";
import ChannelListMenuRow from "./ChannelListMenuRow";

export default function ChannelListTopBar({
    serverName,
}: {
    serverName: string;
}): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="w-full relative">
            <button onClick={() => setMenuOpen((currentValue) => !currentValue)}
                className={`flex w-full items-center justify-between p-4 border-b-4 border-gray-700
            ${menuOpen ? 'bg-zinc-800' : ''} border-gray-800 hover:bg-zinc-800`}
            >
                <h2 className="text-lg font-bold text-gray-200 tracking-wide">{serverName}</h2>
                {menuOpen && <CloseIcon />}
                {!menuOpen && <ChevronDown />}
            </button>

            {menuOpen && (
                <div className="absolute w-full p-2 z-10">
                    <div className="w-full bg-gray-700 p-2 rounded-md shadow-[0_0_15px_1px_#000]">
                        <h2 className="text-gray-200 text-center">Menu</h2>
                        {menuItems.map((option) => (
                            <button
                                key={option.name}
                                className='w-full'
                                onClick={() => setMenuOpen(false)}
                            >
                                <ChannelListMenuRow {...option}/>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}