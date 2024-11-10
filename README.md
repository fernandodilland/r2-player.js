# Cloudflare R2 HLS Player Library

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=social)](LICENSE)
[![npm version](https://img.shields.io/npm/v/r2-player.js?style=social)](https://www.npmjs.com/package/r2-player.js)
[![npm downloads](https://img.shields.io/npm/dm/r2-player.js?style=social)](https://www.npmjs.com/package/r2-player.js)
[![dependencies](https://img.shields.io/librariesio/release/npm/r2-player.js?style=social)](https://www.npmjs.com/package/r2-player.js)

A lightweight, customizable HTML5 video player leveraging Cloudflare R2 and HLS streaming for high-quality playback with advanced controls.

![Screenshot](/src/img.webp)
[Try the Demo](https://r2-player.fernandodilland.com/index.html)

You need to have the HLS files and folders, I have created this repository to convert normal videos to this format including thumbnails, it is a manual prototype: [GitHub](https://github.com/fernandodilland/hls-toolkit).

## Dependencies

This library uses the [hls.js](https://github.com/video-dev/hls.js) library to provide HLS streaming support in browsers that do not natively support HLS playback. `hls.js` is automatically included when installing `r2-player.js`.

## Features

- HLS Streaming: Smooth playback for HLS video streams.
- Customizable Controls: Play, pause, volume, quality selection, and fullscreen.
- Thumbnails: Preview video frames by hovering over the progress bar.
- Responsive: Works on various screens and devices.
- Easy Style Customization: Customize appearance with CSS.
- Autoplay, Loop, and Mute: Control playback behavior.

## Completed Tasks
- [x] ~~Library (base).~~
- [x] ~~Configure `hls.js` dependency.~~
- [x] ~~Playback navigation bar.~~
- [x] ~~Play and pause video.~~
- [x] ~~Video thumbnails on hover.~~
- [x] ~~Configurable settings (width, height, autoplay, controls-visible, muted, loop, thumbnails, volume, quality).~~
- [x] ~~Publish on npmjs.com.~~

## Pending Tasks
- [ ] Fix volume control bar.
- [ ] Make color configurable.
- [ ] Improve playback bar design.
- [ ] Update typography for quality section.
- [ ] Enable keyboard shortcuts (left/right for seeking, up/down for volume).
- [ ] Enable "Enter" key to play/pause video.
- [ ] Fix full-screen display on mobile devices.

## Installation

Install via npm or add directly to HTML:

### npm

```bash
npm install r2-player.js
```

## Recommended Configuration in Cloudflare R2

Within the bucket (in the Cloudflare dashboard), go to Settings > CORS policy > Edit CORS policy

The following configuration is recommended:

```json
[
  {
    "AllowedOrigins": [
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "Range",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers"
    ],
    "ExposeHeaders": [
      "Content-Type",
      "Access-Control-Allow-Origin",
      "ETag",
      "Content-Length"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

Consider changing "https://yourdomain.com" or using "*" (less secure) to specify the exact domain or subdomain where the videos will be displayed.

### Script Tag

The following script tag is recommended for use with a CDN or by downloading it as a .js file (by going to https://cdn.jsdelivr.net/npm/r2-player.js/dist/r2-player.min.js) to utilize the features of this library.

```html
<script src="https://cdn.jsdelivr.net/npm/r2-player.js/dist/r2-player.min.js"></script>
```

## Usage

Add the `<r2-player>` element in HTML:

```html
<r2-player src="https://r2-player.fernandodilland.com/demo" autoplay muted loop thumbnails="true" quality="auto"></r2-player>
```

## Configuration Options

The `<r2-player>` element accepts several attributes to customize its behavior and appearance. Below is a detailed list of all available configuration options.

### Configuration Attributes

| Attribute          | Type                  | Default | Description                                                                                                                                                 |
|--------------------|-----------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src`              | `string`              | Required| URL to the base path of your Cloudflare R2 HLS video files. Ensure it points to the directory containing `master.m3u8` and thumbnail images.               |
| `width`            | `number`              | `800`   | Width of the player in pixels. Can be set via the `width` attribute or the CSS `--player-width` variable.                                                 |
| `height`           | `number`              | `450`   | Height of the player in pixels. Can be set via the `height` attribute or the CSS `--player-height` variable.                                              |
| `autoplay`         | `boolean`             | `false` | If present, the video will autoplay when the player loads.                                                                                                |
| `controls-visible` | `boolean`             | `true`  | Controls visibility. Set to `"false"` to hide controls by default and enable auto-hide functionality.                                                    |
| `muted`            | `boolean`             | `false` | If present, the video will be muted by default.                                                                                                          |
| `loop`             | `boolean`             | `false` | If present, the video will loop continuously.                                                                                                            |
| `thumbnails`       | `boolean`             | `true`  | Enables or disables thumbnail previews on the progress bar. Set to `"false"` to disable.                                                                |
| `volume`           | `number`              | `1.0`   | Sets the default volume level, ranging from `0.0` (muted) to `1.0` (maximum volume).                                                                     |
| `quality`          | `string` or `number`  | `"auto"`| Sets the initial video quality. Options include `"auto"`, `"high"`, `"low"`, or a specific height value (e.g., `"720"`).                                |

## Support

For help, open an issue on [GitHub](https://github.com/fernandodilland/r2-player.js/issues)

## License

Licensed under the [MIT License](LICENSE).
