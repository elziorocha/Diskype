import { CloseIcon } from "@/components/Icons";
import UserRow from "@/components/UserRow";
import { useDiskypeContext } from "@/contexts/DiskypeContext";
import { UserObject } from "@/models/UserObject";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChatContext } from "stream-chat-react";

type FormState = {
    channelName: string;
    category: string;
    users: UserObject[];
};

export default function CreateChannelForm(): JSX.Element {

    const params = useSearchParams();
    const showCreateChannelForm = params.get('createChannel');
    const category = params.get('category');
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    const { client } = useChatContext();
    const { createChannel } = useDiskypeContext();
    const initialState: FormState = {
        channelName: '',
        category: category ?? '',
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
                    image: user.image,
                    onLine: user.online,
                    lastOnLine: user.last_active,
                };
            });
        if (users) setUsers(users);
    }, [client]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        if (showCreateChannelForm && dialogRef.current) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [showCreateChannelForm]);

    return (
        <dialog ref={dialogRef} className="absolute bg-zinc-800 z-10 space-y-2 rounded-xl">
            <div className="w-full flex items-center justify-between py-8 px-6">
                <h2 className="text-3xl font-semibold text-gray-200">Create Channel</h2>
                <Link href='/'><CloseIcon className="size-9 text-gray-200 bg-gray-700 text-gray-200p-1.5 rounded hover:bg-gray-600" /></Link>
            </div>
            <form method="d ialog" className="flex flex-col space-y-4 px-6">

                <label htmlFor="channelName" className="labelTitle">Channel Name</label>
                <div className="flex items-center bg-gray-200 rounded-lg">
                    <span className="text-2xl py-2 pl-3 text-gray-600 font-bold">#</span>
                    <input type="text" id="channelName" name="channelName" value={formData.channelName}
                        onChange={(e) => setFormData({ ...formData, channelName: e.target.value })} />
                </div>

                <label htmlFor="category" className="labelTitle flex items-center justify-between">Category</label>
                <div className="flex items-center bg-gray-200 rounded-lg">
                    <span className="text-2xl py-2 pl-3 text-gray-600 font-bold">#</span>
                    <input type="text" id="category" name="category" value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>

                <div className="max-h-64 overflow-y-scroll">
                <h2 className="labelTitle">Add Users</h2>
                    {users.map((user) => (
                        <UserRow user={user} userChanged={userChanged} key={user.id} />
                    ))}
                </div>
            </form>

            <div className="flex space-x-6 items-center justify-between p-6 bg-gray-700">
                <Link href={'/'} className="font-semibold text-gray-200 py-2 px-3 bg-red-700 rounded-lg">Cancel</Link>
                <button type="submit" disabled={buttonDisabled()} onClick={createClicked}
                className={`bg-zinc-900 rounded-lg py-2 px-4 text-gray-200 font-semibold uppercase
                    ${buttonDisabled() ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    Create Channel
                </button>
            </div>
        </dialog>
    )

    function buttonDisabled(): boolean {
        return (
            !formData.channelName || !formData.category || formData.users.length <= 1
        );
    }

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
    }

    function createClicked() {
        createChannel(
            client,
            formData.channelName,
            formData.category,
            formData.users.map((user) => user.id)
        );
        setFormData(initialState);
        router.replace('/');
    }
}
