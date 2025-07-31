# YouTube 按键加速播放

[![License](https://img.shields.io/github/license/landrarwolf/youtube-speed-control)](LICENSE)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-安装-green)](https://update.greasyfork.org/scripts/520580/YouTube%20%E6%8C%89%E9%94%AE%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js)
![Platform](https://img.shields.io/badge/平台-YouTube-red)

> 🚀 通过按住右方向键即可快速加速YouTube视频播放 - 简单而强大！

## ✨ 功能特点
- **快速点按**: 点按右方向键 → 快进5秒（YouTube默认功能）
- **长按加速**: 按住右方向键超过设定时间 → 可配置的倍速播放
- **智能恢复**: 松开按键 → 恢复正常播放速度
- **视觉反馈**: 加速时屏幕上有清晰的速度指示器
- **可配置选项**: 轻松调整加速倍数和按键延迟时间

## 🔧 安装方法
1. 首先安装一个用户脚本管理器:
   - [Tampermonkey](https://www.tampermonkey.net/) (推荐)
   - [Violentmonkey](https://violentmonkey.github.io/)
   - [Greasemonkey](https://www.greasespot.net/)
2. [点击这里安装脚本](https://update.greasyfork.org/scripts/520580/YouTube%20%E6%8C%89%E9%94%AE%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js)

## 📖 使用方法
1. 打开任意YouTube视频
2. 按住右方向键超过设定时间来激活加速
3. 松开按键即可恢复正常速度
4. 加速时会显示速度指示器
5. 可在脚本中调整 `speedMultiplier` 和 `keyPressDelay` 来自定义行为

## 📝 更新日志
- **v0.11**
  - 修复Bugs
- **v0.10**
  - 添加全屏模式下的速度指示器支持
  - 改进层级显示，确保更好的可见性
- **v0.9**
  - 为速度指示器添加深色/浅色主题支持
  - 通过毛玻璃效果改进视觉反馈
  - 添加页面卸载时的清理功能
  - 增强错误处理
- **v0.8**
  - 修复了加速功能与快进功能的冲突
  - 改进了按键处理逻辑
- **v0.7**
  - 将中文文档分离到 README-ZH.md
  - 改进发布工作流程
- **v0.6**
  - 添加了速度倍数和按键延迟的配置选项
- **v0.5**
  - 添加了速度指示器的国际化支持
  - 默认语言改为英文
  - 添加了GitHub Actions发布工作流
- **v0.4**
  - 添加了视觉速度指示器
  - 改进了用户体验
- **v0.3**
  - 修复了与YouTube快进功能的冲突
- **v0.2**
  - 初始发布

---

## 📄 许可证和致谢
MIT License © 2024

图标来自 [Icons8](https://icons8.com/icon/9991/fast-forward)

---
