import React, { useState, useRef } from 'react';

const MediaPlayer = ({ src, type }) => {
  const mediaRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume range from 0.0 to 1.0

  const togglePlay = () => {
    if (mediaRef.current) {
      const isPlaying = playing;
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  return (
    <div>
      {type === 'video' ? (
        <video ref={mediaRef} src={src} onClick={togglePlay} style={{ width: '100%' }}>
          Your browser does not support the video tag.
        </video>
      ) : (
        <audio ref={mediaRef} src={src} onClick={togglePlay}>
          Your browser does not support the audio element.
        </audio>
      )}
      <div>
        <button onClick={togglePlay}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <label htmlFor="volume">Volume:</label>
        <input
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default MediaPlayer;
