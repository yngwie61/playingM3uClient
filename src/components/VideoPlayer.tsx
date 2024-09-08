import React, { useEffect, useState } from 'react';
import Hls from 'hls.js';
import { useAuth } from '../contexts/AuthContext';
import './VideoPlayer.css';

const VideoPlayer: React.FC = () => {
    const auth = useAuth();
    const [isPlaying, setIsPlaying] = useState(false);
    const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
    const [showControls, setShowControls] = useState(false); // ホバー時のコントロール表示用

    useEffect(() => {
        if (auth && auth.idToken && Hls.isSupported()) {
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

    const handleUserInteraction = () => {
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video && hlsInstance) {
            video.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Failed to play the video:", error);
            });
        }
    };

    const togglePlayPause = () => {
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video.paused) {
            video.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Failed to play the video:", error);
            });
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const toggleFullScreen = () => {
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video.requestFullscreen) {
            video.requestFullscreen();
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

    return (
        <React.Fragment>
            {auth.idToken ? (
                <div 
                    className="video-container"
                    onMouseEnter={() => setShowControls(true)} 
                    onMouseLeave={() => setShowControls(false)}
                    onClick={handleUserInteraction}
                >
                    <div className="live-badge">LIVE</div>
                    <video id="video" className="video-player" controls={false} />
                    {showControls && (
                        <div className="controls">
                            <button className="play-pause-btn" onClick={togglePlayPause}>
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                            <button className="fullscreen-btn" onClick={toggleFullScreen}>Full Screen</button>
                            <button className="pip-btn" onClick={togglePictureInPicture}>PinP</button>
                            <input type="range" className="volume-control" min="0" max="100" />
                        </div>
                    )}
                </div>
            ) : (
                <p>動画プレイヤーを再生するには、ログインしてください。</p>
            )}
        </React.Fragment>
    );
};

export default VideoPlayer;
