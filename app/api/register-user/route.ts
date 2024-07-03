import { clerkClient } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

export async function POST(request: Request) {
    const apiKey = process.env.STREAM_API_KEY;
    const streamSecret = process.env.STREAM_SECRET;

    if (!apiKey || !streamSecret) {
        return new Response('Missing Stream API key or secret', { status: 500 });
    }

    const serverClient = StreamChat.getInstance(apiKey, streamSecret);
    const body = await request.json();
    console.log('[/api/register-user] Body:', body);

    const userId = body?.userId;
    const email = body?.email;

    if (!userId || !email) {
        return new Response('Missing userId or email', { status: 400 });
    }

    try {
        const clerkUser = await clerkClient.users.getUser(userId);

        if (!clerkUser) {
            return new Response('Clerk user not found', { status: 404 });
        }

        const user = await serverClient.upsertUser({
            id: userId,
            role: 'user',
            name: email,
            username: clerkUser.username || '',
            image: `https://getstream.io/random_png/?id=${userId}&name=${email}`,
        });

        const params = {
            publicMetadata: {
                streamRegistered: true,
            },
        };
        const updatedUser = await clerkClient.users.updateUser(userId, params);

        console.log('[/api/register-user] User:', updatedUser);

        const response = {
            userId: userId,
            userName: clerkUser.username || email,
        };

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}
