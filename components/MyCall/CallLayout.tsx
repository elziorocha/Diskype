import { useDiskypeContext } from '@/contexts/DiskypeContext';
import { CallingState } from '@stream-io/video-client';
import { CallControls, SpeakerLayout, StreamTheme, useCallStateHooks } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

export default function CallLayout(): JSX.Element {

    const { setCall } = useDiskypeContext();
    const { useCallCallingState, useParticipantCount } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participantCount = useParticipantCount();

    if (callingState !== CallingState.JOINED) {
        return (
            <div className='flex items-center justify-center'>Loading...</div>
        )
    }

    return (
        <StreamTheme>
            <h2 className='mb-1 flex items-center justify-center ml-auto mr-auto py-3 w-5/12 bg-zinc-900
            text-gray-300 font-semibold rounded-b-full'>
                Participants: {participantCount}
            </h2>
            <SpeakerLayout participantsBarPosition='bottom'/>
            <CallControls onLeave={() => {
                setCall(undefined);
            }} />
        </StreamTheme>
    )
}