export class AudioVisual {
    constructor(audio, canvas, config) {
        this.RAF_ID = 0;
        this.colorKey = {};
        // init
        this.audioFile = config.fileElement;
        this.audioElement = audio;
        this.canvasElement = canvas;
        this.config = Object.assign({}, {
            isAutoRun: true,
            thickness: 1024,
            hightRate: 2,
            colorStops: [
                "#2653f7",
                "#26daf7",
                "#26f736",
                "#b0f726",
                "#f78726",
                "#db1b12"
            ]
        }, config);
        // setting
        this.state = "loading";
        this.animateState = "stop";
        // audio
        this.audioContext = new AudioContext();
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = this.config.thickness;
        this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        // add listener to audio
        this.onRunning();
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
        this.makeColorStop();
        // add listener to file
        if (this.audioFile)
            this.onFileChange();
    }
    onRunning() {
        this.audioElement.addEventListener("play", ev => {
            this.state = "playing";
            this.config.isAutoRun && this.animateState != "start" && this.startDance();
        });
        this.audioElement.addEventListener("pause", ev => {
            this.state = "paused";
            this.config.isAutoRun && this.stopDance();
        });
    }
    onFileChange() {
        if (!this.audioFile)
            return;
        this.audioFile.addEventListener("change", ev => {
            let file = ev.target.files[0];
            // decode
            let reader = new FileReader();
            this.state = "paused";
            reader.addEventListener("load", ev => {
                let source = ev.target.result;
                this.state = "playing";
                this.clearCanvas();
                this.audioElement.src = source;
                this.config.isAutoRun && (_ => {
                    this.audioElement.play();
                    this.startDance();
                })();
            });
            reader.readAsDataURL(file);
        });
    }
    clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    drawSLine(arr) {
        this.clearCanvas();
        this.canvasContext.save();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 0);
        let rate = this.config.hightRate;
        arr.forEach((item, n) => {
            this.gradient = this.canvasContext.createLinearGradient(n * (this.lw + 1), 0, n * (this.lw + 1), item);
            for (let pos in this.colorKey) {
                this.gradient.addColorStop(+pos, this.colorKey[pos]);
            }
            this.canvasContext.fillStyle = this.gradient;
            this.canvasContext.fillRect(n * (this.lw + 1), 0, this.lw, item * rate);
        });
        this.canvasContext.closePath();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 128);
        this.canvasContext.lineTo(this.canvasElement.width, 128);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.restore();
    }
    animate() {
        this.analyser.getByteFrequencyData(this.freqByteData);
        this.drawSLine(this.freqByteData);
        requestAnimationFrame(this.animate.bind(this));
    }
    makeColorStop() {
        let colorStops = this.config.colorStops;
        let len = colorStops.length;
        let step = +(1 / (len - 1)).toFixed(1);
        let colorKey = {};
        for (let i = 0; i < len; i++) {
            colorKey[step * i] = colorStops[i];
        }
        this.colorKey = colorKey;
    }
    stopDance(cb = () => { }) {
        this.animateState = "stop";
        clearTimeout(this.TIMEOUT_ID);
        this.TIMEOUT_ID = setTimeout(_ => {
            cancelAnimationFrame(this.RAF_ID);
            this.clearCanvas();
            cb && cb();
        }, 1500);
    }
    startDance() {
        clearTimeout(this.TIMEOUT_ID);
        cancelAnimationFrame(this.RAF_ID);
        this.animateState = "start";
        this.RAF_ID = requestAnimationFrame(this.animate.bind(this));
    }
}
