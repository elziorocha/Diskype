import { DiskypeServer } from '@/models/DiskypeServer';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import CreateServerForm from './CreateServerForm';
import { useChatContext } from 'stream-chat-react';
import { Channel } from 'stream-chat';
import { useDiskypeContext } from '@/contexts/DiskypeContext';

export default function ServerList(): JSX.Element {

    const { client } = useChatContext();

    const { server: activeServer, changeServer } = useDiskypeContext();

    const [serverList, setServerList] = useState<DiskypeServer[]>([]);

    const loadServerList = useCallback(async (): Promise<void> => {
        const channels = await client.queryChannels({
            type: 'messaging',
            members: { $in: [client.userID as string] },
        });
        const serverSet: Set<DiskypeServer> = new Set(
            channels
                .map((channel: Channel) => {
                    return {
                        id: channel.data?.data?.id,
                        name: (channel.data?.data?.server as string) ?? 'Unknown',
                        image: channel.data?.data?.image,
                    };
                })
                .filter((server: DiskypeServer) => server.name !== 'Unknown')
                .filter(
                    (server: DiskypeServer, index, self) => index ===
                        self.findIndex((serverObject) => serverObject.name == server.name)
                )
        );
        const serverArray = Array.from(serverSet.values());
        setServerList(serverArray);

        if (serverArray.length > 0) {
            changeServer(serverArray[0], client);
        }
    }, [client, changeServer]);

    useEffect(() => {
        loadServerList();
    }, [loadServerList]);

    return (
        <div className="bg-[#272a30] h-full flex flex-col items-center border-r-[1px] border-zinc-700">
            <button onClick={() => changeServer(undefined, client)}
                className={`block p-3 aspect-square sidebar-icon ${activeServer === undefined ? 'selected-icon' : ''}`}
            >
                <div className='rounded-icon app-icon'></div>
            </button>
            <hr className='w-9/12 rounded border-2 border-zinc-900 mb-1'/>
            {serverList.map((server) => (
                <button
                    key={server.id}
                    className={`my-2 px-1 sidebar-icon ${server.id === activeServer?.id ? 'selected-icon' : ''}`}
                    onClick={() => changeServer(server, client)}
                >
                    {server.image && checkIfUrl(server.image)
                        ? (<Image src={server.image} width={50} height={50} className='rounded-icon' alt="Server Icon" />)
                        : (<span className='rounded-icon bg-gray-600 w-[50px] flex items-center justify-center text-sm'>
                            {server.name.charAt(0)}
                        </span>)}
                </button>
            ))}
            <Link
                href={'/?createServer=true'}
                className='flex items-center justify-center rounded-icon bg-gray-300 p-2 my-2 text-4xl size-12
            text-green-500 hover:bg-green-500 hover:text-gray-300 hover:rounded-xl transition-all duration-200'>
                <span className='flex items-center justify-center inline-block ml-[1px] mb-0.5'>+</span>
            </Link>
            <CreateServerForm />
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