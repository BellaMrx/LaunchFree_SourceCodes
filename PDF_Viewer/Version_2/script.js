const fileInput = document.getElementById('upload-pdf');
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const currentPageDisplay = document.getElementById('current-page');
const totalPagesDisplay = document.getElementById('total-pages');

let pdfDoc = null;       // PDF document
let currentPage = 1;     // Current page
let totalPages = 0;      // Total number of pages
let scale = 1;           // Zoom factor

// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// File upload handler
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    const fileURL = URL.createObjectURL(file);
    loadPDF(fileURL);
  } else {
    alert('Please upload a valid PDF file!');
  }
});

// Load and render PDF
async function loadPDF(url) {
  try {
    pdfDoc = await pdfjsLib.getDocument(url).promise;
    totalPages = pdfDoc.numPages;
    totalPagesDisplay.textContent = totalPages;
    currentPage = 1;
    renderPage(currentPage);
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
}

// Render page
async function renderPage(pageNum) {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: ctx,
    viewport,
  };
  await page.render(renderContext);
  currentPageDisplay.textContent = pageNum;
}

// Previous page
prevPageButton.addEventListener('click', () => {
  if (currentPage <= 1) return;
  currentPage--;
  renderPage(currentPage);
});

// Next page
nextPageButton.addEventListener('click', () => {
  if (currentPage >= totalPages) return;
  currentPage++;
  renderPage(currentPage);
});

// Zoom function
let zoomInButton = document.createElement('button');
zoomInButton.textContent = 'Zoom +';
document.getElementById('controls').appendChild(zoomInButton);

let zoomOutButton = document.createElement('button');
zoomOutButton.textContent = 'Zoom -';
document.getElementById('controls').appendChild(zoomOutButton);

zoomInButton.addEventListener('click', () => {
  scale += 0.1;
  renderPage(currentPage);
});

zoomOutButton.addEventListener('click', () => {
  if (scale > 0.5) {
    scale -= 0.1;
    renderPage(currentPage);
  }
});
