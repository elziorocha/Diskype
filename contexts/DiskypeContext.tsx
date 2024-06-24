'use client';

import { DiskypeServer } from '@/models/DiskypeServer';
import { createContext, useCallback, useContext, useState } from 'react';
import { Channel, ChannelFilters, StreamChat } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react';
import { v4 as uuid } from 'uuid';

type DiskypeState = {
    server?: DiskypeServer;
    channelsByCategories: Map<string, Array<Channel<DefaultStreamChatGenerics>>>;
    changeServer: (server: DiskypeServer | undefined, client: StreamChat) => void;
    createServer: (
        client: StreamChat,
        name: string,
        imageUrl: string,
        userIds: string[]
    ) => void;
};

const initialValue: DiskypeState = {
    server: undefined,
    channelsByCategories: new Map(),
    changeServer: () => { },
    createServer: () => { },
};

const DiskypeContext = createContext<DiskypeState>(initialValue);

export const DiskypeContextProvider: any = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [myState, setMyState] = useState<DiskypeState>(initialValue);

    const changeServer = useCallback(
        async (server: DiskypeServer | undefined, client: StreamChat) => {
            let filters: ChannelFilters = {
                type: 'messaging',
                members: { $in: [client.userID as string] },
            };
            if (!server) {
                filters.member_count = 2;
            }
            
            const channels = await client.queryChannels(filters);
            const channelsByCategories = new Map<
                string,
                Array<Channel<DefaultStreamChatGenerics>>
            >();

            if (server) {
                const categories = new Set(channels.filter((channel) => {
                    return channel.data?.data?.server === server.name;
                }).map((channel) => {
                    return channel.data?.data?.category;
                }))
                for (const category of Array.from(categories)) {
                    channelsByCategories.set(
                        category,
                        channels.filter((channel) => {
                            return (
                                channel.data?.data?.server === server.name &&
                                channel.data?.data?.category === category
                            )
                        })
                    )
                }
            } else {
                channelsByCategories.set('Direct Messages', channels);
            }
            setMyState((myState) => {
                return { ...myState, server, channelsByCategories };
            });
        },
        [setMyState]
    );

    const createServer = useCallback(
        async (
            client: StreamChat,
            name: string,
            imageUrl: string,
            userIds: string[]
        ) => {
            const serverId = uuid();
            const messagingChannel = client.channel('messaging', uuid(), {
                name: 'Welcome',
                members: userIds,
                data: {
                    image: imageUrl,
                    serverId: serverId,
                    server: name,
                    category: 'Text Channels',
                },
            });
            try {
                const response = await messagingChannel.create();
                console.log('[DiskypeContext - createServer] Response: ', response);
            } catch (err) {
                console.log(err);
            }
        },
        []
    );

    const store: DiskypeState = {
        server: myState.server,
        channelsByCategories: myState.channelsByCategories,
        changeServer: changeServer,
        createServer: createServer,
    };

    return (
        <DiskypeContext.Provider value={store}>{children}</DiskypeContext.Provider>
    );
};

export const useDiskypeContext = () => useContext(DiskypeContext);