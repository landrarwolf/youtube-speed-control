# YouTube Speed Control

[![License](https://img.shields.io/github/license/landrarwolf/youtube-speed-control)](LICENSE)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-install-green)](https://update.greasyfork.org/scripts/520580/YouTube%20%E6%8C%89%E9%94%AE%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js)
![Platform](https://img.shields.io/badge/Platform-YouTube-red)

> 🚀 Speed up YouTube videos instantly by holding the right arrow key - simple yet powerful!

---
## 📄 中文说明
有关中文版本的说明，请参阅 [README-ZH.md](README-ZH.md).

## ✨ Features
- **Quick Press**: Tap right arrow → Skip forward 5 seconds (YouTube default)
- **Hold to Speed**: Hold right arrow for configurable duration → Configurable playback speed
- **Smart Release**: Let go of key → Return to normal speed
- **Visual Feedback**: Clear on-screen indicator when speed-up is active
- **Configurable Options**: Easily adjust speed multiplier and key press delay

## 🔧 Installation
1. First install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
   - [Violentmonkey](https://violentmonkey.github.io/)
   - [Greasemonkey](https://www.greasespot.net/)
2. [Click here to install the script](https://update.greasyfork.org/scripts/520580/YouTube%20%E6%8C%89%E9%94%AE%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js)

## 📖 Usage
1. Go to any YouTube video
2. Hold the right arrow key for the configured duration to activate speed-up
3. Release to return to normal speed
4. The speed indicator will show when active
5. Adjust `speedMultiplier` and `keyPressDelay` in the script for custom behavior

## 📝 Changelog
- **v0.11**
  - Bugs fixed
- **v0.10**
  - Added support for speed indicator in fullscreen mode
  - Improved z-index handling for better visibility
- **v0.9**
  - Added dark/light theme support for speed indicator
  - Improved visual feedback with blur effect
  - Added cleanup on page unload
  - Enhanced error handling
- **v0.8**
  - Fixed the conflict between speed-up and forward skip functions
  - Improved key press handling logic
- **v0.7**
  - Separated Chinese documentation into README-ZH.md
  - Improved release workflow
- **v0.6**
  - Added configurable options for speed multiplier and key press delay
- **v0.5**
  - Added i18n support for speed indicator
  - Changed default language to English
  - Added GitHub Actions workflow for releases
- **v0.4**
  - Added visual speed indicator
  - Improved user experience
- **v0.3**
  - Fixed conflict with YouTube's skip forward function
- **v0.2**
  - Initial release

---

## 📄 License & Credits
MIT License © 2024

Icon by [Icons8](https://icons8.com/icon/9991/fast-forward)

---
