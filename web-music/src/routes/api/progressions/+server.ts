import type { RequestHandler } from '@sveltejs/kit';
import Prisma, { type ChordProgression } from '@prisma/client';

const prisma = new Prisma.PrismaClient();

export const DELETE: RequestHandler = async ({ request }) => {
    console.log("Delete Chord Progression")
    try {
        const { chord_progression_id } = await request.json();
        console.log("Chord Progression ID", chord_progression_id)
        if (!chord_progression_id) {
            return new Response('Chord Progression ID is required', { status: 400 });
        }

        // Delete the song from the database
        await prisma.chordProgression.delete({
            where: { chord_progression_id },
        });

        return new Response('Song deleted successfully', {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting the song:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};