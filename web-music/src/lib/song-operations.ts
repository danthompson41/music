import type { Song } from "./types";

export async function getSongs() {
    const response = await fetch('/api/get-songs', {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    });
    let answer = await response.json();
    console.log("Got songs: ", answer)
    return answer
}

export async function getSong(songId: string) {
    let songDetails: Song | null = null;
    let error = '';
    console.log("Trying to fetch a song: ", `/api/song?song_id=${songId}`)
    try {
        const response = await fetch(`/api/song?song_id=${songId}`);
        if (response.ok) {
            songDetails = await response.json();
            return songDetails
        } else {
            error = 'Failed to load song details.';
        }
    } catch (err) {
        error = 'An error occurred while fetching song details.';
        return error
    }
}

export async function addSong(songData: Song) {
    let responseMessage: string = '';
    let error: string = '';
    console.log("Trying to add a new song: ", songData.song_id);

    try {
        const response = await fetch('/api/song', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(songData)
        });

        if (response.ok) {
            const result = await response.json();
            responseMessage = result.message;
            return { message: responseMessage, songId: result.song_id as string };
        } else {
            error = 'Failed to add new song.';
            return { error };
        }
    } catch (err) {
        error = 'An error occurred while adding the new song.';
        return { error };
    }
}

export async function updateSong(songData: Song) {
    const response = await fetch(`/api/song?song_id=${songData.song_id}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(songData)
    });
    let answer = await response.json();
    console.log("add song: ", answer)
    return answer
}