import type { RequestHandler } from '@sveltejs/kit';
import Prisma, { type ChordProgression } from '@prisma/client';

const prisma = new Prisma.PrismaClient();

export const DELETE: RequestHandler = async ({ request }) => {
    console.log("Delete Section Progression")
    try {
        const { section_id } = await request.json();
        console.log("Section ID", section_id)
        if (!section_id) {
            return new Response('Section ID is required', { status: 400 });
        }

        // Delete the song from the database
        await prisma.songSection.delete({
            where: { section_id },
        });

        return new Response('Section deleted successfully', {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting the Section:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};