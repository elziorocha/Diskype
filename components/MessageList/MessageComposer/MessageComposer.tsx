import {
    Emoji,
    GIF,
    PlusCircle,
    Present
} from '@/components/Icons'
import { useState } from 'react';
import { SendButton, useChatContext } from 'stream-chat-react';
import { plusItems } from './plusItems';
import ChannelListMenuRow from '@/components/ChannelList/TopBar/ChannelListMenuRow';

export default function MessageComposer(): JSX.Element {

    const [plusMenuOpen, setPlusMenuOpen] = useState(false);
    const { channel } = useChatContext();
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim() === '') return;
        channel?.sendMessage({ text: message });
        setMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className='flex mx-6 my-6 px-4 py-2 bg-zinc-700 items-center justify-center space-x-3 rounded-lg text-gray-600 relative'>
            <button onClick={() => setPlusMenuOpen((menuOpen) => !menuOpen)}>
                <PlusCircle className='size-8 text-gray-400 hover:text-gray-300' />
            </button>
            {plusMenuOpen && (
                <div className='absolute p-2 z-10 -left-5 bottom-12'>
                    <div className='bg-zinc-800 p-2 shadow-lg rounded-lg w-40 flex flex-col'>
                        {plusItems.map((option) => (
                            <button
                                key={option.name}
                                className=''
                                onClick={() => setPlusMenuOpen(false)}
                            >
                                <ChannelListMenuRow {...option} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <input
                className='border-transparent bg-transparent outline-none text-sm font-semibold m-0 text-gray-300'
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Message #general'
            />
            <Present className='size-8 text-gray-400 hover:text-gray-300' />
            <GIF className='size-8 text-gray-400 hover:text-gray-300' />
            <Emoji className='size-8 text-gray-400 hover:text-gray-300' />
            <SendButton className='text-gray-400 hover:text-gray-300'
                sendMessage={handleSendMessage}
            />
        </div>
    );
}
