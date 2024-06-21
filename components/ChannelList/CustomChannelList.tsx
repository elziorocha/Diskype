import { useDiskypeContext } from "@/contexts/DiskypeContext"
import ChannelListTopBar from "./TopBar/ChannelListTopBar";

export default function CustomChannelList(): JSX.Element {

    const { server } = useDiskypeContext();

    return(
        <div className="w-72 bg-zinc-900 h-full flex flex-col items-start">
            <ChannelListTopBar serverName={server?.name || 'Direct Messages'}/>
        </div>
    )
}