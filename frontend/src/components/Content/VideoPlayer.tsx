import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Fullscreen } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const VideoPlayer = ({ frame, isPlaying, setIsPlaying, onNextFrame }) => {
  const playerRef = useRef(null);
  const playerIntervalRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(frame.start_time || 0);
  const [totalDuration, setTotalDuration] = useState(frame.end_time || 0);
  const [volume, setVolume] = useState(50);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [videoQuality, setVideoQuality] = useState('large');
  const [captionsEnabled, setCaptionsEnabled] = useState(false);

  const qualityLabels = { small: '360p', medium: '480p', large: '720p', hd1080: 'HD 1080p', default: 'Auto' };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => initPlayer();
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current) playerRef.current.destroy();
      if (playerIntervalRef.current) clearInterval(playerIntervalRef.current);
    };
  }, [frame]);

  const initPlayer = () => {
    const videoId = getYouTubeVideoId(frame.source);
    if (!videoId) return;

    playerRef.current = new window.YT.Player(`player-${frame.id}`, {
      videoId,
      events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange },
      playerVars: { controls: 0, rel: 0, modestbranding: 1, fs: 1 },
    });
  };

  const onPlayerReady = (event) => {
    setIsPlayerReady(true);
    setTotalDuration(event.target.getDuration());
    event.target.setVolume(volume);
    event.target.seekTo(frame.start_time || 0, true);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      playerIntervalRef.current = setInterval(() => {
        const time = playerRef.current.getCurrentTime();
        if (time >= frame.end_time) {
          playerRef.current.pauseVideo();
          onNextFrame();
        }
        setCurrentTime(time);
      }, 1000);
    } else {
      setIsPlaying(false);
      clearInterval(playerIntervalRef.current);
    }
  };

  const togglePlayPause = () => playerRef.current[isPlaying ? 'pauseVideo' : 'playVideo']();
  const handleTimeChange = (value) => playerRef.current.seekTo(value[0], true);
  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    playerRef.current.setVolume(value[0]);
  };
  const changePlaybackSpeed = (speed) => {
    setPlaybackSpeed(speed);
    playerRef.current.setPlaybackRate(speed);
  };
  const toggleFullscreen = () => {
    const player = document.getElementById(`player-${frame.id}`);
    player.requestFullscreen ? player.requestFullscreen() : document.exitFullscreen();
  };
  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
    playerRef.current[captionsEnabled ? 'unloadModule' : 'loadModule']('captions');
    if (!captionsEnabled) playerRef.current.setOption('captions', 'track', { languageCode: 'en' });
  };

  const getYouTubeVideoId = (url) => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'youtu.be' ? parsedUrl.pathname.slice(1) : parsedUrl.searchParams.get('v');
  };

  return (
    <div className="flex flex-col h-full">
      <iframe
        id={`player-${frame.id}`}
        src={`https://www.youtube.com/embed/${getYouTubeVideoId(frame.source)}?enablejsapi=1&rel=0`}
        className="w-full h-full"
        allowFullScreen
      />
      <div className="flex items-center justify-between p-2 bg-white">
        <div className="flex items-center gap-4">
          <Button onClick={togglePlayPause} disabled={!isPlayerReady}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <Slider
            value={[currentTime]}
            onValueChange={handleTimeChange}
            min={frame.start_time || 0}
            max={frame.end_time || totalDuration}
            className="w-48"
          />
          <Slider value={[volume]} onValueChange={handleVolumeChange} min={0} max={100} className="w-24" />
        </div>
        <div className="flex gap-2">
          {[0.5, 1, 1.5, 2].map((speed) => (
            <Button key={speed} onClick={() => changePlaybackSpeed(speed)} disabled={!isPlayerReady}>
              {speed}x
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={!isPlayerReady}>{qualityLabels[videoQuality]}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(qualityLabels).map(([key, label]) => (
                <DropdownMenuItem key={key} onSelect={() => setVideoQuality(key)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={toggleCaptions}>{captionsEnabled ? 'Hide Captions' : 'Show Captions'}</Button>
          <Button onClick={toggleFullscreen}><Fullscreen /></Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;