import { useState } from "react";
import { Channel } from "stream-chat";
import { DefaultStreamChatGenerics } from "stream-chat-react";
import { ChevronDown, PlusIcon } from "../Icons";
import Link from "next/link";
import CustomChannelPreview from "./CustomChannelPreview";

type CategoryItemProps = {
    category: string;
    channels: Channel<DefaultStreamChatGenerics>[];
    serverName: string;
};

export default function CategoryItem({
    category,
    serverName,
    channels,
}: CategoryItemProps): JSX.Element {

    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-2">
            <div className="flex items-center text-gray-200 p-2">
                <button onClick={() => setIsOpen((currentValue) => !currentValue)}
                    className='flex w-full items-center justify-start'>
                    <div className={`${isOpen ? '' : '-rotate-90'} transition-all ease-in-out duration-200`}>
                        <ChevronDown/>
                    </div>
                    <span className="inline-block uppercase text-sm font-bold px-2">{category}</span>
                </button>
                <Link href={`/?createChannel=true&serverName=${serverName}&category=${category}`}
                    className="inline-block create-button">
                    <PlusIcon />
                </Link>
            </div>

            <div>
                {isOpen && (
                    <div>
                        {channels.map((channel) => {
                            return (
                                <CustomChannelPreview
                                    key={channel.id}
                                    channel={channel}
                                    className='w-full'
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}