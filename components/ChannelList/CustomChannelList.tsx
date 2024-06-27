import { useDiskypeContext } from "@/contexts/DiskypeContext"
import ChannelListTopBar from "./TopBar/ChannelListTopBar";
import CategoryItem from "./CategoryItem";
import ChannelListBottomBar from "./BottomBar/ChannelListBottomBar";
import CreateChannelForm from "./CreateChannelForm/CreateChannelForm";
import CallList from "./CallList/CallList";

export default function CustomChannelList(): JSX.Element {

    const { server, channelsByCategories } = useDiskypeContext();

    const isDirectMessages = !server;

    return (
        <div className="w-72 bg-zinc-900 h-full flex flex-col items-start">
            <ChannelListTopBar serverName={server?.name || 'Direct Messages'} serverImage={server?.image}/>

            <div className="w-full">
                {!isDirectMessages && Array.from(channelsByCategories.keys()).map((category, index) => (
                    <CategoryItem
                        key={`${category}-${index}`}
                        category={category}
                        serverName={server?.name || 'Direct Messages'}
                        channels={channelsByCategories.get(category) || []} />
                ))}
            </div>
                
            <CallList/>
            <CreateChannelForm />
            <ChannelListBottomBar />
        </div>
    )
}