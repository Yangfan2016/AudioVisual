interface iConfig {
    isAutoRun: boolean,
    thickness: number,
    hightRate: number,
    colorStops: Array<string>,
    fileElement?:HTMLInputElement
}

export class AudioVisual {
    private animateState: string;
    private TIMEOUT_ID: any;
    private RAF_ID: number = 0;
    config: iConfig;
    audioFile?: HTMLInputElement;
    audioElement: HTMLAudioElement;
    canvasElement: HTMLCanvasElement;
    audioContext: AudioContext;
    sourceNode: MediaElementAudioSourceNode;
    analyser: AnalyserNode;
    freqByteData: Uint8Array;
    canvasContext: any;
    gradient: any;
    lw: number;
    colorKey: any={};
    state: string;
    constructor(audio:HTMLAudioElement, canvas:HTMLCanvasElement, config:iConfig) {
        // init
        this.audioFile = config.fileElement;
        this.audioElement = audio;
        this.canvasElement = canvas;
        this.config = Object.assign({}, {
            isAutoRun: true,
            thickness: 1024, // Must be a power of 2 between 2^5 and 2^15, 32~32768. Defaults to 2048.
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
        if (this.audioFile) this.onFileChange();
    }
    private onRunning() {
        this.audioElement.addEventListener("play", ev => {
            this.state = "playing";
            this.config.isAutoRun && this.animateState != "start" && this.startDance();
        });
        this.audioElement.addEventListener("pause", ev => {
            this.state = "paused";
            this.config.isAutoRun && this.stopDance();
        });
    }
    private onFileChange() {
        if (!this.audioFile) return;
        this.audioFile.addEventListener("change", ev => {
            let file: File = (ev.target as any).files[0];
            // decode
            let reader = new FileReader();
            this.state = "paused";
            reader.addEventListener("load", ev => {
                let source = (ev.target as any).result;
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
    private clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    private drawSLine(arr:any) {
        this.clearCanvas();
        this.canvasContext.save();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 0);

        let rate = this.config.hightRate;

        arr.forEach((item:any, n:number) => {
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
    private animate() {
        this.analyser.getByteFrequencyData(this.freqByteData);
        this.drawSLine(this.freqByteData);
        requestAnimationFrame(this.animate.bind(this));
    }
    makeColorStop() {
        let colorStops = this.config.colorStops;
        let len = colorStops.length;
        let step = +(1 / (len - 1)).toFixed(1);
        let colorKey:any = {};

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