import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useRemoveSecondVideo } from "./hooks/useRemoveSecondVideo";
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
  const [cameraInUse, setCameraInUse] = useState("");
  const scannedSetRef = useRef(new Set());
  const scannerStartedRef = useRef(false);

  useEffect(() => {
    let config = {
      fps: 20,
      qrbox: 250,
      // aspectRatio: window.innerWidth / window.innerHeight,
      aspectRatio: 1,
      rememberLastUsedCamera: true,
      formatsToSupport: [Html5QrcodeSupportedFormats.DATA_MATRIX],
    };

    setAspectRatio(config.aspectRatio);

    let html5Qrcode = new Html5Qrcode("reader", config);

    function onScanError(errorMessage) {
      setErrorMessage(errorMessage);
      console.error("Scan error: ", errorMessage);
    }

    function onScanSuccess(decodedText, decodedResult) {
      console.log("onScanSuccess FIRED", decodedText);

      setCount((prev) => prev + 1);
      setDecodedText(decodedText);
      setDecodedResult(decodedResult);

      console.log(
        "QR_code format name:",
        decodedResult.result.format.formatName,
      );

      if (
        !scannedSetRef.current.has(decodedText) &&
        decodedResult.result.format.formatName === "DATA_MATRIX"
      ) {
        scannedSetRef.current.add(decodedText);

        setArrOfDecodedResults((prev) => {
          const newArr = [decodedResult, ...prev];
          console.log("Добавлен новый объект:", decodedResult);
          console.log("Новый массив arrOfDecodedResults:", newArr);
          return newArr;
        });
      } else {
        console.log("Дубликат, не добавляем:", decodedText);
      }
    }

    Html5Qrcode.getCameras()
      .then((cameras) => {
        if (cameras && cameras.length) {
          const backCamera = cameras.find((camera) =>
            /environment|back|rear/gi.test(camera.label),
          );

          const cameraId = backCamera ? backCamera.id : cameras[0].id;

          setCameraInUse(
            backCamera ? backCamera.label : `front camera ${cameras[0].id}`,
          );

          html5Qrcode
            .start({ deviceId: cameraId }, config, onScanSuccess, onScanError)
            .then(() => {
              scannerStartedRef.current = true;
            })
            .catch((err) => console.error("Failed to start scanner:", err));
        }
      })
      .catch((err) => console.error("Error getting cameras:", err));

    return () => {
      if (scannerStartedRef.current) {
        html5Qrcode.stop?.().catch(() => {});
        html5Qrcode.clear?.().catch(() => {});
      }
    };
  }, []);

  useRemoveSecondVideo();

  useEffect(() => {
    console.log("arrOfDecodedResults updated:", arrOfDecodedResults);
    console.log("arrOfDecodedResults.length:", arrOfDecodedResults.length);
  }, [arrOfDecodedResults]);

  return (
    <div className="App">
      <div id="reader"></div>
      <div className="serviceData">
        <div className="decodedText bold">decodedText: {decodedText}</div>
        <div className="decodedResult ">
          <span className="bold">decodedResult:</span>
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
        <div className="arrOfDecodedResults bold">
          arrOfDecodedResults:
          {arrOfDecodedResults.length > 0 &&
            arrOfDecodedResults.map((item, idx) => (
              <div className="arrOfDecodedResults__item" key={idx}>
                <p className="arrOfDecodedResults__item-number heading_test">
                  Объект №{idx + 1}
                </p>
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
        <div id="ratio " className="bold">
          aspectRatio: {aspectRatio}
        </div>
        <div className="cameraInUse">Camera in use: {cameraInUse}</div>
      </div>
    </div>
  );
}

export default App;
