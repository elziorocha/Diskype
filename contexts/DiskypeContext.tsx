'use client';

import { DiskypeServer } from '@/models/DiskypeServer';
import { createContext, useCallback, useContext, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { v4 as uuid } from 'uuid';

type DiskypeState = {
    server?: DiskypeServer;
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
    changeServer:() => {},
    createServer:() => {},
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
            setMyState((myState) => {
                return {...myState, server};
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
        changeServer: changeServer,
        createServer: createServer,
    };

    return (
        <DiskypeContext.Provider value={store}>{children}</DiskypeContext.Provider>
    );
};

export const useDiskypeContext = () => useContext(DiskypeContext);