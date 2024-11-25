// VIDEO
const vid = document.getElementById('videoElement');
let playlist = [];
let currentIndex = 0;
let repeatPlaylist = false; // Option to repeat playlist

// File Upload
const videoFileInput = document.getElementById('videoFile');
videoFileInput.onchange = function () {
  const files = this.files;

  for (let i = 0; i < files.length; i++) {
    const fileUrl = URL.createObjectURL(files[i]);
    playlist.push({ name: files[i].name, url: fileUrl });
    addToPlaylistUI(files[i].name, playlist.length - 1);
  }

  if (playlist.length === 1) {
    loadTrack(0);
  }
};

// Add files to playlist UI
function addToPlaylistUI(fileName, index) {
  const playlistUI = document.getElementById('playlist');
  const li = document.createElement('li');
  li.innerHTML = `${fileName} 
    <button onclick="moveUp(${index})"><i class="fa-solid fa-arrow-up"></i></button>
    <button onclick="moveDown(${index})"><i class="fa-solid fa-arrow-down"></i></button>`;
  li.setAttribute("data-index", index);
  li.ondblclick = () => loadTrack(index);  // Double-click to play

  playlistUI.appendChild(li);
}

// Skip backwards through the playlist (previous track)
function backward() {
  if (currentIndex > 0) {
    loadTrack(currentIndex - 1); // One title back
    play();
  } else {
    console.log('First track in the playlist, cannot jump back any further.');
  }
}

// Skip forward through the playlist (next track)
function forward() {
  if (currentIndex < playlist.length - 1) {
    currentIndex++;
    loadTrack(currentIndex);

    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
      vid.play();
    }

    console.log(`Playing next track: ${playlist[currentIndex].name}`);
  } else {
    console.log('Last track in the playlist reached, cannot skip ahead.');
  }
}

// Function for loading and playing the current track
function loadTrack(index) {
  currentIndex = index;
  const track = playlist[index];
  vid.src = track.url;
  vid.load();  // Ensure that the video is loaded correctly
  highlightCurrentTrack(index); // Mark the current title
}

// Highlight current track in the playlist
function highlightCurrentTrack(index) {
  const playlistUI = document.getElementById('playlist');
  const items = playlistUI.getElementsByTagName('li');

  for (let i = 0; i < items.length; i++) {
    items[i].style.backgroundColor = i === index ? '#222' : '';  // Darker background for current track
  }
}

// Play and pause function
function play() {
  const playButton = document.querySelector('#play');
  if (vid.paused) {
    vid.play();
    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    vid.pause();
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}

// When the current video ends, skip to the next video
vid.addEventListener('ended', function () {
  if (currentIndex < playlist.length - 1) {
    forward(); // Play next video
  } else if (repeatPlaylist) {
    loadTrack(0); // Start playlist repeat, if activated
    play();
  }
});

// Move video up in playlist
function moveUp(index) {
  if (index > 0) {
    [playlist[index], playlist[index - 1]] = [playlist[index - 1], playlist[index]];
    updatePlaylistUI();
  }
}

// Move video down in playlist
function moveDown(index) {
  if (index < playlist.length - 1) {
    [playlist[index], playlist[index + 1]] = [playlist[index + 1], playlist[index]];
    updatePlaylistUI();
  }
}

// Update playlist UI after moving tracks
function updatePlaylistUI() {
  const playlistUI = document.getElementById('playlist');
  playlistUI.innerHTML = '';
  playlist.forEach((track, index) => {
    addToPlaylistUI(track.name, index);
  });
  highlightCurrentTrack(currentIndex);  // Update highlight if current track moved
}

// Speed controls
function fast() { vid.playbackRate += 0.1; }
function norm() { vid.playbackRate = 1.0; }
function slow() { vid.playbackRate -= 0.1; }
function rewind() { vid.currentTime = 0; }
function mute() {
  const mtxt = document.querySelector('#mute');
  vid.muted = !vid.muted;
  mtxt.innerHTML = vid.muted ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
}

// Toggle video control panel
function control() {
  const ctr = document.querySelector('#ctrl');
  vid.controls = !vid.controls;
  ctr.innerHTML = vid.controls ? '<i class="fa-solid fa-sliders"></i>' : '<i class="fa-solid fa-sliders"></i>';
}
