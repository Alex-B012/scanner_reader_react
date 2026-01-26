import { useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import "./App.scss";

function App() {
  const [aspectRatio, setAspectRatio] = useState(0);

  useEffect(() => {
    function onScanSuccess(decodedText, decodedResult) {
      console.log(`Scan result: ${decodedText}`, decodedResult);
      html5QrcodeScanner.stop();
    }

    function onScanError(errorMessage) {
      console.error("Scan error: ", errorMessage);
    }

    let qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
      let minEdgePercentage = 0.7; // 70%
      let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
      let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
      return {
        width: qrboxSize,
        height: qrboxSize,
      };
    };

    const formatsToSupport = [Html5QrcodeSupportedFormats.DATA_MATRIX];

    let config = {
      fps: 10,
      qrbox: qrboxFunction,
      aspectRatio: window.innerWidth / window.innerHeight,
      rememberLastUsedCamera: true,
      formatsToSupport: formatsToSupport,
    };

    setAspectRatio(config.aspectRatio);

    var html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
    html5QrcodeScanner.render(onScanSuccess, onScanError);
  }, []);

  return (
    <div className="App">
      <div id="reader"></div>
      <div id="ratio">{aspectRatio}</div>
    </div>
  );
}

export default App;
