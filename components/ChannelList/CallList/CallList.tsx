import { ChevronDown, PlusIcon, Speaker } from "@/components/Icons";
import { useDiskypeContext } from "@/contexts/DiskypeContext"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function CallList(): JSX.Element {

    const { server, callId, setCall } = useDiskypeContext();
    const client = useStreamVideoClient();

    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [calls, setCalls] = useState<Call[]>([]);

    const loadAudioChannels = useCallback(async () => {
        const callRequest = await client?.queryCalls({
            filter_conditions: {
                'custom.serverName': server?.name || 'Test Server'
            },
            sort: [{ field: 'created_at', direction: 1 }],
            watch: true,
        });
        if (callRequest?.calls) {
            setCalls(callRequest?.calls);
        }
    }, [client, server])

    useEffect(() => {
        loadAudioChannels();
    }, [loadAudioChannels]);

    if (!server) {
        return <></>;
    }

    return (
        <div className="w-full my-2">
            <div className="flex text-gray-200 items-center mb-2 pr-2">
                <button onClick={() => setIsOpen((currentValue) => !currentValue)}
                    className="flex w-full items-center justify-start px-2">
                    <div className={`${isOpen ? '' : '-rotate-90'} transition-all ease-in-out duration-200`}>
                        <ChevronDown />
                    </div>
                    <h2 className="inline-block uppercase text-sm font-bold px-2">Voice Channels</h2>
                </button>
                <Link href={`/?createChannel=true&isVoice=true&category=Voice Channels`}>
                    <PlusIcon />
                </Link>
            </div>
            {isOpen && (
                <div className="px-2">
                    {calls.map((call) => (
                        <button key={call.id}
                            className='ml-6 w-[15.35rem] flex items-center my-1 px-2 py-1.5 hover:bg-zinc-800 rounded-md'
                            onClick={() => {
                                setCall(call.id);
                            }}>
                            <Speaker className='size-5 text-gray-200 mr-2' />
                            <span className={`text-sm ${call.id === callId ? 'font-bold' : ''}`}>
                                {call.state.custom.callName || 'Channel Preview'}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
