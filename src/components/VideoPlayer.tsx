import React, { useEffect, useState, useContext } from 'react';
import Hls from 'hls.js';
import { useAuth } from '../contexts/AuthContext';


const VideoPlayer: React.FC = () => {
    const auth = useAuth();
    if (!auth) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    useEffect(() => {
        if (Hls.isSupported()) {
            const video = document.getElementById('video') as HTMLVideoElement;
            const hls = new Hls();
            hls.loadSource('http://localhost:8000/vv/master.m3u8');
            hls.attachMedia(video);
        }
    }, [auth]);

    return (
        <React.Fragment>
            {auth.idToken ? (
                <React.Fragment>
                    <video id="video" controls className="video-player" />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <p> 動画プレイヤーを再生するには、ログインしてください </p>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default VideoPlayer;
