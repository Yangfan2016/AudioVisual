export class AudioVisual{
    constructor(file, audio, canvas, config) {
        // init
        this.audioFile = file;
        this.audioElement = audio;
        this.canvasElement = canvas;
        this.config =Object.assign(config || {},{
            isAutoRun: true,
            isVibrating: false,
            thickness: 1024, // Must be a power of 2 between 2^5 and 2^15, 32~32768. Defaults to 2048.
        });

        // setting
        this.state = "loading";
        this.__animateState = "stop";
        this.vibrateArr = [0, 0];

        // audio
        this.audioContext = new window.AudioContext();
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyser = this.audioContext.createAnalyser();

        this.analyser.fftSize = this.config.thickness;
        this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        // add listener to audio
        this.__onRunning();

        // canvas
        this.canvasContext = this.canvasElement.getContext("2d");
        this.canvasElement.width = window.outerWidth;
        this.canvasElement.height = window.outerHeight;
        this.canvasContext.strokeStyle = "#fff";
        this.canvasContext.rotate(Math.PI);
        this.canvasContext.translate(0, -this.canvasElement.height);
        this.canvasContext.scale(-1, 1);
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 128);
        this.canvasContext.lineTo(this.canvasElement.width, 128);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        // setting
        this.gradient = null;
        this.lw = 10;

        // vibrate
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

        // add listener to file
        this.__onFileChange();
    }
    __onRunning() {
        this.audioElement.addEventListener("play", ev => {
            this.state = "playing";
            this.config.isAutoRun && this.__animateState != "start" && this.startDance();
        });
        this.audioElement.addEventListener("pause", ev => {
            this.state = "paused";
            this.config.isAutoRun && this.stopDance();
        });
    }
    __onFileChange() {
        this.audioFile.addEventListener("change", ev => {
            var file = ev.target.files[0];
            // decode
            var reader = new FileReader();
            this.state = "paused";
            reader.addEventListener("load", ev => {
                var source = ev.target.result;
                this.state = "playing";
                this.__clearCanvas();
                this.audioElement.src = source;
                this.config.isAutoRun && (_ => {
                    this.audioElement.play();
                    this.startDance();
                })();
            });
            reader.readAsDataURL(file);
        });
    }
    __clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    __drawSLine(arr) {
        this.__clearCanvas();
        this.canvasContext.save();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 0);
        arr.forEach((item, n) => {
            this.gradient = this.canvasContext.createLinearGradient(n * (this.lw + 1), 0, n * (this.lw + 1), item);
            this.gradient.addColorStop(0, "#ffff00");
            this.gradient.addColorStop(0.2, "#ffd400");
            this.gradient.addColorStop(0.4, "#ffaa00");
            this.gradient.addColorStop(0.6, "#ff7f00");
            this.gradient.addColorStop(0.8, "#ff5500");
            this.gradient.addColorStop(1, "#ff2a00");
            this.canvasContext.fillStyle = this.gradient;
            this.canvasContext.fillRect(n * (this.lw + 1), 0, this.lw, item);
        });
        this.canvasContext.closePath();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 128);
        this.canvasContext.lineTo(this.canvasElement.width, 128);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.restore();
    }
    __animate() {
        this.analyser.getByteFrequencyData(this.freqByteData);
        this.__drawSLine(this.freqByteData);
        this.config.isVibrating && (_ => {
            this.vibrateArr = this.freqByteData.filter(function (item, n) {
                return item > 10 && item < 200;
            });
            this.vibrateArr = [
                Math.max.apply(null, this.vibrateArr),
                Math.min.apply(null, this.vibrateArr)
            ];
            navigator.vibrate(this.vibrateArr[0]);
        })();
    }
    stopDance(cb) {
        this.__animateState = "stop";
        clearTimeout(this.__TIMEOUT_ID);
        this.__TIMEOUT_ID = setTimeout(_ => {
            clearInterval(this.__INTERVAL_ID);
            this.__clearCanvas();
            cb && cb();
        }, 1500);
        this.config.isVibrating && navigator.vibrate(0);
    }
    startDance() {
        clearTimeout(this.__TIMEOUT_ID);
        clearInterval(this.__INTERVAL_ID);
        this.__animateState = "start";
        this.__INTERVAL_ID = setInterval(this.__animate.bind(this), this.vibrateArr[1]);
    }
}