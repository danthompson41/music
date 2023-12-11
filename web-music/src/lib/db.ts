import { Pool } from 'pg';
import type { Song, Section, ChordProgression, Chord } from './interfaces';

// Initialize a new pool
const pool = new Pool({
	// Your database configuration
	user: 'postgres',
	host: 'localhost',
	database: 'danielthompson',
	password: '',
	port: 5432
});

export async function getAllSongs(): Promise<Song[]> {
	console.log('Fetching songs');
	try {
		const { rows } = await pool.query('SELECT * FROM songs');
		console.log('song fetch', rows);
		return rows as Song[];
	} catch (err) {
		console.error('Error querying database', err);
		throw err;
	}
}

let getSongDetailQuery =
	'SELECT' +
	'    c.degree,' +
	'    s.title,' +
	'    c.chord_type,' +
	'    c.bass_note,' +
	'    c.extension,' +
	'    c.additional,' +
	'    sec.name AS section_name' +
	' FROM' +
	'    songs s' +
	' JOIN sections sec ON s.song_id = sec.song_id' +
	' JOIN section_progressions sp ON sec.section_id = sp.section_id' +
	' JOIN chord_progressions cp ON sp.progression_id = cp.progression_id' +
	' JOIN progression_chords pc ON cp.progression_id = pc.progression_id' +
	' JOIN chords c ON pc.chord_id = c.chord_id' +
	' WHERE' +
	"    s.title = 'Sunrise Symphony'" +
	' ORDER BY' +
	'    sec.order_in_song,' +
	'    sp.order_in_section,' +
	'    pc.order_in_progression;' +
	'';


class SongService {
    async getSongById(song_id: string): Promise<Song> {
        console.log("SongService - getSongById: ", song_id)
        const query = `SELECT song_id, title, key, band_id FROM songs WHERE song_id = '${song_id}';`;
        const { rows } = await pool.query(query);
        if (rows.length > 0) {
            return rows[0] as Song;
        } else {
            throw new Error('Song not found');
        }
    }
}

class SectionsService {
    async getSectionsForSong(song_id: string): Promise<Section[]> {
        console.log("SectionsService - getSectionsForSong: ", song_id)
        const query = `SELECT section_id, order_in_song, name FROM sections WHERE song_id = '${song_id}' ORDER BY order_in_song;`;
        const { rows } = await pool.query(query);
        return rows as Section[];
    }
}

class ChordProgressionsService {
    async getChordProgressionsForSong(song_id: string): Promise<ChordProgression[]> {
        console.log("ChordProgressionsService - getChordProgressionsForSong: ", song_id)
        const query = `SELECT cp.progression_id, sp.section_id, sp.order_in_section
                       FROM chord_progressions cp
                       JOIN section_progressions sp ON cp.progression_id = sp.progression_id
                       JOIN sections sec ON sp.section_id = sec.section_id
                       WHERE sec.song_id = '${song_id}';`;
        const { rows } = await pool.query(query);
        const output = rows as ChordProgression[];
        console.log("ChordProgressionsService - output: ", output)
        return rows as ChordProgression[];
    }
}

class ChordsService {
    async getChordsForProgressions(progressions_set: string): Promise<Chord[]> {
        console.log("ChordsService - getChordsForProgressions: ", progressions_set)
        const query = `SELECT c.chord_id, c.degree, c.chord_type, c.bass_note, c.extension, c.additional, pc.order_in_progression, pc.progression_id
                       FROM chords c
                       JOIN progression_chords pc ON c.chord_id = pc.chord_id
                       WHERE pc.progression_id in (${progressions_set})
                       ORDER BY progression_id, order_in_progression;`;
        const { rows } = await pool.query(query);
        const output_raw = rows
        console.log("ChordsService - output raw: ", output_raw)
        rows.map((row: any) => { row.chord_id = row.chord_id.toString(); row.progression_id = row.progression_id.toString(); return row; });
        return rows as Chord[];
    }
}

export async function getSongDetails(song_id: string): Promise<Song> {
    const songService = new SongService();
    const sectionsService = new SectionsService();
    const chordProgressionsService = new ChordProgressionsService();
    const chordsService = new ChordsService();
    console.log('Fetching song details for song_id:', song_id)
    try {
        // Fetch the top-level details of the song
        let song = await songService.getSongById(song_id);

        // Fetch the sections for the song
        const sections = await sectionsService.getSectionsForSong(song_id);
        const chordProgressions = await chordProgressionsService.getChordProgressionsForSong(song_id);
        const progressions_set = `'${chordProgressions.map(p => p.progression_id).join("','")}'`;
        const chords = await chordsService.getChordsForProgressions(progressions_set);

        for (const section of sections) {
            section.chord_progressions = chordProgressions.filter(p => p.section_id === section.section_id);
            for (const chordProgression of chordProgressions) {
                chordProgression.chords = chords.filter(c => c.progression_id === chordProgression.progression_id);
            }
        }

        song.sections = sections;
        console.log(song)
        return song;
    } catch (err) {
        console.error('Error querying database', err);
        throw err;
    }
}
