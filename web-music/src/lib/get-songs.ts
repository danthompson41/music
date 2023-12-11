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