import { StreamVideoClient } from '@stream-io/video-client';
import { useEffect, useState } from 'react';
import { UseClientOptions } from './useClient';

export const useVideoClient = ({
    apiKey,
    user,
    tokenOrProvider,
}: UseClientOptions): StreamVideoClient | undefined => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();

    useEffect(() => {
        const streamVideoClient = new StreamVideoClient({ apiKey });
        let didUserConnectInterrupt = false;

        const videoConnectionPromise = streamVideoClient.connectUser(user, tokenOrProvider).then(() => {
            if (!didUserConnectInterrupt) {
                setVideoClient(streamVideoClient);
            }
        })

        return () => {
            didUserConnectInterrupt = true;
            setVideoClient(undefined);
            videoConnectionPromise.then(() => streamVideoClient.disconnectUser()).then(() => {
                console.log('Video connection closed');
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should re-run only if user.id changes
    }, [apiKey, user.id, tokenOrProvider])

    return videoClient;
}