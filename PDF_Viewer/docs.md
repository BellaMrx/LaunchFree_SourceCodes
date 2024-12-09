## PDF-Viewer 

### Version_1
It is possible to open the PDF file selected by the user directly in the browser by transferring the PDF file to the browser's own PDF rendering engine.

Advantages:
 - Uses the browser's native PDF viewer.
 - Easy to implement.

Disadvantages:
 - No control over rendering.


### Version_2
Use the PDF.js library: PDF.js is an open source library that renders PDF documents directly in the browser by converting the PDF format into HTML5 canvas or SVG.

With PDF.js it is possible to load a PDF, render pages and implement user interactions (e.g. zoom, navigation).

1. integrating PDF.js
The PDF.js library can be integrated from a CDN or downloaded locally:

```
<script src=“https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js”></script>
```

2. basic HTML structure:

    see “index.html”

3. JavaScript for PDF.js

    see “script.js”

#### Explanation of the code
File selection:
The user selects a PDF file via the `<input>` element.
The file is converted into a temporary URL using URL.createObjectURL and passed to PDF.js.

PDF.js initialization:
The file is loaded with `pdfjsLib.getDocument(url)`.
The number of pages (numPages) is determined to enable navigation.

Page rendering:
Each page is rendered on a `<canvas>` with adjustable scaling.

Navigation:
Buttons for switching between pages (prev and next) call `renderPage(pageNum)`.