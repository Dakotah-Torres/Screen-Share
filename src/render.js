
const videoElemet = document.querySelector("video");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const videoSelctorBtn = document.getElementById("videoSelctionBTn");

videoSelctorBtn.onclick = getVideoSources;

const { desktopCapturer , remote } = require('electron'); 
const { Menu } = remote

//get Avliable video Source 
async function getVideoSources() {

    const inputSources = await desktopCapturer.getSources({
        types:['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name, 
                click: () => selectSource( source )
            };

        })
    );
    videoOptionsMenu.popup(); 

}

let mediaRecorder; 
const recordedChunks = [];


async function selectSource( source) {
    videoSelctorBtn.innerText = source.name; 

    const constraints = {
         audio: false, 
         video: {
             mandatory: {
                 chromeMediaSource: 'desktop', 
                 chromeMediaSourceId: source.id
             }
         }
    }

    //Creat the Video Streem 

    const stream = await navigator.mediaDevices
        .getUserMedia( constraints ); 

    videoElemet.srcObject = stream; 
    videoElemet.play()

    const options = { mimeType: 'video/webm; codecs=vp9'}
    mediaRecorder = new MediaRecorder( stream, options); 

}