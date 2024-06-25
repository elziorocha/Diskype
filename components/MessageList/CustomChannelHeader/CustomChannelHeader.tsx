import { useChannelStateContext } from 'stream-chat-react';

export default function CustomChannelHeader(): JSX.Element {

    const { channel } = useChannelStateContext();
    const { name } = channel?.data || {};

    return (
        <div className='flex text-gray-300 items-center space-x-2 p-3 border-b-2 border-b-gray-600'>
            <span className='text-3xl'>#</span>
            <span className='font-bold text-lg lowercase'>{name}</span>
        </div>
    );
}