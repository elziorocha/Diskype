import {
    ChannelPreviewUIComponentProps,
    useChatContext,
} from 'stream-chat-react';

const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {

    const { channel } = props;
    const { setActiveChannel } = useChatContext();

    return (
        <div className={`ml-8 flex items-center mx-2 ${props.channel.countUnread() > 0 ? 'channel-container' : ''}`}>
            <button onClick={() => setActiveChannel(channel)}
            className='w-full flex items-center px-2 py-0.5 hover:bg-zinc-800 rounded-md'>
                <span className='italic text-xl mr-2 font-semibold text-gray-500'>#</span>
                <span className='text-sm text-gray-200 font-semibold'>{channel.data?.name || 'Channel Preview'}</span>
            </button>
        </div>
    );
};

export default CustomChannelPreview;