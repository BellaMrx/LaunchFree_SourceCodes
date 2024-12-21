## QR Code Scanner

1. Access to the camera with WebRTC API
The WebRTC API provides access to the device's camera via `navigator.mediaDevices.getUserMedia`. This allows you to display the camera stream in an HTML element (e.g. <video>).

2. Decoding the QR code
To scan and decode QR codes, you can use a JavaScript library such as [jsQR](https://github.com/cozmo/jsQR) or [qrcode-reader](https://github.com/zxing-js/library). These libraries analyze the video image and search for QR codes.

Explanation of the code:
I. Activate camera:
 - With `navigator.mediaDevices.getUserMedia` the camera stream is fetched.
 - The stream is displayed in a <video> element.

II Capture frame:
 - A canvas element is used in each frame to analyze the current image of the video stream.

III. decode QR code:
 - The jsQR library analyzes the image data from the canvas and decodes the QR code if one is detected.

IV. Show results:
 - The decoded result (text, URL, etc.) is displayed in the <p> element.
 - The variable `lastResult` saves the last QR code found. 
 - The content is only updated if a new code is found (`code.data !== lastResult`).
 - As soon as a QR code is found, the link remains visible, even if the camera is no longer pointing at the code.
 - With innerHTML, the result is displayed as an <a> tag so that the user can click on the link directly.


3. Browser compatibility
This approach works in modern browsers that support the WebRTC API (e.g. Chrome, Edge, Firefox, Safari). On mobile devices, special care must be taken to ensure that the `facingMode` option is set to `environment` so that the rear camera is used.


4. Extensions
 - Improve UI: Show a preview of the QR code or implement a success message.
 - Process data further: The decoded data can be used for further actions, such as opening a URL or filling out a form.
 - Offline use: Load the JS libraries locally to make the scanner available offline.