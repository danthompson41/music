import type { RequestHandler } from '@sveltejs/kit';
import { getSongDetails } from '$lib/db'; // Import your database function
import { SongService } from '$lib/db';
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

// Define the PUT request handler to create a new song
export const POST: RequestHandler = async ({ request }) => {
    try {
        const songService = new SongService();
        const songData = await request.json(); // Expecting { title, key, mode }
        console.log("Song Data", songData)
        // Validate the incoming data as needed
        if (!songData.title || !songData.key) {
            return new Response('Missing required song fields', { status: 400 });
        }

        const newSongId = await songService.saveOrUpdateSong(songData);

        return new Response(JSON.stringify({ message: 'Song created successfully', song_id: newSongId }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error creating song:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};