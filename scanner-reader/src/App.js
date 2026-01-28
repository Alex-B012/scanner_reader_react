import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import "./App.scss";

function App() {
  const [aspectRatio, setAspectRatio] = useState(0);
  const [decodedText, setDecodedText] = useState("");
  const [decodedResult, setDecodedResult] = useState({
    decodedText: "null",
    result: {
      debugData: {
        decoderName: "null",
      },
      format: {
        format: -1,
        formatName: "null",
      },
      text: "null",
    },
  });

  const [arrOfDecodedResults, setArrOfDecodedResults] = useState([]);
  const [count, setCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const scannedSetRef = useRef(new Set());

  useEffect(() => {
    let html5Qrcode = new Html5Qrcode("reader");
    let scannerStarted = false;

    function onScanError(errorMessage) {
      setErrorMessage(errorMessage);
      console.error("Scan error: ", errorMessage);
    }
    function onScanSuccess(decodedText, decodedResult) {
      console.log("onScanSuccess FIRED");
      setCount((prev) => prev + 1);
      setDecodedText(decodedText);
      setDecodedResult(decodedResult);
      setArrOfDecodedResults((prev) => {
        if (scannedSetRef.current.has(decodedText)) {
          return prev;
        }
        scannedSetRef.current.add(decodedText);
        return [decodedResult, ...prev];
      });

      console.log(`Scan result: ${decodedText}`, decodedResult);
    }

    const formatsToSupport = [Html5QrcodeSupportedFormats.DATA_MATRIX];
    let config = {
      fps: 10,
      qrbox: (w, h) => {
        const minEdge = Math.min(w, h);
        return {
          width: Math.floor(minEdge * 0.7),
          height: Math.floor(minEdge * 0.7),
        };
      },
      aspectRatio: window.innerWidth / window.innerHeight,
      rememberLastUsedCamera: true,
      formatsToSupport,
    };
    setAspectRatio(config.aspectRatio);
    Html5Qrcode.getCameras()
      .then((cameras) => {
        if (cameras && cameras.length) {
          html5Qrcode
            .start(
              { deviceId: cameras[0].id },
              config,
              onScanSuccess,
              onScanError,
            )
            .then(() => {
              scannerStarted = true;
            })
            .catch((err) => {
              console.error("Failed to start scanner:", err);
            });
        }
      })
      .catch((err) => {
        console.error("Error getting cameras:", err);
      });

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
      if (scannerStarted) {
        html5Qrcode.stop().catch(() => {});
      }
      html5Qrcode.clear().catch(() => {});
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log("arrOfDecodedResults:", arrOfDecodedResults);
    console.log("arrOfDecodedResults.length:", arrOfDecodedResults.length);
  }, [arrOfDecodedResults]);

  return (
    <div className="App">
      <div id="reader"></div>
      <div className="serviceData">
        <div className="decodedText">decodedText: {decodedText}</div>
        <div className="decodedResult">
          decodedResult:
          <p>decodedResult.decodedText: {decodedResult.decodedText}</p>
          <p>
            decodedResult.result.debugData.decoderName:{" "}
            {decodedResult.result.debugData.decoderName}
          </p>
          <p>
            decodedResult.result.format.format:{" "}
            {decodedResult.result.format.format}
          </p>
          <p>
            decodedResult.result.format.formatName:{" "}
            {decodedResult.result.format.formatName}
          </p>
          <p>decodedResult.result.text: {decodedResult.result.text}</p>
        </div>
        <div className="errorMessage">ErrorMessage: {errorMessage}</div>
        <div className="count">Count: {count}</div>
        <div className="arrLength">ArrLength: {arrOfDecodedResults.length}</div>
        <div className="arrOfDecodedResults">
          arrOfDecodedResults:
          {arrOfDecodedResults.length > 0 &&
            arrOfDecodedResults.map((item, idx) => (
              <div className="arrOfDecodedResults__item" key={idx}>
                <p className="id">Объект №{idx}</p>
                <div className="decodedResult">
                  item - decodedResult:
                  <p>item.decodedText: {item.decodedText}</p>
                  <p>
                    item.result.debugData.decoderName:{" "}
                    {item.result.debugData.decoderName}
                  </p>
                  <p>item.result.format.format: {item.result.format.format}</p>
                  <p>
                    item.result.format.formatName:{" "}
                    {item.result.format.formatName}
                  </p>
                  <p>item.result.text: {item.result.text}</p>
                </div>
              </div>
            ))}
        </div>
        <div id="ratio">aspectRatio: {aspectRatio}</div>
      </div>
    </div>
  );
}

export default App;
