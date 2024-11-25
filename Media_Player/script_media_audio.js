// VISUEL
const context = new AudioContext();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 256;

const gradient = ctx.createLinearGradient(0, 0, 0, 256);
gradient.addColorStop(0, '#ff0000');
gradient.addColorStop(0.21, '#ff9a00');
gradient.addColorStop(0.27, '#d0de21');
gradient.addColorStop(0.38, '#4fdc4a');
gradient.addColorStop(0.49, '#3fdad8');
gradient.addColorStop(0.60, '#2fc9e2');
gradient.addColorStop(0.71, '#1c7fee');
gradient.addColorStop(0.82, '#5f15f2');
gradient.addColorStop(0.93, '#ba0cf8');
gradient.addColorStop(1, '#fb07d9');
ctx.fillStyle = gradient;

// Audio Analyser Setup
const analyser = context.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.95;

function draw() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < bufferLength; i++) {
    ctx.fillRect(i * 3, canvas.height - dataArray[i], 2, canvas.height);
  }
  requestAnimationFrame(draw);
}

// AUDIO
const aud = document.getElementById('audioElement');
let sourceNode = null;
let playlist = [];
let currentIndex = 0;
let repeatPlaylist = false; // Option to repeat playlist

// File Upload
const audioFileInput = document.getElementById('audioFile');
audioFileInput.onchange = function () {
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
    // Check whether there is a next title
    if (currentIndex < playlist.length - 1) {
      currentIndex++; // Increase the index by 1 to load the next title
      loadTrack(currentIndex); // Load the next title
  
      // Check whether the current track is playing and start playback
      if (aud.paused) {
        aud.play();
      } else {
        aud.pause(); // To be on the safe side, we pause first
        aud.play();  // Then we play the new title
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
    aud.src = track.url;
    aud.load();  // Ensure that the title is loaded correctly
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
  if (aud.paused) {
    aud.play().then(() => {
      console.log("Audio is playing");

      if (context.state === 'suspended') {
        return context.resume().then(() => {
          setupAudioStream();
        });
      } else {
        setupAudioStream();
      }

      playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }).catch((err) => {
      console.error('Error playing audio:', err);
    });
  } else {
    aud.pause();
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}

// When the current title ends, skip to the next title
aud.addEventListener('ended', function () {
  if (currentIndex < playlist.length - 1) {
    forward(); // Play next track
  } else if (repeatPlaylist) {
    loadTrack(0); // Start playlist repeat, if activated
    play();
  }
});

// Move song up in playlist
function moveUp(index) {
  if (index > 0) {
    [playlist[index], playlist[index - 1]] = [playlist[index - 1], playlist[index]];
    updatePlaylistUI();
  }
}

// Move song down in playlist
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

// Setup audio stream and connect to analyser
function setupAudioStream() {
  if (!sourceNode) {
    console.log('Setting up audio stream...');
    sourceNode = context.createMediaElementSource(aud);
    sourceNode.connect(analyser);
    analyser.connect(context.destination);
    draw();
  }
}

// Speed controls
function fast() { aud.playbackRate += 0.1; }
function norm() { aud.playbackRate = 1.0; }
function slow() { aud.playbackRate -= 0.1; }
function rewind() { aud.currentTime = 0; }
function mute() {
  const mtxt = document.querySelector('#mute');
  aud.muted = !aud.muted;
  mtxt.innerHTML = aud.muted ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
}

// Toggle audio control panel
function control() {
  const ctr = document.querySelector('#ctrl');
  aud.controls = !aud.controls;
  ctr.innerHTML = aud.controls ? '<i class="fa-solid fa-sliders"></i>' : '<i class="fa-solid fa-sliders"></i>';
}

