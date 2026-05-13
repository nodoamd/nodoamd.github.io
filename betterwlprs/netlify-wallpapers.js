// BetterWLPRS — Netlify Hosted Image Data
// Loads filenames from manifest.json to get exact names + extensions

const NETLIFY_BASE = 'https://cheery-frangollo-ed0131.netlify.app/';

// Metadata keyed by manifest key.
// media: 'game' | 'movie'
const gameMetadata = {

    // GAMES
    'AC-Odissey': { display: 'AC Odyssey', media: 'game', moods: ['landscape', 'ambience'] },
    'Alien-Isolation': { display: 'Alien Isolation', media: 'game', moods: ['moody', 'interiors'] },
    'ARC-Raiders': { display: 'ARC Raiders', media: 'game', moods: ['moody', 'cyberpunk'] },
    'Batman-Arkham-Knight': { display: 'Batman Arkham Knight', media: 'game', moods: ['moody', 'rainy', 'cyberpunk'] },
    'Battlefront-2': { display: 'Battlefront 2', media: 'game', moods: ['landscape', 'ambience'] },
    'Cairn': { display: 'Cairn', media: 'game', moods: ['landscape', 'ambience'] },
    'Crimson-Desert': { display: 'Crimson Desert', media: 'game', moods: ['landscape', 'moody'] },
    'Death-Stranding': { display: 'Death Stranding', media: 'game', moods: ['landscape', 'ambience', 'moody'] },
    'Disco-Elysium': { display: 'Disco Elysium', media: 'game', moods: ['moody', 'interiors', 'ambience'] },
    'Dishonored-2': { display: 'Dishonored 2', media: 'game', moods: ['moody', 'interiors'] },
    'Dishonored-DLC': { display: 'Dishonored DLC', media: 'game', moods: ['moody', 'interiors'] },
    'Dying-Light-1': { display: 'Dying Light 1', media: 'game', moods: ['moody', 'ambience'] },
    'Dying-Light-The-Beast': { display: 'Dying Light: The Beast', media: 'game', moods: ['moody', 'landscape'] },
    'Fallout-3': { display: 'Fallout 3', media: 'game', moods: ['moody', 'landscape'] },
    'Fallout-4': { display: 'Fallout 4', media: 'game', moods: ['moody', 'landscape', 'ambience'] },
    'FH4': { display: 'Forza Horizon 4', media: 'game', moods: ['landscape', 'ambience'] },
    'FH5': { display: 'Forza Horizon 5', media: 'game', moods: ['landscape', 'ambience'] },
    'GTA-IV': { display: 'GTA IV', media: 'game', moods: ['moody', 'cyberpunk'] },
    'Kingdom-Come-1': { display: 'Kingdom Come', media: 'game', moods: ['landscape', 'ambience'] },
    'Kingdom-Come-2': { display: 'Kingdom Come II', media: 'game', moods: ['landscape', 'ambience', 'moody'] },
    'Mad-Max': { display: 'Mad Max', media: 'game', moods: ['landscape', 'moody'] },
    'Metro': { display: 'Metro Exodus', media: 'game', moods: ['moody', 'interiors', 'ambience'] },
    'MGS-Delta': { display: 'MGS Delta', media: 'game', moods: ['moody', 'ambience'] },
    'MGSV': { display: 'MGSV', media: 'game', moods: ['landscape', 'moody'] },
    'Prey-2017': { display: 'Prey 2017', media: 'game', moods: ['moody', 'interiors'] },
    'Rayman': { display: 'Rayman', media: 'game', moods: ['ambience', 'landscape'] },
    'Spiderman-2': { display: 'Spider-Man 2', media: 'game', moods: ['landscape', 'ambience', 'cyberpunk'] },
    'Stalker-CUALERA': { display: 'STALKER', media: 'game', moods: ['moody', 'landscape'] },
    'THE-DRIFTER': { display: 'The Drifter', media: 'game', moods: ['moody', 'landscape'] },
    'The-Long-Dark': { display: 'The Long Dark', media: 'game', moods: ['landscape', 'moody'] },
    'The-Witcher-3': { display: 'The Witcher 3', media: 'game', moods: ['landscape', 'ambience', 'moody'] },
    'Treasure-Hunt': { display: 'Treasure Hunt', media: 'game', moods: ['landscape', 'ambience'] },
    'Uncharted-4': { display: 'Uncharted 4', media: 'game', moods: ['landscape', 'ambience'] },
    'Watch-Dogs-2': { display: 'Watch Dogs 2', media: 'game', moods: ['landscape', 'ambience', 'cyberpunk'] },
    'zz_Various': { display: 'Various', media: 'game', moods: ['ambience', 'landscape'] },

    // MOVIES / TV / ANIME
    'A-Wind-Named-Amnesia': { display: 'A Wind Named Amnesia', media: 'movie', moods: ['landscape', 'ambience'] },
    'Batman-Begins': { display: 'Batman Begins', media: 'movie', moods: ['moody', 'interiors'] },
    'Blade-Runner-2099': { display: 'Blade Runner 2099', media: 'movie', moods: ['moody', 'cyberpunk', 'rainy'] },
    'Boyz-N-The-Hood': { display: 'Boyz n the Hood', media: 'movie', moods: ['moody', 'ambience'] },
    'Judge-Dredd': { display: 'Judge Dredd', media: 'movie', moods: ['moody', 'cyberpunk'] },
    'Kung-Fu-Panda': { display: 'Kung Fu Panda', media: 'movie', moods: ['ambience', 'landscape'] },
    'Love-Death-And-Robots': { display: 'Love Death and Robots', media: 'movie', moods: ['moody', 'ambience', 'cyberpunk'] },
    'Monsters-Inc': { display: 'Monsters Inc', media: 'movie', moods: ['ambience', 'interiors'] },
    'One-Piece': { display: 'One Piece', media: 'movie', moods: ['ambience', 'landscape'] },
    'Pursuit-Of-Happiness': { display: 'Pursuit of Happiness', media: 'movie', moods: ['moody', 'ambience'] },
    'Robots': { display: 'Robots', media: 'movie', moods: ['ambience', 'landscape'] },
    'Section-9': { display: 'Ghost in the Shell', media: 'movie', moods: ['moody', 'cyberpunk'] },
    'Seven': { display: 'Se7en', media: 'movie', moods: ['moody', 'interiors'] },
    'Soul': { display: 'Soul', media: 'movie', moods: ['ambience', 'landscape'] },
};

