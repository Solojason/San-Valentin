// src/components/Audio/YouTubeAudio.jsx
import YouTube from "react-youtube";

export default function YouTubeAudio({ videoId, onReady }) {
  return (
    <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0 }}>
      <YouTube
        videoId={videoId}
        opts={{
          height: "1",
          width: "1",
          playerVars: {
            autoplay: 0,       // lo disparamos con playVideo()
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
        }}
        onReady={(e) => onReady?.(e.target)}
      />
    </div>
  );
}
