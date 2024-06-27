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
            <div>Loading...</div>
        )
    }

    return (
        <StreamTheme>
            <h2 className='flex items-center justify-center py-3 w-full font-semibold text-gray-200'>
                Participants: {participantCount}
            </h2>
            <SpeakerLayout participantsBarPosition='bottom'/>
            <CallControls onLeave={() => {
                setCall(undefined);
            }} />
        </StreamTheme>
    )
}