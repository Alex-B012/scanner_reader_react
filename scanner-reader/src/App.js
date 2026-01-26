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

    // Функция для удаления второго видео
    const removeSecondVideo = () => {
      const videos = document.getElementsByTagName("video");
      if (videos.length > 1) {
        // Удаляем второй video элемент
        console.log("videos", videos); // Для отладки
        videos[1].remove();
        console.log("Second video element removed.");
      }
    };

    // Используем setInterval для проверки, что элементы видео созданы
    const interval = setInterval(() => {
      const videos = document.getElementsByTagName("video");
      if (videos.length > 1) {
        removeSecondVideo();
        clearInterval(interval); // Останавливаем интервал после удаления второго видео
      }
    }, 100); // Проверяем каждые 100мс

    // Очистка при размонтировании компонента
    return () => {
      clearInterval(interval); // Останавливаем интервал при размонтировании
    };
  }, []); // Пустой массив зависимостей, чтобы эффект сработал только при монтировании компонента

  return (
    <div className="App">
      <div id="reader"></div>
      <div id="ratio">{aspectRatio}</div>
    </div>
  );
}

export default App;
