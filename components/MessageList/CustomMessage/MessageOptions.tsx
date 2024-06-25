
import { ArrowUturnLeft, Emoji, Thread } from '@/components/Icons';
import { Dispatch, SetStateAction } from 'react';

export default function MessageOptions({
    showEmojiReactions,
}: {
    showEmojiReactions: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
    return (
        <div className='absolute flex items-center -top-4 right-2 p-1 space-x-2 rounded-md bg-zinc-800 border-2 border-gray-700'>
            <button
                className='p-0.5 rounded transition-colors duration-200 ease-in-out hover:bg-zinc-700'
                onClick={() => showEmojiReactions((currentValue) => !currentValue)}
            >
                <Emoji className='w-6 h-6 p-0.5 text-amber-400' />
            </button>
            <button className='p-0.5 rounded transition-colors duration-200 ease-in-out hover:bg-zinc-700'>
                <ArrowUturnLeft className='w-6 h-6 p-0.5' />
            </button>
            <button className='p-0.5 rounded transition-colors duration-200 ease-in-out hover:bg-zinc-700'>
                <Thread className='w-6 h-6 p-0.5 text-violet-500' />
            </button>
        </div>
    );
}