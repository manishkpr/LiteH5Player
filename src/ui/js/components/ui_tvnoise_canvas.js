class UITvNoiseCanvas {
  constructor(props) {
    this.props = props;

    //
    this.canvasElement = this.props.element;
    this.canvasContext;
    this.canvasWidth;
    this.canvasHeight;
    this.interferenceHeight = 50;
        this.lastFrameUpdate = 0;
        this.frameInterval = 60;
        this.useAnimationFrame = !!window.requestAnimationFrame;
        this.noiseAnimationWindowPos;
        this.frameUpdateHandlerId;

        this.renderFrame_ = this.renderFrame.bind(this);
    }

    start(v) {
        this.canvasWidth = v.width;
        this.canvasHeight = v.height;

        this.canvasContext = this.canvasElement.getContext('2d');
        this.noiseAnimationWindowPos = -this.canvasHeight;
        this.lastFrameUpdate = 0;

        this.canvasElement.style.width = this.canvasWidth.toString() + 'px';
        this.canvasElement.style.height = this.canvasHeight.toString() + 'px';

        this.renderFrame_();
    }

    stop() {
        if (this.useAnimationFrame) {
            cancelAnimationFrame(this.frameUpdateHandlerId);
        } else {
            clearTimeout(this.frameUpdateHandlerId);
        }
    }

    renderFrame() {
        // This code has been copied from the player controls.js and simplified

        if (this.lastFrameUpdate + this.frameInterval > new Date().getTime()) {
            // It's too early to render the next frame
            this.scheduleNextRender();
            return;
        }

        let currentPixelOffset;
        // let this.canvasWidth = this.canvasWidth;
        // let this.canvasHeight = this.canvasHeight;

        // Create texture
        let noiseImage = this.canvasContext.createImageData(this.canvasWidth, this.canvasHeight);

        // Fill texture with noise
        for (let y = 0; y < this.canvasHeight; y++) {
            for (let x = 0; x < this.canvasWidth; x++) {
                currentPixelOffset = (this.canvasWidth * y * 4) + x * 4;
                noiseImage.data[currentPixelOffset] = Math.random() * 255;
                if (y < this.noiseAnimationWindowPos || y > this.noiseAnimationWindowPos + this.interferenceHeight) {
                    noiseImage.data[currentPixelOffset] *= 0.85;
                }
                noiseImage.data[currentPixelOffset + 1] = noiseImage.data[currentPixelOffset];
                noiseImage.data[currentPixelOffset + 2] = noiseImage.data[currentPixelOffset];
                noiseImage.data[currentPixelOffset + 3] = 50;
            }
        }

        // Put texture onto canvas
        this.canvasContext.putImageData(noiseImage, 0, 0);

        this.lastFrameUpdate = new Date().getTime();
        this.noiseAnimationWindowPos += 0;
        if (this.noiseAnimationWindowPos > this.canvasHeight) {
            this.noiseAnimationWindowPos = -this.canvasHeight;
        }

        this.scheduleNextRender();
    }

    scheduleNextRender() {
        if (this.useAnimationFrame) {
            this.frameUpdateHandlerId = window.requestAnimationFrame(this.renderFrame_);
        } else {
            this.frameUpdateHandlerId = setTimeout(this.renderFrame_, this.frameInterval);
        }
    }
};

export default UITvNoiseCanvas;