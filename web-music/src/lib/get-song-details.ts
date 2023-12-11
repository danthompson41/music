export async function getSongDetails(songId: string) {
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