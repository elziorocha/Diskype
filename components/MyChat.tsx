import { useClient } from '@/hooks/useClient';
import { User } from 'stream-chat';
import {
    Chat,
    Channel,
    ChannelList,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import ServerList from './ServerList/ServerList';
import CustomChannelList from './ChannelList/CustomChannelList';
import CustomDateSeparator from './MessageList/CustomDateSeparator/CustomDateSeparator';
import CustomChannelHeader from './MessageList/CustomChannelHeader/CustomChannelHeader';
import CustomMessage from './MessageList/CustomMessage/CustomMessage';
import MessageComposer from './MessageList/MessageComposer/MessageComposer';

export default function MyChat({
    apiKey,
    user,
    token,
}: {
    apiKey: string;
    user: User;
    token: string;
}) {
    const chatClient = useClient({
        apiKey,
        user,
        tokenOrProvider: token,
    });

    if (!chatClient) {
        return (
            <div className='flex justify-center items-center h-screen text-bold text-2xl'>
                Error, please try again later.
            </div>
        )
    }

    return (
        <Chat client={chatClient} theme='str-chat__theme-dark'>
            <section className='flex h-screen layout'>
                <ServerList />
                <ChannelList List={CustomChannelList}/>
                <Channel DateSeparator={CustomDateSeparator} HeaderComponent={CustomChannelHeader}
                Message={CustomMessage} Input={MessageComposer}>
                    <Window>
                        <MessageList />
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </section>
        </Chat>
    )
}
