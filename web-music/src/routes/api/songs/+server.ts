import type { RequestHandler } from '@sveltejs/kit';
import Prisma, { type SongSection } from '@prisma/client';
import { updated } from '$app/stores';

const prisma = new Prisma.PrismaClient();

export const GET: RequestHandler = async () => {
    try {
        // Retrieve all songs with their related sections and progressions
        const songs = await prisma.song.findMany({
            include: {
                sections: {
                    include: {
                        progressions: true,
                    },
                },
            },
        });
        return new Response(JSON.stringify(songs), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching songs:', error);
        return new Response('Internal Server Error', { status: 500 });

    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse the request body and create a new song
        const newSongData = await request.json();
        newSongData.sections = {}
        console.log("New Song Data", newSongData)
        const newSong = await prisma.song.create({
            data: newSongData,
        });
        return new Response(JSON.stringify(newSong), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error creating a new song:', error);
        return new Response('Internal Server Error', { status: 500 });

    }
};

export const PATCH: RequestHandler = async ({ request }) => {
    try {
        // Parse the request body and create a new song
        let updatedSongData = await request.json();
        updatedSongData.sections.updateMany = updatedSongData.sections
        // updatedSongData.sections = {}
        console.log("Update Song Data", updatedSongData)
        const updatedSong = await prisma.song.update({
            data: {
                song_id: updatedSongData.song_id,
                title: updatedSongData.title,
                song_key: updatedSongData.song_key,
                song_mode: updatedSongData.song_mode,
            },
            where: {
                song_id: updatedSongData.song_id,
            }
        });
        updatedSongData.sections.forEach(async (section: any) => {
            console.log("Section", section)
            const updatedSection = await prisma.songSection.upsert({
                update: {
                    name: section.name,
                },
                create: {
                    name: section.name,
                    song_id: updatedSong.song_id,
                    section_order: section.section_order,
                },
                where: {
                    section_id: section.section_id,
                }
            });
            console.log("Updated Section", updatedSection)
            if (!section.progressions) {
                return
            }
            section.progressions.forEach(async (progression: any) => {
                console.log("Progression", progression)
                const updatedProgression = await prisma.chordProgression.upsert({
                    update: {
                        chord_input: progression.chord_input,
                        key: progression.key,
                        mode: progression.mode,
                        progression_order: progression.progression_order,
                    },
                    create: {
                        chord_input: progression.chord_input,
                        key: progression.key,
                        mode: progression.mode,
                        section_id: updatedSection.section_id,
                        progression_order: progression.progression_order,
                    },
                    where: {
                        chord_progression_id: progression.chord_progression_id,
                    }
                });
                console.log("Updated Progression", updatedProgression)
            });
        });
        return new Response(JSON.stringify(updatedSong), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error creating a new song:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { song_id } = await request.json();
        if (!song_id) {
            return new Response('Song ID is required', { status: 400 });
        }

        // Delete the song from the database
        await prisma.song.delete({
            where: { song_id },
        });

        return new Response('Song deleted successfully', {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting the song:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};