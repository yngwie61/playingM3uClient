import React, { useEffect, useState } from 'react';
import Hls from 'hls.js';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 5%;
  left: 10%;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  visibility: visible;
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  width: 20%;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  flex: 0 0 auto;
  margin-right: 10px;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const VolumeControl = styled.input`
  width: 20%;
  cursor: pointer;
  flex: 1 0 auto;
  margin-left: 10px;
`;

const LiveBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: red;
  color: white;
  padding: 5px 10px;
  font-weight: bold;
`;

const VideoPlayer: React.FC = () => {
    const auth = useAuth();
    // auth.idtoken;
    const [isPlaying, setIsPlaying] = useState(false);
    const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
    const [showControls, setShowControls] = useState(false);
    const [volume, setVolume] = useState(50);

    useEffect(() => {
        if (Hls.isSupported()) {
            const video = document.getElementById('video') as HTMLVideoElement;
            const hls = new Hls({
                liveSyncDuration: 3,
                liveMaxLatencyDuration: 5,
                maxBufferLength: 10,
                lowLatencyMode: true,
            });
            hls.loadSource('http://localhost:8000/vv/master.m3u8');
            hls.attachMedia(video);
            setHlsInstance(hls);

            return () => {
                hls.destroy();
            };
        }
    }, [auth]);

    const togglePlayPause = () => {
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video) {
            if (!video.paused) {
                video.pause();
                setIsPlaying(false);
            } else {
                video.play().then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.error("Failed to play the video:", error);
                });
            }
        }
    };

    const toggleFullScreen = () => {
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const togglePictureInPicture = () => {
        const video = document.getElementById('video') as HTMLVideoElement;
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else if (video.requestPictureInPicture) {
            video.requestPictureInPicture();
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const video = document.getElementById('video') as HTMLVideoElement;
        const newVolume = parseInt(event.target.value, 10);
        setVolume(newVolume);
        if (video) {
            video.volume = newVolume / 100;
        }
    };

    return (
        <React.Fragment>
            {true ? (
                <VideoContainer
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                >
                    <LiveBadge>LIVE</LiveBadge>
                    <VideoElement id="video" controls={false} />
                    {showControls && (
                        <Controls>
                            <ControlButton onClick={togglePlayPause}>
                                {isPlaying ? 'pause' : 'play'}
                            </ControlButton>
                            <ControlButton onClick={toggleFullScreen}>Full Screen</ControlButton>
                            <ControlButton onClick={togglePictureInPicture}>PinP</ControlButton>
                            <VolumeControl
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                            />
                        </Controls>
                    )}
                </VideoContainer>
            ) : (
                <p>動画プレイヤーを再生するには、ログインしてください。</p>
            )}
        </React.Fragment>
    );
};

export default VideoPlayer;
