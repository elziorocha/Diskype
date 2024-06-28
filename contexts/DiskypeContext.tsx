'use client';

import { DiskypeServer } from '@/models/DiskypeServer';
import { MemberRequest, StreamVideoClient } from '@stream-io/video-react-sdk';
import { createContext, useCallback, useContext, useState } from 'react';
import { Channel, ChannelFilters, StreamChat } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react';
import { v4 as uuid } from 'uuid';

type DiskypeState = {
    server?: DiskypeServer;
    callId: string | undefined,
    channelsByCategories: Map<string, Array<Channel<DefaultStreamChatGenerics>>>;
    changeServer: (server: DiskypeServer | undefined, client: StreamChat) => void;
    createServer: (
        client: StreamChat,
        videoClient: StreamVideoClient,
        name: string,
        imageUrl: string,
        userIds: string[]
    ) => void;
    createChannel: (
        client: StreamChat,
        name: string,
        category: string,
        userIds: string[]
    ) => void;
    createCall: (
        client: StreamVideoClient,
        server: DiskypeServer,
        channelName: string,
        userIds: string[],
    ) => Promise<void>;
    setCall: (callId: string | undefined) => void;
};

const initialValue: DiskypeState = {
    server: undefined,
    callId: undefined,
    channelsByCategories: new Map(),
    changeServer: () => { },
    createServer: () => { },
    createChannel: () => { },
    createCall: async () => { },
    setCall: () => { },
};

const DiskypeContext = createContext<DiskypeState>(initialValue);

export const DiskypeContextProvider: any = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [myState, setMyState] = useState<DiskypeState>(initialValue);

    interface ChannelData {
        server?: string;
        category?: string;
    }
    
    interface CustomData {
        custom?: {
            serverId?: string;
            serverName?: string;
            callName?: string;
        };
        members: MemberRequest[];
    }

    const changeServer = useCallback(
        async (server: DiskypeServer | undefined, client: StreamChat) => {
            let filters: ChannelFilters = {
                type: 'messaging',
                members: { $in: [client.userID as string] },
            };
            if (!server) {
                filters.member_count = 2;
            }
    
            console.log(
                '[DiscordContext - loadServerList] Querying channels for ',
                client.userID
            );
            const channels = await client.queryChannels(filters);
            const channelsByCategories = new Map<
                string,
                Array<Channel<DefaultStreamChatGenerics>>
            >();
            if (server) {
                const categories = new Set<string>();
    
                channels.forEach((channel) => {
                    const channelData = channel.data?.data as ChannelData;
                    if (channelData.server === server.name) {
                        categories.add(channelData.category || 'Uncategorized');
                    }
                });
    
                for (const category of Array.from(categories)) {
                    channelsByCategories.set(
                        category,
                        channels.filter((channel) => {
                            const channelData = channel.data?.data as ChannelData;
                            return (
                                channelData.server === server.name &&
                                channelData.category === category
                            );
                        })
                    );
                }
            } else {
                channelsByCategories.set('Direct Messages', channels);
            }
            setMyState((myState) => ({
                ...myState,
                server,
                channelsByCategories,
            }));
        },
        [setMyState]
    );

    const createCall = useCallback(
        async (
            client: StreamVideoClient,
            server: DiskypeServer,
            channelName: string,
            userIds: string[]
        ) => {
            const callId = uuid()
            const audioCall = client.call('default', callId);
            const audioChannelMembers: MemberRequest[] = userIds.map((userId) => {
                return {
                    user_id: userId,
                };
            });
            try {
                const createdAudioCall = await audioCall.create({
                    data: {
                        custom: {
                            serverId: server?.id,
                            serverName: server?.name,
                            callName: channelName,
                        },
                        members: audioChannelMembers,
                    },
                });
                console.log(
                    `[DiskypeContext] Created Call with id: ${createdAudioCall.call.id}`
                );
            } catch (err) {
                console.log(err);
            }
        },
        []
    );

    const createServer = useCallback(
        async (
            client: StreamChat,
            videoClient: StreamVideoClient,
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
                const server: DiskypeServer = {
                    id: serverId,
                    name: name,
                    image: imageUrl,
                };
                    await createCall(
                        videoClient,
                        server,
                        'General Voice Channel',
                        userIds
                    );
            } catch (err) {
                console.log(err);
            }
        },
        [createCall]
    );

    const createChannel = useCallback(
        async (
            client: StreamChat,
            name: string,
            category: string,
            userIds: string[]
        ) => {
            if (client.userID) {
                const channel = client.channel('messaging', uuid(), {
                    name: name,
                    members: userIds,
                    data: {
                        image: myState.server?.image,
                        serverId: myState.server?.id,
                        server: myState.server?.name,
                        category: category,
                    },
                });
                try {
                    const response = await channel.create();
                    console.log('[DiskypeContext - createChannel] Response: ', response);
                } catch (err) {
                    console.log(err);
                }
            }
        },
        [myState.server]
    );

    const setCall = useCallback(
        (callId: string | undefined) => {
            setMyState((myState) => {
                return { ...myState, callId };
            });
        },
        [setMyState]
    );

    const store: DiskypeState = {
        server: myState.server,
        callId: myState.callId,
        channelsByCategories: myState.channelsByCategories,
        changeServer: changeServer,
        createServer: createServer,
        createChannel: createChannel,
        createCall: createCall,
        setCall: setCall,
    };

    return (
        <DiskypeContext.Provider value={store}>{children}</DiskypeContext.Provider>
    );
};

export const useDiskypeContext = () => useContext(DiskypeContext);