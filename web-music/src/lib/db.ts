import { Pool } from 'pg';
import type { Song, Section, ChordProgression, Chord } from './types';
import { uuid } from 'uuidv4';

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


export class SongService {
    async getSongById(song_id: string): Promise<Song> {
        console.log("SongService - getSongById: ", song_id)
        const query = `SELECT song_id, title, key FROM songs WHERE song_id = '${song_id}';`;
        const { rows } = await pool.query(query);
        if (rows.length > 0) {
            return rows[0] as Song;
        } else {
            throw new Error('Song not found');
        }
    }
    async addSong(title: string, key: string, mode: string): Promise<string> {
        const song_id = uuid();
        const query = `INSERT INTO songs (song_id, title, key, mode) VALUES ('${song_id}', '${title}', '${key}', '${mode}');`;
        await pool.query(query);
        return song_id;
    }
    async updateSong(song_id: string, title: string, key: string, mode: string): Promise<void> {
        const query = `UPDATE songs SET title = '${title}', key = '${key}', mode = '${mode}', WHERE song_id = '${song_id}';`;
        await pool.query(query);
    }

    async saveOrUpdateSong(song : Song): Promise<string> {
        console.log("SongService - saveOrUpdateSong: ", song)
        const isNewSong = !song.song_id;
        const song_id = song.song_id || uuid();
        try {
            await pool.query('BEGIN');
            // Upsert the song
            let songQuery = `INSERT INTO songs (song_id, title, key, mode) VALUES ('${song.song_id}', '${song.title}', '${song.key}', '${song.mode}') 
                             ON CONFLICT (song_id) DO UPDATE SET title = EXCLUDED.title, key = EXCLUDED.key, mode = EXCLUDED.mode;`;
            console.log(songQuery)
            await pool.query(songQuery);

            // Process each section
            for (const section of song.sections) {
                let section_id = section.section_id || uuid();
                let sectionQuery = `INSERT INTO sections (section_id, song_id, order_in_song, name) VALUES ('${section_id}', '${song_id}', ${section.order_in_song}, '${section.name}') 
                                    ON CONFLICT (section_id) DO UPDATE SET song_id = EXCLUDED.song_id, order_in_song = EXCLUDED.order_in_song, name = EXCLUDED.name;`;
                console.log(sectionQuery)
                await pool.query(sectionQuery);

                // Process each chord progression
                for (const [index, chordProgression] of section.progressions.entries()) {
                    console.log("Index", index, " Chord Progression: ", chordProgression)
                    let progression_id = chordProgression.progression_id || uuid();
                    let progressionQuery = `INSERT INTO chord_progressions (progression_id) VALUES ('${progression_id}')
                                             ON CONFLICT (progression_id) DO NOTHING;`;
                    console.log(progressionQuery)
                    await pool.query(progressionQuery);

                    let sectionProgressionQuery = `INSERT INTO section_progressions (section_id, progression_id, order_in_section) VALUES ('${section_id}', '${progression_id}', ${index}) 
                                                   ON CONFLICT (section_id, progression_id) DO UPDATE SET order_in_section = EXCLUDED.order_in_section;`;
                    console.log(sectionProgressionQuery)
                    await pool.query(sectionProgressionQuery);

                    // Process each chord
                    for (const [index, chord] of chordProgression.chords.entries()) {
                        let chordQuery = `INSERT INTO progression_chords (progression_id, chord_id, order_in_progression) VALUES ('${progression_id}', ${chord.chord_id}, ${index}) 
                                          ON CONFLICT (progression_id, chord_id, order_in_progression) DO UPDATE SET order_in_progression = EXCLUDED.order_in_progression;`;
                        console.log(chordQuery)
                        await pool.query(chordQuery);
                    }
                }
            }

            await pool.query('COMMIT');
            return song_id;
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
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
    async addSection(song_id: string, order_in_song: number, name: string): Promise<string> {
        const section_id = uuid();
        const query = `INSERT INTO sections (section_id, song_id, order_in_song, name) VALUES ('${section_id}', '${song_id}', ${order_in_song}, '${name}');`;
        await pool.query(query);
        return section_id;
    }
    async updateSection(section_id: string, song_id: string, order_in_song: number, name: string): Promise<void> {
        const query = `UPDATE sections SET song_id = '${song_id}', order_in_song = ${order_in_song}, name = '${name}' WHERE section_id = '${section_id}';`;
        await pool.query(query);
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
    async addChordProgression(): Promise<string> {
        const progression_id = uuid();
        const query = `INSERT INTO chord_progressions (progression_id) VALUES ('${progression_id}');`;
        await pool.query(query);
        return progression_id;
    }

    async addChordToProgression(progression_id: string, chord_id: number, order_in_progression: number): Promise<void> {
        const query = `INSERT INTO progression_chords (progression_id, chord_id, order_in_progression) VALUES ('${progression_id}', ${chord_id}, ${order_in_progression});`;
        await pool.query(query);
    }
    async updateProgressionChord(progression_id: string, chord_id: number, order_in_progression: number): Promise<void> {
        const query = `UPDATE progression_chords SET order_in_progression = ${order_in_progression} WHERE progression_id = '${progression_id}' AND chord_id = ${chord_id};`;
        await pool.query(query);
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
        console.log("ChordsService - query: ", query)
        const { rows } = await pool.query(query);
        const output_raw = rows
        console.log("ChordsService - output raw: ", output_raw)
        rows.map((row: any) => { row.chord_id = row.chord_id.toString(); row.progression_id = row.progression_id.toString(); return row; });
        return rows as Chord[];
    }
    async addChord(degree: string, chord_type: string, bass_note: string, extension: string, additional: string): Promise<number> {
        const query = `INSERT INTO chords (degree, chord_type, bass_note, extension, additional) VALUES ('${degree}', '${chord_type}', '${bass_note}', '${extension}', '${additional}') RETURNING chord_id;`;
        const { rows } = await pool.query(query);
        return rows[0].chord_id;
    }
    async updateChord(chord_id: number, degree: string, chord_type: string, bass_note: string, extension: string, additional: string): Promise<void> {
        const query = `UPDATE chords SET degree = '${degree}', chord_type = '${chord_type}', bass_note = '${bass_note}', extension = '${extension}', additional = '${additional}' WHERE chord_id = ${chord_id};`;
        await pool.query(query);
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
        let progressions_set: string = ``;
        if (chordProgressions.length > 0) {
            progressions_set = `'${chordProgressions.map(p => p.progression_id).join("','")}'`;        }
        let chords: any[] = [];
        if (progressions_set.length > 0) {
            chords = await chordsService.getChordsForProgressions(progressions_set); // Fix: Join the progressions_set with a comma
        }

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
