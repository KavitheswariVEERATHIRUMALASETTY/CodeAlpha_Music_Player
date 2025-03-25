// Sample music data
let musicData = [
    {
        title: "Song 1",
        artist: "Adele",
        category: "pop",
         src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        image: "https://th.bing.com/th/id/R.28eeacab7f641c13a2e1f3319d60e239?rik=fOcjT%2fCTJw7Kyw&riu=http%3a%2f%2fmedia4.popsugar-assets.com%2ffiles%2f2015%2f11%2f25%2f154%2fn%2f1922398%2fb97833d3635717c4_GettyImages-1625713810ZFvrg.xxxlarge_2x%2fi%2fShe-went-same-performing-arts-school-other-famous-British-singers.jpg&ehk=IvBmmxb5%2bqYXN6M7QzJsZLCopfScj4%2bN5dNjrTGRCRc%3d&risl=&pid=ImgRaw&r=0"
    },
    {
        title: "Song 2",
        artist: "Bonnie Tyler",
        category: "rock",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        image:"https://www.musicianwages.com/wp-content/uploads/2023/01/Most-Famous-British-Female-Singers.png"
    },
    {
        title: " Song 3",
        artist: "Kate Bush",
        category: "jazz",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        image: "https://www.musicianwages.com/wp-content/uploads/2022/12/Kate-Bush.png"
    }
];

// DOM Elements
const audio = new Audio();
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.querySelector('.progress');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');
const playlist = document.getElementById('playlist');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryButtons = document.querySelectorAll('.categories li');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');

// State variables
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'none'; // none, one, all

// Handle file upload
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    for (let file of files) {
        if (file.type.startsWith('audio/')) {
            const song = {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                artist: "Local Artist",
                category: "all",
                src: URL.createObjectURL(file),
                image: "https://via.placeholder.com/200"
            };
            musicData.push(song);
        }
    }
    initializePlaylist();
});

// Initialize playlist
function initializePlaylist() {
    playlist.innerHTML = '';
    musicData.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => playSong(index));
        playlist.appendChild(li);
    });
}

// Play song function
function playSong(index) {
    currentSongIndex = index;
    const song = musicData[currentSongIndex];
    
    audio.src = song.src;
    document.getElementById('songTitle').textContent = song.title;
    document.getElementById('artistName').textContent = song.artist;
    document.getElementById('albumArt').src = song.image;
    
    audio.play();
    isPlaying = true;
    updatePlayButton();
    updatePlaylistHighlight();
}

// Update play button icon
function updatePlayButton() {
    playBtn.innerHTML = isPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
}

// Update playlist highlight
function updatePlaylistHighlight() {
    const playlistItems = playlist.getElementsByTagName('li');
    Array.from(playlistItems).forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeSpan.textContent = formatTime(audio.currentTime);
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayButton();
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + musicData.length) % musicData.length;
    playSong(currentSongIndex);
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % musicData.length;
    playSong(currentSongIndex);
});

shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#3498db' : '#2c3e50';
});

repeatBtn.addEventListener('click', () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    repeatBtn.style.color = repeatMode !== 'none' ? '#3498db' : '#2c3e50';
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
    } else if (repeatMode === 'all' || isShuffled) {
        if (isShuffled) {
            currentSongIndex = Math.floor(Math.random() * musicData.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % musicData.length;
        }
        playSong(currentSongIndex);
    } else {
        isPlaying = false;
        updatePlayButton();
    }
});

// Search functionality
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredSongs = musicData.filter(song => 
        song.title.toLowerCase().includes(searchTerm) || 
        song.artist.toLowerCase().includes(searchTerm)
    );
    updatePlaylistDisplay(filteredSongs);
});

// Category filtering
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.dataset.category;
        const filteredSongs = category === 'all' 
            ? musicData 
            : musicData.filter(song => song.category === category);
        updatePlaylistDisplay(filteredSongs);
    });
});

// Update playlist display
function updatePlaylistDisplay(songs) {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => {
            const originalIndex = musicData.findIndex(s => s.title === song.title);
            playSong(originalIndex);
        });
        playlist.appendChild(li);
    });
}

// Initialize the player
initializePlaylist();
playSong(0); 