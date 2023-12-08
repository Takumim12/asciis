/**
 * @module videoPlayer.js
 * @desc Video player initialization and helper
 * @category public
 *
 * Initializes a video player with an MP4 video source.
 * Returns a video element (initialized asynchronously).
 */

export default { init, muteVideo,};

let video;

function init(videoSource, callback) {
  // Avoid double initialization of the video object
  video = video || createVideoElement(videoSource, callback);
  return video
}

function createVideoElement(videoSource, callback) {
    // Create a video element
    const video = document.createElement('video');
    video.setAttribute('playsinline', ''); // Required to work on iOS 11 & up
    video.setAttribute('loop', ''); // Loop the video

    // Set the video source
    video.src = videoSource;
  
    // Handle video metadata loaded event
    video.addEventListener('loadedmetadata', function () {
      // Play the video only if initiated by a user interaction
      video.play();
      /*
      document.addEventListener('click', function playVideo() {
        video.play();
        // Remove the click event listener after the first user interaction
        document.removeEventListener('click', playVideo);
  
        if (typeof callback === 'function') callback(video.srcObject);
      });
      */
    });
  
    // Handle video error event
    video.addEventListener('error', function (err) {
      console.error('Error loading the video:', err.message);
    });
  
    return video;
  }

  function muteVideo() {
    if (video) {
      video.muted = true;
    }
  }