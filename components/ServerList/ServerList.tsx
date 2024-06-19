import { DiskypeServer } from '@/models/DiskypeServer';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import CreateServerForm from './CreateServerForm';

export default function ServerList(): JSX.Element {
    const [activeServer, setActiveServer] = useState<DiskypeServer | undefined>();

    const servers: DiskypeServer[] = [
        {
            id: '1',
            name: 'Test Server 1',
            image: 'https://yt3.googleusercontent.com/v-E0zKEhzTKVF46HdajT4pq-o1NTkeyD03VO5QeOGeTySwx0tehIevbkaOLpThYFgyznRkPuYw=s900-c-k-c0x00ffffff-no-rj'
        },
        {
            id: '2',
            name: 'Test Server 2',
            image: 'https://steamuserimages-a.akamaihd.net/ugc/2044121906874842494/2602B8BEDC80563B7DCEC6BFCE1F0A1DA7AB33F8/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        },
        {
            id: uuid(),
            name: 'Test Server 3',
            image: 'https://img.wattpad.com/0d41e713318f8f62d251890799321438036dd6a1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f6367716f554161356263657338513d3d2d3832383039343532302e313565613335346539616437316535313832363937363937303639312e6a7067'
        },
    ];

    return (
        <div className="bg-dark-gray h-full flex flex-col items-center">
            {servers.map((server) => (
                <button
                    key={server.id}
                    className={`my-2 px-1 sidebar-icon ${server.id === activeServer?.id ? 'selected-icon' : ''}`}
                    onClick={() => setActiveServer(server)}
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
            className='flex items-center justify-center rounded-icon bg-gray-200 p-2 my-2 text-2xl font-semibold size-12
            text-green-500 hover:bg-green-500 hover:text-white hover:rounded-xl transition-all duration-200'>
                <span className='flex items-center justify-center inline-block'>+</span>
            </Link>
            <CreateServerForm/>
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