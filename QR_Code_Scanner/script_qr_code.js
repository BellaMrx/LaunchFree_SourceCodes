const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const context = canvas.getContext('2d');
let lastResult = null;      // Variable for saving the last result

// Access to the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);    // iOS support
        video.play();
        requestAnimationFrame(scan);
    })
    .catch(err => console.error("Camera access failed:", err));

// Scan QR code
function scan() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            if (code.data !== lastResult) {     // Only update with new QR code
                lastResult = code.data;
                result.innerHTML = `<a href="${lastResult}" target="_blank">${lastResult}</a>`;
                console.log(`New QR code found: ${lastResult}`);
            }
        }
    }
    requestAnimationFrame(scan);
}