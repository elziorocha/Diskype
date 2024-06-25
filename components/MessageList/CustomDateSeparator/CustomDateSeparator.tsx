import { DateSeparatorProps } from "stream-chat-react";

export default function CustomDateSeparator(
    props: DateSeparatorProps
): JSX.Element {

    const { date } = props;

    function formatDate(date: Date): string {
        return `${date.toLocaleDateString('en-US', { dateStyle: 'long' })}`;
    }

    return (
        <div className="border-b-2 w-10/12 ml-auto mr-auto border-gray-600 relative flex items-center justify-center my-6">
            <span className='absolute left-auto right-auto text-sm font-semibold text-gray-400 bg-black px-3'>
                {formatDate(date)}
            </span>
        </div>
    )
}