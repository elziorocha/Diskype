import { Gear, LeaveServer, Mic, Speaker } from "@/components/Icons";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { useChatContext } from "stream-chat-react";
import ChannelListMenuRow from "../TopBar/ChannelListMenuRow";

export default function ChannelListBottomBar(): JSX.Element {
    const { client } = useChatContext();

    const [micActive, setMicActive] = useState(false);
    const [audioActive, setAudioActive] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { signOut } = useClerk();

    return (
        <div className="mt-auto p-2 bg-zinc-800 w-full flex items-center space-x-3 relative">
            <button onClick={() => setMenuOpen((currentValue) => !currentValue)}
                className="flex flex-1 items-center space-x-2 p-1 pr-2 rounded-md hover:bg-zinc-900">
                {client.user?.image && (
                    <div className={`relative ${client.user?.online ? 'online-icon' : ''}`}>
                        <Image
                            src={client.user?.image ?? 'https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free-thumbnail.png'}
                            alt='User image'
                            width={36}
                            height={36}
                            className='rounded-full'
                        />
                    </div>
                )}

                <p className="flex flex-col py-0.5 items-start space-y-1">
                    <span className='mr-1 block max-w-24 text-gray-200 text-base font-medium -mb-1.5
                    tracking-tight text-ellipsis overflow-x-clip'>
                        {client.user?.name}
                    </span>
                    <span className='mr-1 text-sm text-gray-200 inline-block'>
                        {client.user?.online ? 'Online' : 'Offline'}
                    </span>
                </p>
            </button>

            <button onClick={() => setMicActive((currentValue) => !currentValue)}
                className={`size-7 p-1 flex items-center justify-center relative rounded-lg hover:bg-zinc-900
                transition-all duration-100 ease-in-out ${!micActive ? 'inactive-icon text-red-600' : 'text-gray-300'}`}
            >
                <Mic />
            </button>

            <button onClick={() => setAudioActive((currentValue) => !currentValue)}
                className={`size-7 p-1 flex items-center justify-center relative rounded-lg hover:bg-zinc-900
                transition-all duration-100 ease-in-out ${!audioActive ? 'inactive-icon text-red-600' : 'text-gray-300'}`}
            >
                <Speaker />
            </button>

            <button className='size-7 p-1 flex items-center justify-center relative rounded-md hover:bg-zinc-900
            transition-all duration-100 ease-in-out text-gray-300'>
                <Gear className='w-full h-full' />
            </button>

            {menuOpen && (
                <button
                    className='absolute -top-12 -left-1 w-52 p-2 bg-gray-700 rounded-md shadow-md'
                    onClick={() => signOut()}
                >
                    <ChannelListMenuRow
                        name='Sign out'
                        icon={<LeaveServer />}
                        bottomBorder={false}
                        red
                    />
                </button>
            )}
        </div>
    )
}