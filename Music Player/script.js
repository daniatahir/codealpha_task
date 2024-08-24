

let container = document.querySelector(".container");
musicName = container.querySelector(".song-details .name");
let musicImg = document.querySelector(".img-area img");
let musicArtist = document.querySelector(".song-details .artist");
let musicAudio = document.querySelector("#main-audio");
let playpauseBtn = document.querySelector(".play-pause");
let nextBtn = document.querySelector("#next");
let prevBtn = document.querySelector("#prev");
let progressBar = document.querySelector(".progress-bar");
let progressArea = document.querySelector(".progress-area");
let repeatBtn = document.querySelector("#repeat-plist");
let moreBtn = document.querySelector("#more-music");
let closeBtn = document.querySelector("#close");
let moreList = document.querySelector(".music-list");
let image=document.querySelector("#image");


let musicIndex = 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
})

function loadMusic(indexNum) {
    musicName.innerText = allMusic[indexNum - 1].name;
    musicArtist.innerText = allMusic[indexNum - 1].artist;
    musicImg.src = `other/${allMusic[indexNum - 1].img}.jpg`;
    musicAudio.src = `other/${allMusic[indexNum - 1].src}.mp3`;
}
let playMusic = () => {
    container.classList.add("paused");
    playpauseBtn.querySelector("i").innerText = "pause";
    image.classList.add("onPlay");
    musicAudio.play();
}
let pauseMusic = () => {
    container.classList.remove("paused");
    playpauseBtn.querySelector("i").innerText = "play_arrow";
    musicImg.classList.remove("onPlay");
    musicAudio.pause();
}
playpauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
})
let nextMusic = () => {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();


}
let prevMusic = () => {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();

}
nextBtn.addEventListener("click", () => {
    nextMusic();
})
prevBtn.addEventListener("click", () => {
    prevMusic();
})

musicAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;

    progressBar.style.width = `${progressWidth}%`;



    let musicCurrentTime = container.querySelector(".current-time");
    let totalTime = container.querySelector(".max-duration");

    musicAudio.addEventListener("loadeddata", () => {
        let musicAdDura = musicAudio.duration;
        let totalMin = Math.floor(musicAdDura / 60);
        let totalSec = Math.floor(musicAdDura % 60);

        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        totalTime.innerText = `${totalMin}:${totalSec}`;

    })
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = musicAudio.duration;

    musicAudio.currentTime = (clickedOffSetX / progressWidth) * songDuration;
    playMusic();
})

repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;
    }
})

musicAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            musicAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let ranIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                let ranIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }
            while (musicIndex == ranIndex);
            musicIndex = ranIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
})
moreBtn.addEventListener("click", () => {
    moreList.classList.toggle("show");
})
closeBtn.addEventListener("click", () => {
    moreBtn.click();
})

let ulTag = document.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="other/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
    let AudioDuraTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);

        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        AudioDuraTag.innerText = `${totalMin}:${totalSec}`;
        AudioDuraTag.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    });
};

const allLiTags=ulTag.querySelectorAll("li");
function playingSong(){
    for(let j = 0; j < allLiTags.length; j++){
        let audioTag=allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDura=audioTag.getAttribute("t-duration");
            audioTag.innerText=adDura;
        }
        if(allLiTags[j].getAttribute("li-index") ==musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText="Playing";

        }
        allLiTags[j].setAttribute("onclick","clicked(this)");
    }
}
function clicked(element){
    let getLiIndex=element.getAttribute("li-index");
    musicIndex=getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();

}

