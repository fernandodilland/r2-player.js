// r2-player.js

class R2Player extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Create the main container
        const playerContainer = document.createElement('div');
        playerContainer.classList.add('player-container');

        // Create the video element
        this.video = document.createElement('video');
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('preload', 'metadata');
        playerContainer.appendChild(this.video);

        // Create the loading spinner
        this.loadingSpinner = document.createElement('div');
        this.loadingSpinner.classList.add('loading-spinner');
        this.loadingSpinner.innerHTML = `
            <div class="spinner"></div>
        `;
        playerContainer.appendChild(this.loadingSpinner);

        // Create the controls container
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.classList.add('controls-container');
        this.controlsContainer.innerHTML = `
            <button id="play-pause" class="control-button" aria-label="Play/Pause">►</button>
            <div class="progress-container" id="progress-container">
                <div class="buffered-bar" id="buffered-bar"></div>
                <div class="progress-bar" id="progress-bar"></div>
            </div>
            <div class="controls-right">
                <div class="volume-container">
                    <button id="volume" class="control-button" aria-label="Mute/Unmute">🔊</button>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1" />
                </div>
                <button id="quality-button" class="control-button" aria-label="Change Quality">Auto</button>
                <button id="fullscreen" class="control-button" aria-label="Fullscreen">⛶</button>
            </div>
            <div id="quality-menu" class="quality-menu">
                <ul id="quality-options"></ul>
            </div>
        `;
        playerContainer.appendChild(this.controlsContainer);

        // Create the thumbnail preview
        this.thumbnailPreview = document.createElement('div');
        this.thumbnailPreview.id = 'thumbnail-preview';
        this.thumbnailPreview.classList.add('thumbnail-preview');
        this.thumbnailPreview.innerHTML = `<img id="thumbnail-image" src="" alt="Thumbnail">`;
        playerContainer.appendChild(this.thumbnailPreview);

        // Append the player container to the shadow root
        this.shadowRoot.appendChild(playerContainer);

        // Include styles
        const style = document.createElement('style');
        style.textContent = `
            /* General Styles */
            :host {
                display: inline-block;
                position: relative;
                width: var(--player-width, 800px);
                height: var(--player-height, 450px);
            }

            .player-container {
                position: relative;
                width: 100%;
                height: 100%;
                background-color: #000;
                border-radius: 10px;
                overflow: hidden;
                cursor: default;
            }

            video {
                width: 100%;
                height: 100%;
                display: block;
                background-color: #000;
            }

            /* Loading Spinner */
            .loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 20;
                display: none;
            }

            .spinner {
                border: 8px solid rgba(255, 255, 255, 0.3);
                border-top: 8px solid #1db954;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Thumbnail Preview */
            .thumbnail-preview {
                position: absolute;
                bottom: 70px;
                width: 160px;
                height: 90px;
                pointer-events: none;
                border: 1px solid #fff;
                background-color: rgba(0, 0, 0, 0.7);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                opacity: 0;
            }

            .thumbnail-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 4px;
            }

            /* Custom Controls */
            .controls-container {
                position: absolute;
                bottom: 0;
                width: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                padding: 10px;
                opacity: 1;
                visibility: visible;
                overflow: visible;
            }

            .controls-container.hidden {
                opacity: 0;
                visibility: hidden;
            }

            .control-button {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.2em;
                margin: 0 5px;
                cursor: pointer;
                transition: color 0.3s;
            }

            .control-button:hover {
                color: #1db954;
            }

            .progress-container {
                flex: 1;
                height: 10px;
                background: #555;
                margin: 0 10px;
                cursor: pointer;
                position: relative;
                border-radius: 5px;
            }

            .buffered-bar {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: #999;
                width: 0%;
                border-radius: 5px;
            }

            .progress-bar {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: #1db954;
                width: 0%;
                border-radius: 5px;
            }

            .controls-right {
                display: flex;
                align-items: center;
                overflow: visible;
            }

            /* Volume Container */
            .volume-container {
                position: relative;
                display: flex;
                align-items: center;
                margin-right: 10px;
                overflow: visible;
            }

            #volume-slider {
                position: absolute;
                bottom: calc(100% + 10px);
                left: 50%;
                transform: translateX(-50%) rotate(-90deg);
                transform-origin: center;
                width: 100px;
                height: 4px;
                opacity: 0;
                transition: opacity 0.3s ease;
                background: #555;
                border-radius: 2px;
            }

            /* Remove hover CSS, manage via JavaScript */
            /* Quality Menu */
            .quality-menu {
                position: absolute;
                bottom: 50px;
                right: 10px;
                background-color: rgba(0, 0, 0, 0.9);
                border: 1px solid #444;
                border-radius: 4px;
                width: 120px;
                z-index: 1000;
                display: none;
            }

            .quality-menu ul {
                list-style: none;
                margin: 0;
                padding: 5px 0;
            }

            .quality-menu li {
                padding: 8px 12px;
                cursor: pointer;
                color: #fff;
                font-size: 0.9em;
            }

            .quality-menu li:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .quality-menu li.active {
                background-color: rgba(255, 255, 255, 0.2);
            }

            /* Fullscreen Button */
            #fullscreen {
                margin-left: 10px;
            }

            /* Responsive Adjustments */
            @media (max-width: 600px) {
                .controls-container {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .controls-right {
                    margin-top: 10px;
                }

                .volume-container {
                    margin-right: 0;
                }

                .quality-menu {
                    bottom: 60px;
                    right: 5px;
                }

                .thumbnail-preview {
                    bottom: 80px;
                }
            }
        `;
        this.shadowRoot.appendChild(style);

        // Initialize variables
        this.hls = null;
        this.availableQualities = [];
        this.currentQuality = -1;
        this.totalThumbnails = 256; // Adjust as needed

        // Bind methods
        this.initializePlayer = this.initializePlayer.bind(this);
        this.initializeControls = this.initializeControls.bind(this);

        // Mouse inactivity timer
        this.mouseActivityTimeout = null;
        this.controlsVisible = true;
    }

    // Observe attributes for changes
    static get observedAttributes() {
        return ['src', 'width', 'height', 'autoplay', 'controls-visible', 'muted', 'loop', 'thumbnails', 'volume', 'quality'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (['src', 'width', 'height', 'autoplay', 'controls-visible', 'muted', 'loop', 'thumbnails', 'volume', 'quality'].includes(name)) {
            this.initializePlayer();
        }
    }

    connectedCallback() {
        // Get configurations from attributes
        this.src = this.getAttribute('src') || '';
        this.width = this.getAttribute('width') || '800';
        this.height = this.getAttribute('height') || '450';
        this.autoPlay = this.hasAttribute('autoplay');
        this.controlsAlwaysVisible = this.getAttribute('controls-visible') !== 'false';
        this.muted = this.hasAttribute('muted');
        this.loop = this.hasAttribute('loop');
        this.thumbnailEnabled = this.getAttribute('thumbnails') !== 'false';
        this.defaultVolume = parseFloat(this.getAttribute('volume')) || 1.0;
        this.defaultQuality = this.getAttribute('quality') || 'auto'; // 'auto', 'high', 'low', or specific height

        // Apply width and height via CSS variables
        this.style.setProperty('--player-width', `${this.width}px`);
        this.style.setProperty('--player-height', `${this.height}px`);

        // Set video attributes
        this.video.muted = this.muted;
        this.video.loop = this.loop;
        this.video.volume = this.defaultVolume;

        // Hide controls if not always visible
        if (!this.controlsAlwaysVisible) {
            this.controlsContainer.style.display = 'flex';
            this.controlsContainer.classList.add('hidden');
        } else {
            this.controlsContainer.style.display = 'flex';
            this.controlsContainer.classList.remove('hidden');
        }

        // Initialize the player and controls
        this.initializePlayer();
        this.initializeControls();
    }

    disconnectedCallback() {
        if (this.hls) {
            this.hls.destroy();
        }
    }

    initializePlayer() {
        if (!this.src) {
            console.error('No source provided for R2Player.');
            return;
        }

        // Show loading spinner
        this.loadingSpinner.style.display = 'block';

        // Update video source
        const videoSrc = `${this.src}/master.m3u8`;
        const thumbnailsBase = `${this.src}/thumbnails/thumb`;

        // Clean up existing HLS instance if any
        if (this.hls) {
            this.hls.destroy();
        }

        if (window.Hls && Hls.isSupported()) {
            this.hls = new Hls({
                autoStartLoad: true,
                startPosition: -1,
                maxBufferLength: 30,
                debug: false,
            });
            this.hls.loadSource(videoSrc);
            this.hls.attachMedia(this.video);
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.loadingSpinner.style.display = 'none';
                if (this.autoPlay) {
                    this.video.play();
                }
                // Retrieve available quality levels
                const levels = this.hls.levels;
                this.availableQualities = levels.map((level, index) => ({
                    index: index,
                    height: level.height,
                    bitrate: level.bitrate,
                }));
                this.populateQualityMenu();
                this.setInitialQuality();
            });
            this.hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                this.currentQuality = data.level;
                this.updateQualityButton();
            });
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS.js error:', data);
                this.loadingSpinner.style.display = 'none';
            });
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = videoSrc;
            this.video.addEventListener('loadedmetadata', () => {
                this.loadingSpinner.style.display = 'none';
                if (this.autoPlay) {
                    this.video.play();
                }
                // Note: Safari does not expose available quality levels directly
                this.availableQualities = [];
                this.populateQualityMenu();
            });
        } else {
            alert('Your browser does not support HLS.');
            this.loadingSpinner.style.display = 'none';
        }

        // Handle thumbnails
        if (this.thumbnailEnabled) {
            this.setupThumbnails(thumbnailsBase);
        } else {
            this.thumbnailPreview.style.display = 'none';
        }
    }

    initializeControls() {
        const playPauseButton = this.shadowRoot.getElementById('play-pause');
        const progressContainer = this.shadowRoot.getElementById('progress-container');
        const progressBar = this.shadowRoot.getElementById('progress-bar');
        const bufferedBar = this.shadowRoot.getElementById('buffered-bar');
        const volumeButton = this.shadowRoot.getElementById('volume');
        const volumeSlider = this.shadowRoot.getElementById('volume-slider');
        const qualityButton = this.shadowRoot.getElementById('quality-button');
        const qualityMenu = this.shadowRoot.getElementById('quality-menu');
        const qualityOptions = this.shadowRoot.getElementById('quality-options');
        const fullscreenButton = this.shadowRoot.getElementById('fullscreen');
        const playerContainer = this.shadowRoot.querySelector('.player-container');

        // Initialize Play/Pause Button Icon
        if (this.autoPlay) {
            playPauseButton.textContent = '❚❚';
        } else {
            playPauseButton.textContent = '►';
        }

        // Update Play/Pause button on video events
        this.video.addEventListener('play', () => {
            playPauseButton.textContent = '❚❚';
        });

        this.video.addEventListener('pause', () => {
            playPauseButton.textContent = '►';
        });

        // Toggle Play/Pause
        playPauseButton.addEventListener('click', () => {
            if (this.video.paused || this.video.ended) {
                this.video.play();
            } else {
                this.video.pause();
            }
        });

        // Update progress bar as the video plays
        this.video.addEventListener('timeupdate', () => {
            if (this.video.duration) {
                const percent = (this.video.currentTime / this.video.duration) * 100;
                progressBar.style.width = `${percent}%`;
            }
        });

        // Update buffered bar as the video loads
        this.video.addEventListener('progress', () => {
            if (this.video.buffered.length > 0 && this.video.duration) {
                const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1);
                const percent = (bufferedEnd / this.video.duration) * 100;
                bufferedBar.style.width = `${percent}%`;
            }
        });

        // Seek video when clicking on progress bar
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const posX = e.clientX - rect.left;
            const percent = posX / rect.width;
            this.video.currentTime = percent * this.video.duration;
        });

        // Show thumbnail preview when hovering over progress bar
        progressContainer.addEventListener('mousemove', (e) => {
            if (!this.video.duration) return;
            const rect = progressContainer.getBoundingClientRect();
            const posX = e.clientX - rect.left;
            const percent = posX / rect.width;
            const time = percent * this.video.duration;

            // Calculate the thumbnail index
            const thumbIndex = Math.min(
                Math.floor((time / this.video.duration) * this.totalThumbnails) + 1,
                this.totalThumbnails
            );

            // Update the thumbnail image source
            const thumbnailImage = this.thumbnailPreview.querySelector('#thumbnail-image');
            thumbnailImage.src = `${this.src}/thumbnails/thumb${thumbIndex}.webp`;

            // Position the thumbnail preview directly above the mouse
            const thumbnailWidth = this.thumbnailPreview.offsetWidth;
            let previewX = e.clientX - playerContainer.getBoundingClientRect().left - (thumbnailWidth / 2);

            // Ensure the thumbnail does not go outside the player container
            const playerWidth = playerContainer.clientWidth;
            if (previewX < 0) {
                previewX = 0;
            } else if (previewX + thumbnailWidth > playerWidth) {
                previewX = playerWidth - thumbnailWidth;
            }

            this.thumbnailPreview.style.left = `${previewX}px`;
            this.thumbnailPreview.style.opacity = '1';
        });

        // Hide thumbnail preview when mouse leaves progress bar
        progressContainer.addEventListener('mouseleave', () => {
            this.thumbnailPreview.style.opacity = '0';
        });

        // Toggle Volume (Mute/Unmute)
        volumeButton.addEventListener('click', () => {
            this.video.muted = !this.video.muted;
            this.updateVolumeIcon(volumeButton);
        });

        // Update volume icon based on state
        this.updateVolumeIcon(volumeButton);

        // Change volume via slider
        volumeSlider.addEventListener('input', (e) => {
            this.video.volume = e.target.value;
            this.video.muted = e.target.value == 0;
            this.updateVolumeIcon(volumeButton);
        });

        // Show volume slider when hovering over volume button or slider
        volumeButton.addEventListener('mouseenter', () => {
            volumeSlider.style.opacity = '1';
        });

        volumeSlider.addEventListener('mouseenter', () => {
            volumeSlider.style.opacity = '1';
        });

        volumeButton.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!volumeSlider.matches(':hover') && !volumeButton.matches(':hover')) {
                    volumeSlider.style.opacity = '0';
                }
            }, 100);
        });

        volumeSlider.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!volumeSlider.matches(':hover') && !volumeButton.matches(':hover')) {
                    volumeSlider.style.opacity = '0';
                }
            }, 100);
        });

        // Toggle Quality Menu
        qualityButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from closing the menu
            qualityMenu.style.display = qualityMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Close Quality Menu when clicking outside
        document.addEventListener('click', () => {
            qualityMenu.style.display = 'none';
        });

        // Prevent clicks inside the Quality Menu from closing it
        qualityMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Toggle Fullscreen
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                playerContainer.requestFullscreen().catch(err => {
                    alert(`Error attempting to enter fullscreen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });

        // Update Play/Pause button when video ends
        this.video.addEventListener('ended', () => {
            playPauseButton.textContent = '►';
        });

        // Mouse activity handling for hiding controls
        if (!this.controlsAlwaysVisible) {
            playerContainer.addEventListener('mousemove', this.showControls.bind(this));
            playerContainer.addEventListener('mouseleave', this.hideControls.bind(this));
            this.video.addEventListener('play', this.startMouseActivityWatcher.bind(this));
            this.video.addEventListener('pause', this.showControls.bind(this));
        }
    }

    updateVolumeIcon(volumeButton) {
        if (this.video.muted || this.video.volume === 0) {
            volumeButton.textContent = '🔇';
        } else if (this.video.volume > 0 && this.video.volume <= 0.5) {
            volumeButton.textContent = '🔉';
        } else {
            volumeButton.textContent = '🔊';
        }
    }

    populateQualityMenu() {
        const qualityOptions = this.shadowRoot.getElementById('quality-options');
        const qualityButton = this.shadowRoot.getElementById('quality-button');

        // Clear existing options
        qualityOptions.innerHTML = '';

        // Add "Auto" option
        const autoOption = document.createElement('li');
        autoOption.textContent = 'Auto';
        autoOption.dataset.level = '-1';
        autoOption.classList.add('active');
        autoOption.addEventListener('click', () => {
            this.setQuality(-1);
            this.setActiveQuality(autoOption);
        });
        qualityOptions.appendChild(autoOption);

        // Add available quality options
        this.availableQualities.forEach((q) => {
            const option = document.createElement('li');
            option.textContent = `${q.height}p`;
            option.dataset.level = q.index;
            option.addEventListener('click', () => {
                this.setQuality(q.index);
                this.setActiveQuality(option);
            });
            qualityOptions.appendChild(option);
        });
    }

    setQuality(level) {
        if (this.hls) {
            if (level === -1) {
                this.hls.currentLevel = -1; // Auto
            } else {
                this.hls.currentLevel = level;
            }
        } else {
            alert('Cannot change quality in this browser.');
        }
    }

    setActiveQuality(selectedElement) {
        const qualityOptions = this.shadowRoot.getElementById('quality-options');
        const allOptions = qualityOptions.querySelectorAll('li');
        allOptions.forEach((option) => {
            option.classList.remove('active');
        });
        selectedElement.classList.add('active');
        this.shadowRoot.getElementById('quality-menu').style.display = 'none';
        this.updateQualityButton();
    }

    updateQualityButton() {
        const qualityButton = this.shadowRoot.getElementById('quality-button');
        if (this.currentQuality === -1) {
            qualityButton.textContent = 'Auto';
        } else {
            const selected = this.availableQualities.find((q) => q.index === this.currentQuality);
            if (selected) {
                qualityButton.textContent = `${selected.height}p`;
            } else {
                qualityButton.textContent = 'Auto';
            }
        }
    }

    setInitialQuality() {
        if (this.defaultQuality === 'high') {
            // Set to highest quality
            this.setQuality(this.availableQualities.length - 1);
        } else if (this.defaultQuality === 'low') {
            // Set to lowest quality
            this.setQuality(0);
        } else if (parseInt(this.defaultQuality)) {
            // Set to specific height if available
            const targetQuality = this.availableQualities.find(
                (q) => q.height === parseInt(this.defaultQuality)
            );
            if (targetQuality) {
                this.setQuality(targetQuality.index);
            }
        } else {
            // Default to auto
            this.setQuality(-1);
        }
    }

    setupThumbnails(thumbnailsBase) {
        const progressContainer = this.shadowRoot.getElementById('progress-container');
        const thumbnailPreview = this.thumbnailPreview;
        const thumbnailImage = this.shadowRoot.getElementById('thumbnail-image');
        const playerContainer = this.shadowRoot.querySelector('.player-container');

        progressContainer.addEventListener('mousemove', (e) => {
            if (!this.video.duration) return;
            const rect = progressContainer.getBoundingClientRect();
            const posX = e.clientX - rect.left;
            const percent = posX / rect.width;
            const time = percent * this.video.duration;

            // Calculate the thumbnail index
            const thumbIndex = Math.min(
                Math.floor((time / this.video.duration) * this.totalThumbnails) + 1,
                this.totalThumbnails
            );

            // Update the thumbnail image source
            thumbnailImage.src = `${thumbnailsBase}${thumbIndex}.webp`;

            // Position the thumbnail preview directly above the mouse
            const thumbnailWidth = this.thumbnailPreview.offsetWidth;
            let previewX = e.clientX - playerContainer.getBoundingClientRect().left - (thumbnailWidth / 2);

            // Ensure the thumbnail does not go outside the player container
            const playerWidth = playerContainer.clientWidth;
            if (previewX < 0) {
                previewX = 0;
            } else if (previewX + thumbnailWidth > playerWidth) {
                previewX = playerWidth - thumbnailWidth;
            }

            thumbnailPreview.style.left = `${previewX}px`;
            thumbnailPreview.style.opacity = '1';
        });

        // Hide thumbnail preview when mouse leaves progress bar
        progressContainer.addEventListener('mouseleave', () => {
            thumbnailPreview.style.opacity = '0';
        });
    }

    showControls() {
        if (this.controlsVisible) {
            clearTimeout(this.mouseActivityTimeout);
        } else {
            this.controlsContainer.classList.remove('hidden');
            this.controlsVisible = true;
        }
        clearTimeout(this.mouseActivityTimeout);
        this.mouseActivityTimeout = setTimeout(() => {
            this.hideControls();
        }, 3000);
    }

    hideControls() {
        this.controlsContainer.classList.add('hidden');
        this.controlsVisible = false;
    }

    startMouseActivityWatcher() {
        this.showControls();
        this.video.addEventListener('mousemove', this.showControls.bind(this));
    }
}

// Register the custom element
customElements.define('r2-player', R2Player);
