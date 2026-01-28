import { useEffect } from "react";

export const useRemoveSecondVideo = () => {
  useEffect(() => {
    const removeSecondVideo = () => {
      const videos = document.getElementsByTagName("video");
      if (videos.length > 1) videos[1].remove();

      const startBtns = document.getElementsByClassName("html5-qrcode-element");
      if (startBtns.length > 1) startBtns[1].remove();

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
          }
        }
      });

      const shadedDivs = document.querySelectorAll("#qr-shaded-region");
      if (shadedDivs.length > 1) {
        shadedDivs.forEach((div, index) => {
          if (index > 0) div.remove();
        });
      }
    };

    const interval = setInterval(() => {
      const videos = document.getElementsByTagName("video");
      if (videos.length > 1) {
        removeSecondVideo();
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);
};