// Local video wallpapers (MP4 / GIF) hosted in the repo
const localVideos = [
    // GIFs y vídeos manuales (mantén los que ya tienes si quieres)
    { src: 'img/arkham.gif', title: 'Arkham City Nights', game: 'Batman Arkham Knight', media: 'game', type: 'video', moods: ['moody', 'rainy', 'cyberpunk'] },
    { src: 'img/samsittedahh.gif', title: 'Sam Sitting', game: 'Death Stranding', media: 'game', type: 'video', moods: ['ambience', 'landscape'] },
    { src: 'img/samsatori.gif', title: 'Sam Satori', game: 'Death Stranding', media: 'game', type: 'video', moods: ['ambience', 'landscape'] },
    { src: 'img/marcussittedahh.gif', title: 'Marcus Sitting', game: 'Watch Dogs 2', media: 'game', type: 'video', moods: ['ambience', 'interiors'] },
    { src: 'img/lessgo.gif', title: 'Metro Exodus Scene', game: 'Metro Exodus', media: 'game', type: 'video', moods: ['moody', 'ambience'] },
    { src: 'img/spidersky.gif', title: 'Spider-Man Swinging', game: 'Spider-Man 2', media: 'game', type: 'video', moods: ['ambience', 'landscape', 'cyberpunk'] },
    // GIFs de videowlprs (Disco Elysium y Mad Max Live)
    { src: 'img/videowlprs/discoelysiumstart.gif', title: 'Disco Elysium Start', game: 'Disco Elysium', media: 'game', type: 'video', moods: [] },
    { src: 'img/videowlprs/madmaxlivewlprsany.gif', title: 'Mad Max Live', game: 'Mad Max', media: 'game', type: 'video', moods: [] },

    // Todos los videos mp4 de OptimizedVideoWLPRS
    { src: 'img/OptimizedVideoWLPRS/BatmanKnight-NightWalker-VideoWLPR-web.mp4', title: 'Batman Knight Night Walker', game: 'Batman Arkham Knight', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/DeathStranding-SamWindy-VideoWLPR-web.mp4', title: 'Death Stranding Sam Windy', game: 'Death Stranding', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Dying Light  The Beast 2025.09.25 - 19.01.34.02-web.mp4', title: 'Dying Light The Beast', game: 'Dying Light: The Beast', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Fallout 3 2025.09.27 - 23.21.41.03-web.mp4', title: 'Fallout 3', game: 'Fallout 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Mad-Max-MoonLightHouse-VideoWLPR-web.mp4', title: 'Mad Max Moon Lighthouse', game: 'Mad Max', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Mad-Max-SanFranciscoHope-VideoWLPR-web.mp4', title: 'Mad Max San Francisco Hope', game: 'Mad Max', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Mad-Max-UnderSanFrancisco-VideoWLPR-web.mp4', title: 'Mad Max Under San Francisco', game: 'Mad Max', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/MetroExodus_01-web.mp4', title: 'Metro Exodus 01', game: 'Metro Exodus', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/MetroExodus_03-web.mp4', title: 'Metro Exodus 03', game: 'Metro Exodus', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/MetroExodus_04-web.mp4', title: 'Metro Exodus 04', game: 'Metro Exodus', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/MetroExodus_05-web.mp4', title: 'Metro Exodus 05', game: 'Metro Exodus', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/MetroExodus_06-web.mp4', title: 'Metro Exodus 06', game: 'Metro Exodus', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/MetroExodus_08-web.mp4', title: 'Metro Exodus 08', game: 'Metro Exodus', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/MetroExodus_10-web.mp4', title: 'Metro Exodus 10', game: 'Metro Exodus', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Prey (2017) 2025.09.08 - 18.00.41.02 - Trm-web.mp4', title: 'Prey 2017 Trm', game: 'Prey 2017', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Prey (2017) 2025.09.08 - 18.03.51.04-web.mp4', title: 'Prey 2017 18.03.51', game: 'Prey 2017', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Prey (2017) 2025.09.08 - 18.04.42.05-web.mp4', title: 'Prey 2017 18.04.42', game: 'Prey 2017', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Skyrim_VideoWLPR_04-web.mp4', title: 'Skyrim 04', game: 'Skyrim', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Skyrim_VideoWLPR_09-web.mp4', title: 'Skyrim 09', game: 'Skyrim', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Skyrim_VideoWLPR_10-web.mp4', title: 'Skyrim 10', game: 'Skyrim', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/Skyrim_VideoWLPR_12-web.mp4', title: 'Skyrim 12', game: 'Skyrim', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/SM2-Rainy-RaimiBlackSuit-Church-VideoWLPR-web.mp4', title: 'Spider-Man 2 Rainy Raimi Black Suit Church', game: 'Spider-Man 2', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/SM2-SkyView-VideoWLPR 2-web.mp4', title: 'Spider-Man 2 Sky View 2', game: 'Spider-Man 2', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/SpecOps_VideoWLPR_03-web.mp4', title: 'Spec Ops 03', game: 'Spec Ops', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/SpecOps_VideoWLPR_04-web.mp4', title: 'Spec Ops 04', game: 'Spec Ops', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/SpecOps_VideoWLPR_07-web.mp4', title: 'Spec Ops 07', game: 'Spec Ops', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/SpecOps_VideoWLPR_12-web.mp4', title: 'Spec Ops 12', game: 'Spec Ops', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/SpecOps_VideoWLPR_Dinamic_08-web.mp4', title: 'Spec Ops Dinamic 08', game: 'Spec Ops', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.17.38.01-web.mp4', title: 'The Witcher 3 19.17.38', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.19.02.02-web.mp4', title: 'The Witcher 3 19.19.02', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.20.40.03-web.mp4', title: 'The Witcher 3 19.20.40', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.34.02.08-web.mp4', title: 'The Witcher 3 19.34.02', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.45.29.09-web.mp4', title: 'The Witcher 3 19.45.29', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.48.01.10-web.mp4', title: 'The Witcher 3 19.48.01', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.53.39.12-web.mp4', title: 'The Witcher 3 19.53.39', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.55.19.13-web.mp4', title: 'The Witcher 3 19.55.19', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.55.56.14-web.mp4', title: 'The Witcher 3 19.55.56', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/The Witcher 3 2025.10.02 - 19.56.42.15-web.mp4', title: 'The Witcher 3 19.56.42', game: 'The Witcher 3', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/WD2-Marcus-WaterHouses-Landscape-VideoWLPR-web.mp4', title: 'WD2 Marcus Water Houses Landscape', game: 'Watch Dogs 2', media: 'game', type: 'video', moods: [] },
    { src: 'img/OptimizedVideoWLPRS/WD2-Marcus-WaterHouses-VideoWLPR-web.mp4', title: 'WD2 Marcus Water Houses', game: 'Watch Dogs 2', media: 'game', type: 'video', moods: [] },
];

/**
 * Fetches manifest.json and builds the full wallpapers array.
 * Each item: { src, title, game, media, type, moods }
 */
async function loadWallpapers() {
    let netlifyImages = [];
    try {
        const res = await fetch('manifest.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const manifest = await res.json();
        for (const [gameKey, files] of Object.entries(manifest)) {
            const meta = gameMetadata[gameKey] || { display: gameKey, media: 'game', moods: ['ambience'] };
            const fileList = Array.isArray(files) ? files : [files];
            for (const filename of fileList) {
                netlifyImages.push({
                    src: NETLIFY_BASE + filename,
                    title: meta.display,
                    game: meta.display,
                    media: meta.media,
                    type: 'image',
                    moods: meta.moods,
                });
            }
        }
    } catch (err) {
        console.warn('BetterWLPRS: manifest.json not loaded —', err.message);
    }
    return [...localVideos, ...netlifyImages];
}

// Backward-compat stub
const allWallpapers = localVideos;
