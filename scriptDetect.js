//Adding Voice
function speak (message) {
  var msg = new SpeechSynthesisUtterance(message)
  var voices = window.speechSynthesis.getVoices()
  msg.voice = voices[5];
  window.speechSynthesis.speak(msg)
}


//********FACE DETECTION************/

const video = document.getElementById('video')
const startingTo = document.getElementById('startingTo')
let dataURL = null;
let canceller = 0;


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi
    .TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    //start to take picture
    if(detections[0].expressions){
      video.pause();
      
      video.className = "shrink"
      startingTo.className = "analyze";
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')
      .drawImage(video, 0, 0, canvas.width, canvas.height);
      dataURL = canvas.toDataURL();
      if(canceller <= 0){
        canceller =+ 1
        if(dataURL != null){
          speak('analyzing now.')
          console.log(dataURL)
        }
      }
    }
  }, 100)
  
})