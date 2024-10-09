console.log(`Lets start javascript`);
var sang;
var songs; 
let currFolder;
let currSong = new Audio();

function secTomin(durationInSeconds) {
    if (isNaN(durationInSeconds) || durationInSeconds < 0) {
        return "Invalid Input";
    }
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = " ";
    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <img width="30px" src="images/musicpic.jpg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
            </div>
            <div class="plynw">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="#1ed760"/>
                    <polygon points="35,25 75,50 35,75" fill="black"/>
                </svg>
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            now.src = "Logos/pause.svg";
        });
    });

    now.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play();
            now.src = "Logos/pause.svg";
        } else {
            currSong.pause();
            now.src = "Logos/now.svg";
        }
    });

    currSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secTomin(currSong.currentTime)} / ${secTomin(currSong.duration)}`;
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
    });
}

const playMusic = (track, pause = false) => {
    currSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currSong.play();
        now.src = "Logos/pause.svg";
    }
    document.querySelector(".songName").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
    return songs;
}


async function displayAlbums() {
            const response = await fetch('http://127.0.0.1:5501/songs/');
            const htmlText = await response.text();
            const div = document.createElement('div');
            div.innerHTML = htmlText;
            const anchors = div.getElementsByTagName('a');
    
            const cardsContainer = document.querySelector('.cards');
            cardsContainer.innerHTML = '';  // Clear previous content
    
            for (let e of anchors) {
                if (e.href.includes('/songs')) {
                    const folder = e.href.split('/')[4];
                    try {
                        const infoResponse = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`);
                        const info = await infoResponse.json();
                        const cardHTML = `
                            <div data-folder="${folder}" class="card">
                                <div class="play">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="#1ed760"/>
                                        <polygon points="35,25 75,50 35,75" fill="black"/>
                                    </svg>
                                </div>
                                <div class="image">
                                    <img src="/songs/${folder}/cover.jpg" alt="">
                                </div>
                                <div class="heading">${info.title}</div>
                                <div class="cardcontent">${info.description}</div>
                            </div>`;
    
                        cardsContainer.innerHTML += cardHTML;
                    } catch (infoError) {
                        // console.error(`Error fetching metadata for folder ${folder}:`, infoError);
                    }
                }
            }
    

    document.querySelectorAll('.card').forEach(e => {
        e.addEventListener('click', async event => {
            const folder = event.currentTarget.dataset.folder;
            if (folder) {
                await getSongs(`songs/${folder}`);
            }
        });
    });
}

async function main() {
    await getSongs("songs/ncs");
    playMusic(songs[0], true);
    displayAlbums();

    document.querySelector(".dur").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = (currSong.duration * percent) / 100;
    });

    document.querySelector(".hamb").addEventListener("click", e => {
        document.querySelector("aside").style.left = "0";
    });

    document.querySelector(".cross").addEventListener("click", e => {
        document.querySelector("aside").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
            now.src = "Logos/pause.svg";
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
            now.src = "Logos/pause.svg";
        }
    });

    document.querySelector(".r").getElementsByTagName("input")[0].addEventListener("change", e => {
        currSong.volume = parseInt(e.target.value) / 100;
    });

    vol.addEventListener("click", () => {
        if (currSong.volume == 0) {
            vol.src = "Logos/vol.svg";
            currSong.volume = 0.5;
        } else {
            vol.src = "Logos/mute.svg";
            currSong.volume = 0.0;
        }
    });
}

main();
