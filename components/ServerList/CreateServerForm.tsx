import Link from "next/link";
import { CloseIcon } from "../Icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserObject } from "@/models/UserObject";
import { useChatContext } from "stream-chat-react";
import UserRow from "../UserRow";
import { Router } from "next/router";
import { useDiskypeContext } from "@/contexts/DiskypeContext";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";

type FormState = {
    serverName: string;
    serverImage: string;
    users: UserObject[];
};

export default function CreateServerForm(): JSX.Element {

    const router = useRouter();
    const params = useSearchParams();
    const showCreateServerForm = params.get('createServer');
    const dialogRef = useRef<HTMLDialogElement>(null);

    const { client } = useChatContext();
    const videoClient = useStreamVideoClient();
    const { createServer } = useDiskypeContext();
    const initialState: FormState = {
        serverName: '',
        serverImage: '',
        users: [],
    };

    const [formData, setFormData] = useState<FormState>(initialState);
    const [users, setUsers] = useState<UserObject[]>([]);

    const loadUsers = useCallback(async () => {
        const response = await client.queryUsers({});
        const users: UserObject[] = response.users
            .filter((user) => user.role !== 'admin')
            .map((user) => {
                return {
                    id: user.id,
                    name: user.name ?? user.id,
                    image: user.image as string,
                    onLine: user.online,
                    lastOnLine: user.last_active,
                };
            });
        if (users) setUsers(users);
    }, [client]);

    useEffect(() => {
        if (showCreateServerForm && dialogRef.current) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showCreateServerForm]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <dialog className="absolute z-10 space-y-2 rounded-xl bg-zinc-800" ref={dialogRef}>
            <div className="w-full flex items-center justify-between py-8 px-6">
                <h2 className="text-3xl font-semibold text-gray-300">Create new Server</h2>
                <Link href='/' className="bg-gray-700 p-1.5 rounded hover:bg-gray-600"><CloseIcon /></Link>
            </div>
            <form method="dialog" className="flex flex-col space-y-6 px-6">
                <div className="flex flex-col">
                    <label htmlFor="serverName" className="labelTitle pb-2 ml-1">
                        Server Name
                    </label>
                    <div className="flex items-center bg-gray-200 rounded-lg">
                        <span className="text-2xl py-2 pl-3 text-gray-600 font-bold">#</span>
                        <input type="text" id="serverName" name="serverName" value={formData.serverName}
                            onChange={(e) => setFormData({ ...formData, serverName: e.target.value })} required />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="serverImage" className="labelTitle pb-2 ml-1">
                        Server Image
                    </label>
                    <div className="flex items-center bg-gray-200 rounded-lg">
                        <span className="text-2xl py-2 pl-3 text-gray-600 font-bold">#</span>
                        <input type="text" id="serverImage" name="serverImage" value={formData.serverImage}
                            onChange={(e) => setFormData({ ...formData, serverImage: e.target.value })} required />
                    </div>
                </div>
                <div className="max-h-64 overflow-y-scroll">
                    <h2 className="labelTitle ml-1">Add Users</h2>
                    {users.map((user) => (
                        <UserRow key={user.id} user={user} userChanged={userChanged} />
                    ))}
                </div>
            </form>
            <div className="flex flex-col py-4 px-6 bg-gray-700">
            <p className="text-red-600 font-medium self-end text-sm">{`It's necessary to restart the page`}</p>
                <div className="flex justify-between mt-1">
                    <Link href={'/'} className="font-semibold text-gray-200 py-2 px-3 bg-red-700 rounded-lg">Cancel</Link>
                    <button type="submit" disabled={buttonDisabled()} onClick={createClicked}
                    className={`bg-gray-800 rounded-lg py-2 px-4 text-gray-200 font-semibold uppercase
                    ${buttonDisabled() ? 'opacity-40 cursor-not-allowed' : ''}`}>Create Server</button>
                </div>
            </div>
        </dialog>
    );

    function userChanged(user: UserObject, checked: boolean) {
        if (checked) {
            setFormData({
                ...formData,
                users: [...formData.users, user],
            });
        } else {
            setFormData({
                ...formData,
                users: formData.users.filter((thisUser) => thisUser.id !== user.id),
            });
        }
    };

    function buttonDisabled(): boolean {
        return (
            !formData.serverName ||
            !formData.serverImage ||
            formData.users.length <= 1
        );
    };

    function createClicked() {
        if (!videoClient) {
            console.log('[CreateServerForm] Video client not available');
            return;
        }

        createServer(
            client,
            videoClient,
            formData.serverName,
            formData.serverImage,
            formData.users.map((user) => user.id)
        );
        setFormData(initialState);
        router.replace('/');
    }
}   