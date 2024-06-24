import { ListRowElement } from "./menuItems";

export default function ChannelListMenuRow({
    name,
    icon,
    bottomBorder = true,
    purple = false,
    red = false,
    reverseOrder = false,
}: ListRowElement): JSX.Element {
    return (
        <>
            <p className={`flex ${reverseOrder ? 'flex-row-reverse' : ''
                } justify-between items-center p-2 cursor-pointer text-neutral-300 ${purple ? 'text-violet-500' : ''
                } ${red ? 'text-rose-300 tracking-wide' : ''} rounded-md hover:bg-zinc-800 ${red ? 'hover:bg-red-500' : ''
                } hover:text-gray-200 transition-colors ease-in-out duration-200 ${purple ? 'hover:bg-violet-700' : ''}`}
            >
                <span className="text-sm font-bold">{name}</span>
                {icon}
            </p>
            {bottomBorder && <div className='my-1 mx-2 h-px bg-zinc-800' />}
        </>
    )
}