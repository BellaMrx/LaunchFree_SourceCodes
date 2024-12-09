const uploadInput = document.getElementById('upload-pdf');
const pdfObject = document.getElementById('pdf-object');

uploadInput.addEventListener('change', event => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    const fileURL = URL.createObjectURL(file);
    pdfObject.data = fileURL; // Show PDF in <object> tag
  } else {
    alert('Please upload a valid PDF file!');
  }
});