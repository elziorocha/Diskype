import Image from 'next/image';
import { useState } from 'react';
import { ReactionSelector, ReactionsList, useMessageContext } from 'stream-chat-react';
import MessageOptions from './MessageOptions';

export default function CustomMessage(): JSX.Element {

    const { message } = useMessageContext();
    const [showOptions, setShowOptions] = useState(false);
    const [showReactions, setShowReactions] = useState(false);

    return (
        <div onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)}
        className='flex relative space-x-2 p-3 items-center rounded-md transition-colors ease-in-out
        duration-200 hover:bg-zinc-900'>
            <Image
                src={message.user?.image || 'https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free-thumbnail.png'}
                alt='User avatar'
                width={40}
                height={40}
                className='rounded-full aspect-square object-cover size-10' />
            <div>
                {showOptions && (
                    <MessageOptions showEmojiReactions={setShowReactions} />
                )}
                {showReactions && (
                    <div className='absolute'>
                        <ReactionSelector/>
                    </div>
                )}
                <div className='space-x-2'>
                    <span className='font-semibold text-base text-gray-200'>{message.user?.username}</span>
                    {message.updated_at && (
                        <span className='text-xs text-gray-300'>{formatDate(message.updated_at)}</span>
                    )}
                </div>
                <p className='text-base text-gray-300 font-semibold'>{message.text}</p>
                <ReactionsList/>
            </div>
        </div>
    );

    function formatDate(date: Date | string): string {
        if (typeof date === 'string') {
            return date;
        }
        return `${date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })}`;
    }
}