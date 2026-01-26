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

    const html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
    html5QrcodeScanner.render(onScanSuccess, onScanError);

    const removeSecondVideo = () => {
      const videos = document.getElementsByTagName("video");
      if (videos.length > 1) {
        console.log("videos", videos);
        videos[1].remove();
        console.log("Second video element removed.");
      }

      const startBtns = document.getElementsByClassName("html5-qrcode-element");

      if (startBtns.length > 1) {
        console.log("startBtns", startBtns);
        startBtns[1].remove();
        console.log("Second startBtns element removed.");
      }

      const spans = document.querySelectorAll("span");

      spans.forEach((span, index) => {
        const buttons = span.querySelectorAll(".html5-qrcode-element");

        if (
          buttons.length === 2 &&
          buttons[0].id === "html5-qrcode-button-camera-start" &&
          buttons[1].id === "html5-qrcode-button-camera-stop"
        ) {
          const firstSpan = Array.from(spans).find(
            (s) =>
              s.querySelectorAll(".html5-qrcode-element").length === 2 &&
              s.querySelector("#html5-qrcode-button-camera-start") &&
              s.querySelector("#html5-qrcode-button-camera-stop"),
          );

          if (firstSpan && span !== firstSpan) {
            span.remove();
            console.log("Duplicate span removed:", span);
          }
        }
      });

      const shadedDivs = document.querySelectorAll("#qr-shaded-region");
      if (shadedDivs.length > 1) {
        shadedDivs.forEach((div, index) => {
          if (index > 0) {
            div.remove();
            console.log("Duplicate qr-shaded-region removed.");
          }
        });
      }
    };

    const pausedDivs = Array.from(document.querySelectorAll("div")).filter(
      (div) =>
        div.textContent.trim() === "Scanner paused" &&
        div.style.position === "absolute" &&
        div.style.display === "none",
    );

    if (pausedDivs.length > 1) {
      pausedDivs.forEach((div, index) => {
        if (index > 0) {
          div.remove();
          console.log("Duplicate 'Scanner paused' div removed.");
        }
      });
    }

    const zoomDivs = Array.from(document.querySelectorAll("div")).filter(
      (div) => div.querySelector("#html5-qrcode-input-range-zoom"),
    );

    if (zoomDivs.length > 1) {
      zoomDivs.forEach((div, index) => {
        if (index > 0) {
          div.remove();
          console.log("Duplicate zoom slider removed.");
        }
      });
    }

    const interval = setInterval(() => {
      const videos = document.getElementsByTagName("video");
      if (videos.length > 1) {
        removeSecondVideo();
        clearInterval(interval);
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <div id="reader"></div>
      <div id="ratio">{aspectRatio}</div>
    </div>
  );
}

export default App;
