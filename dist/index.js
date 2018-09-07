(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AudioVisual = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var AudioVisual =
  /*#__PURE__*/
  function () {
    function AudioVisual(file, audio, canvas, config) {
      _classCallCheck(this, AudioVisual);

      // init
      this.audioFile = file;
      this.audioElement = audio;
      this.canvasElement = canvas;
      this.config = Object.assign(config || {}, {
        isAutoRun: true,
        isVibrating: false,
        thickness: 1024 // Must be a power of 2 between 2^5 and 2^15, 32~32768. Defaults to 2048.

      }); // setting

      this.state = "loading";
      this.__animateState = "stop";
      this.vibrateArr = [0, 0]; // audio

      this.audioContext = new window.AudioContext();
      this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.config.thickness;
      this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination); // add listener to audio

      this.__onRunning(); // canvas


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
      this.canvasContext.closePath(); // setting

      this.gradient = null;
      this.lw = 10; // vibrate

      navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate; // add listener to file

      this.__onFileChange();
    }

    _createClass(AudioVisual, [{
      key: "__onRunning",
      value: function __onRunning() {
        var _this = this;

        this.audioElement.addEventListener("play", function (ev) {
          _this.state = "playing";
          _this.config.isAutoRun && _this.__animateState != "start" && _this.startDance();
        });
        this.audioElement.addEventListener("pause", function (ev) {
          _this.state = "paused";
          _this.config.isAutoRun && _this.stopDance();
        });
      }
    }, {
      key: "__onFileChange",
      value: function __onFileChange() {
        var _this2 = this;

        this.audioFile.addEventListener("change", function (ev) {
          var file = ev.target.files[0]; // decode

          var reader = new FileReader();
          _this2.state = "paused";
          reader.addEventListener("load", function (ev) {
            var source = ev.target.result;
            _this2.state = "playing";

            _this2.__clearCanvas();

            _this2.audioElement.src = source;
            _this2.config.isAutoRun && function (_) {
              _this2.audioElement.play();

              _this2.startDance();
            }();
          });
          reader.readAsDataURL(file);
        });
      }
    }, {
      key: "__clearCanvas",
      value: function __clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      }
    }, {
      key: "__drawSLine",
      value: function __drawSLine(arr) {
        var _this3 = this;

        this.__clearCanvas();

        this.canvasContext.save();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 0);
        arr.forEach(function (item, n) {
          _this3.gradient = _this3.canvasContext.createLinearGradient(n * (_this3.lw + 1), 0, n * (_this3.lw + 1), item);

          _this3.gradient.addColorStop(0, "#ffff00");

          _this3.gradient.addColorStop(0.2, "#ffd400");

          _this3.gradient.addColorStop(0.4, "#ffaa00");

          _this3.gradient.addColorStop(0.6, "#ff7f00");

          _this3.gradient.addColorStop(0.8, "#ff5500");

          _this3.gradient.addColorStop(1, "#ff2a00");

          _this3.canvasContext.fillStyle = _this3.gradient;

          _this3.canvasContext.fillRect(n * (_this3.lw + 1), 0, _this3.lw, item);
        });
        this.canvasContext.closePath();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 128);
        this.canvasContext.lineTo(this.canvasElement.width, 128);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.restore();
      }
    }, {
      key: "__animate",
      value: function __animate() {
        var _this4 = this;

        this.analyser.getByteFrequencyData(this.freqByteData);

        this.__drawSLine(this.freqByteData);

        this.config.isVibrating && function (_) {
          _this4.vibrateArr = _this4.freqByteData.filter(function (item, n) {
            return item > 10 && item < 200;
          });
          _this4.vibrateArr = [Math.max.apply(null, _this4.vibrateArr), Math.min.apply(null, _this4.vibrateArr)];
          navigator.vibrate(_this4.vibrateArr[0]);
        }();
      }
    }, {
      key: "stopDance",
      value: function stopDance(cb) {
        var _this5 = this;

        this.__animateState = "stop";
        clearTimeout(this.__TIMEOUT_ID);
        this.__TIMEOUT_ID = setTimeout(function (_) {
          clearInterval(_this5.__INTERVAL_ID);

          _this5.__clearCanvas();

          cb && cb();
        }, 1500);
        this.config.isVibrating && navigator.vibrate(0);
      }
    }, {
      key: "startDance",
      value: function startDance() {
        clearTimeout(this.__TIMEOUT_ID);
        clearInterval(this.__INTERVAL_ID);
        this.__animateState = "start";
        this.__INTERVAL_ID = setInterval(this.__animate.bind(this), this.vibrateArr[1]);
      }
    }]);

    return AudioVisual;
  }();

  _exports.AudioVisual = AudioVisual;
});