# Cloudflare R2 HLS Player Library

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=social)](LICENSE)
[![npm version](https://img.shields.io/npm/v/r2-player.js?style=social)](https://www.npmjs.com/package/r2-player.js)
[![npm downloads](https://img.shields.io/npm/dm/r2-player.js?style=social)](https://www.npmjs.com/package/r2-player.js)
[![dependencies](https://img.shields.io/librariesio/release/npm/r2-player.js?style=social)](https://www.npmjs.com/package/r2-player.js)

A lightweight, customizable HTML5 video player leveraging Cloudflare R2 and HLS streaming for high-quality playback with advanced controls.

![Screenshot](/src/img.webp)
[Try the Demo](https://r2-player.fernandodilland.com/index.html)

## Dependencies

This library uses the [hls.js](https://github.com/video-dev/hls.js) library to provide HLS streaming support in browsers that do not natively support HLS playback. `hls.js` is automatically included when installing `r2-player.js`.


## Features

- HLS Streaming: Smooth playback for HLS video streams.
- Customizable Controls: Play, pause, volume, quality selection, and fullscreen.
- Thumbnails: Preview video frames by hovering over the progress bar.
- Responsive: Works on various screens and devices.
- Easy Style Customization: Customize appearance with CSS.
- Autoplay, Loop, and Mute: Control playback behavior.

## Installation

Install via npm or add directly to HTML:

### npm

```bash
npm install r2-player.js
```

### Script Tag

```html
<script src="https://unpkg.com/r2-player.js/dist/r2-player.js"></script>
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
