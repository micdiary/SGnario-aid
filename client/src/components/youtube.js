import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId }) => {
    const playerRef = useRef(null);
    
    const opts = {
        height: '360',
        width: '640',
        playerVars: {
            autoplay: 0,
        },
    };
    
    const resetVideo = () => {
        if (playerRef.current) {
            playerRef.current.internalPlayer.seekTo(0);
            playerRef.current.internalPlayer.pauseVideo();
        }
    };
    useEffect(() => {
        resetVideo();
    }, []);
    
    return (
        <div>
        <YouTube videoId={videoId} opts={opts} ref={playerRef} onReady={resetVideo} />
        </div>
    );
};

export default VideoPlayer;


