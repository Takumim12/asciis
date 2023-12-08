/**
 * @author ertdfgcvb
 * @title  Video Grayscale
 * @desc   Grayscale input from MP4 video displayed with ASCII characters
 */


import { sort } from '/src/modules/sort.js';
import videoPlayer from '/src/modules/videoPlayer.js';
import Canvas from '/src/modules/canvas.js';


fetch("https://raw.githubusercontent.com/blindman67/SimplexNoiseJS/master/simplexNoise.js")
.then(e => e.text())
.then(e => {
	const openSimplexNoise = new Function("return " + e)()
	noise3D = openSimplexNoise(Date.now()).noise3D
})
// Stub function
function noise3D() { return 0 }

// Path or URL to your MP4 video file
const mp4VideoSource = 'video.mp4';
const mp3AudioSource = 'audio.mp3';


// Initialize video, canvas, and density mapping
const cam = videoPlayer.init(mp4VideoSource);
videoPlayer.muteVideo();
const can = new Canvas();

// MP3の初期化と再生 (audio auto-play)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const audioElement = new Audio(mp3AudioSource);
const audioSource = audioContext.createMediaElementSource(audioElement);
audioSource.connect(analyser);
analyser.connect(audioContext.destination);

// Auto-play audio when the page loads
document.addEventListener('DOMContentLoaded', () => {
  audioElement.play().catch(error => {
    console.error('Error playing audio:', error);
  });
});




///------
let currentAmplitude = 0;

// イージング関数（ここでは単純な線形補間を使用）
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ランダムなamplitudeの変化
function updateRandomAmplitude() {
  const targetAmplitude = getAmplitude(); // ターゲットamplitudeをランダムに選択
  const duration = 3000; // 変化にかかる時間（ミリ秒）
  let startTime = null;
  function animate(time) {
    if (!startTime) startTime = time;
    const progress = (time - startTime) / duration;
    currentAmplitude = easeInOutCubic(progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// ランダムなamplitudeの変化を開始
updateRandomAmplitude();

///------


function getAmplitude() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  const length = dataArray.length;

  for (let i = 0; i < length; i++) {
    sum += dataArray[i];
  }

  return sum / length / 256;
}


const density = 'Technograph+- '

const data = [];


// Append the button to the document body


export function pre(context, cursor, buffer) {
  const aspectRatio = context.metrics.aspect;
  can.resize(context.cols, context.rows);
  can.cover(cam, aspectRatio).writeTo(data);
  const amplitude = getAmplitude();

 
}

export function main(coord, context, cursor, buffer) {
	// Coord contains the index of each cell
	const color = data[coord.index];
	const index = Math.floor(color.v * (density.length-2)*1.1)

  const amplitude = currentAmplitude;

	const t = context.time * (amplitude*0.005);
	const s = 0.1;
	const x = coord.x * s;
	const y = coord.y * s / context.metrics.aspect + t;
	const i = Math.floor((noise3D(x, y, t) * 0.1) * (density.length+1));

  const z = i -(amplitude*0.00000000000000025)
	return density[index+i];
	
}
