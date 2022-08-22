import "./Player.css"
import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"

export default function Player({document}) {
    const ref = useRef(null);
    const sliderRef = useRef(null);
    const waveRef = useRef(null);


    let curr_track = ref.current;
    let seekSlider = sliderRef.current;
    let waves = waveRef.current;

    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [artist, setArtist] = useState();
    const [music, setMusic] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [totalDuration, setTotalDuration] = useState("00:00");

    let updateTimer;

    useEffect(() => {
        if (document) {
            setImage(document.photoURL);
            setName(document.title);
            setArtist(document.createdBy.display)
            setMusic(document.audioURL);
        }

    }, [document]);

    useEffect(() => {
        if (music) {
            curr_track.src = music;
            curr_track.load();
            updateTimer = setInterval(setUpdate, 1000);
        }
    }, [music]);

    useEffect(() => {
        if (curr_track) {
            curr_track.addEventListener('ended', () => {
                setIsPlaying(false);
                waves.classList.remove('loaderon');
                waves.classList.add('loaderoff');
            });
        }

    }, [curr_track])

    function setUpdate() {
        let seekPosition = 0;
        if (!isNaN(curr_track.duration)) {
            seekPosition = currentTime * (100 / curr_track.duration);

            seekPosition = curr_track.currentTime * (100 / curr_track.duration);
            seekSlider.value = seekPosition;

            let currentMinutes = Math.floor(curr_track.currentTime / 60);
            let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
            let durationMinutes = Math.floor(curr_track.duration / 60);
            let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

            if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
            if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
            if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
            if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

            setCurrentTime(`${currentMinutes}:${currentSeconds}`);
            setTotalDuration(`${durationMinutes}:${durationMinutes}`);
        }
    }

    const playPauseTrack = () => {
        isPlaying ? pauseTrack() : playTrack();
    }
    const playTrack = () => {
        curr_track.play();
        setIsPlaying(true);
        waves.classList.remove('loaderoff');
        waves.classList.add('loaderon');

    }

    const pauseTrack = () => {
        curr_track.pause();
        setIsPlaying(false);
        waves.classList.remove('loaderon');
        waves.classList.add('loaderoff');
    }

    function seekTo(position) {
        let seekto = curr_track.duration * (position / 100);
        curr_track.currentTime = seekto;
        seekSlider.value = seekto;
    }

    const setVolume = (volume) => {
        curr_track.volume = volume / 100;
    }


    return (
        <div>
            {document && (
                <div className="wrapper">
                    <div className="player-details">
                        <img className="track-art" src={image} />
                        <h3 className="track-name"><marquee>{name}</marquee> </h3>
                        <Link exact to={`/user/${document.createdBy.id}`}><p className="track-artist">{artist}</p></Link>
                    </div>

                    <div className="slider_container">
                        <div className="current-time">{currentTime}</div>
                        <input type="range" min="0" max="100" step="0.5" defaultValue="0" ref={sliderRef} className="seek_slider" onChange={(e) => { seekTo(e.target.value) }} />
                        <div className="total-duration">{totalDuration}</div>
                    </div>

                    <div className="slider_container">
                        <i className="fa fa-volume-down"></i>
                        <input type="range" min="0" max="100" defaultValue="100" className="volume_slider" onChange={(e) => { setVolume(e.target.value) }} />
                        <i className="fa fa-volume-up"></i>
                    </div>

                    <div className="player-buttons">
                        {!isPlaying && <div className="playpause-track" onClick={() => { playPauseTrack() }}>
                            <i className="fa fa-play-circle fa-5x"></i>
                        </div>}
                        {isPlaying && <div className="playpause-track" onClick={() => { playPauseTrack() }}>
                            <i className="fa fa-pause-circle fa-5x"></i>
                        </div>}
                    </div>

                    <audio ref={ref} className="audioPlayer"></audio>

                    <div id="wave" className="loaderoff" ref={waveRef}>
                        <span className="stroke"></span>
                        <span className="stroke"></span>
                        <span className="stroke"></span>
                        <span className="stroke"></span>
                        <span className="stroke"></span>
                        <span className="stroke"></span>
                        <span className="stroke"></span>
                    </div>
                </div>
            )}
        </div>
    )
}
