import { useDiskypeContext } from "@/contexts/DiskypeContext"
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";

export default function CallList(): JSX.Element {

    const { server, callId, setCall } = useDiskypeContext();
    const client = useStreamVideoClient();

    const [isOpen, setIsOpen] = useState<boolean>(true);

    return (
        <div></div>
    )
}