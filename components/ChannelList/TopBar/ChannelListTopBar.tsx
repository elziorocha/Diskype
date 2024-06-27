import { CloseIcon, ChevronDown } from "@/components/Icons";
import { useState } from "react";
import { menuItems } from "./menuItems";
import ChannelListMenuRow from "./ChannelListMenuRow";
import Image from 'next/image';

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export default function ChannelListTopBar({
    serverName,
    serverImage = '',
}: {
    serverName: string;
    serverImage?: string;
}): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="w-full relative">
            <button onClick={() => setMenuOpen((currentValue) => !currentValue)}
                className={`flex w-full items-center justify-between py-4 px-3 border-b-4 border-gray-700
            ${menuOpen ? 'bg-zinc-800' : ''} border-gray-800 hover:bg-zinc-800`}
            >
                <div className="flex items-center justify-center">
                    {serverImage && isValidUrl(serverImage) ? (
                        <Image src={serverImage} width={100} height={100} alt="Server Icon" 
                        className='rounded-full mr-2 size-12 aspect-square object-cover'/>
                    ) : (
                        <span className='rounded-full mr-2 size-12 aspect-square object-cover bg-gray-600
                        flex items-center justify-center font-semibold'>
                            {serverName.charAt(0)}
                        </span>
                    )}
                    <h2 className="text-lg font-bold text-gray-200 tracking-wide">{serverName}</h2>
                </div>

                {menuOpen ? <CloseIcon /> : <ChevronDown />}
            </button>

            {menuOpen && (
                <div className="absolute w-full p-2 z-10">
                    <div className="w-full bg-gray-700 p-3 rounded-md shadow-[0_0_15px_1px_#000]">
                        {menuItems.map((option) => (
                            <button
                                key={option.name}
                                className='w-full'
                                onClick={() => setMenuOpen(false)}
                            >
                                <ChannelListMenuRow {...option} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    function checkIfUrl(path: string): Boolean {
        try {
            const _ = new URL(path);
            return true;
        } catch (_) {
            return false;
        }
    }
}
