import { getAllSongs } from "$lib/db";
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    let response = await getAllSongs();
	return json(response)
}