import type { RequestHandler } from '@sveltejs/kit';
import { getSongDetails } from '$lib/db'; // Import your database function

// Define the GET request handler
export const GET: RequestHandler = async ({ params, url }) => {
    console.log(params)
    const songId = url.searchParams.get('song_id');

    try {
        const details = await getSongDetails(songId);
        if (details) {
            return new Response(JSON.stringify(details), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response('Not Found', { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching song details:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};