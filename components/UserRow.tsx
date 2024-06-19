import { UserObject } from '@/models/UserObject';
import Image from 'next/image';
import { PersonIcon } from './Icons';

export default function UserRow({
    user,
    userChanged,
}: {
    user: UserObject;
    userChanged: (user: UserObject, checked: boolean) => void;
}): JSX.Element {
    return (
        <div className='flex items-center justify-start w-full space-x-1 my-2'>
            <input id={user.id} type='checkbox' name={user.id} className='size-6 mb-0'
            onChange={(event) => {userChanged(user, event.target.checked);}}/>
            <label htmlFor="users" className='w-full p-2 flex items-center space-x-2'>
                {user.image && (
                    <Image src={user.image} width={40} height={40} alt={user.name} className='size-10 rounded-full'/>
                )}
                {!user.image && <PersonIcon />}
                <p className='flex flex-col'>
                    <span className='block text-gray-600 font-semibold'>{user.name}</span>
                    {user.lastOnLine && (
                        <span className='text-sm text-gray-600'>
                            Last online: {user.lastOnLine.split('T')[0]}
                        </span>
                    )}
                </p>
            </label>
        </div>
    )
}