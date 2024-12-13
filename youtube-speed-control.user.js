// ==UserScript==
// @name         YouTube Speed Control
// @name:zh-CN   YouTube 按键加速播放
// @namespace    https://github.com/landrarwolf/youtube-speed-control
// @version      0.4
// @description  Hold right arrow key to speed up YouTube video to 2.5x, without interfering with the forward function
// @description:zh-CN 在YouTube上按住右箭头键时视频加速到2.5倍速，避免与快进功能冲突
// @icon         https://img.icons8.com/?size=100&id=9991&format=png&color=000000
// @author       landrarwolf
// @match        https://www.youtube.com/*
// @license      MIT
// @supportURL   https://github.com/landrarwolf/youtube-speed-control/issues
// @homepageURL  https://github.com/landrarwolf/youtube-speed-control
// @grant        none
// ==/UserScript==

// 在文件开头添加语言配置
const i18n = {
    en: {
        speedIndicator: '⚡ 2.5x Speed'
    },
    zh: {
        speedIndicator: '⚡ 2.5x 加速中'
    }
};

// 获取当前语言
function getCurrentLanguage() {
    const lang = navigator.language.toLowerCase().split('-')[0];
    return lang in i18n ? lang : 'en';
}

(function() {
    'use strict';
    
    let normalSpeed = 1.0;  // 保存正常播放速度
    let speedTimeout = null; // 用于延迟处理速度变化
    let isSpeedUp = false;  // 标记是否处于加速状态
    let pressStartTime = 0;  // 记录按键开始时间
    let speedIndicator = null; // 速度提示元素
    
    // 创建速度提示元素
    function createSpeedIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 9999;
            font-size: 14px;
            font-family: Arial, sans-serif;
            display: none;
            transition: opacity 0.2s;
        `;
        // 使用当前语言的文本
        indicator.textContent = i18n[getCurrentLanguage()].speedIndicator;
        document.body.appendChild(indicator);
        return indicator;
    }
    
    // 显示速度提示
    function showSpeedIndicator() {
        if (!speedIndicator) {
            speedIndicator = createSpeedIndicator();
        }
        speedIndicator.style.display = 'block';
        speedIndicator.style.opacity = '1';
    }
    
    // 隐藏速度提示
    function hideSpeedIndicator() {
        if (speedIndicator) {
            speedIndicator.style.opacity = '0';
            setTimeout(() => {
                speedIndicator.style.display = 'none';
            }, 200);
        }
    }

    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            if (!event.repeat) {
                pressStartTime = Date.now();
                speedTimeout = setTimeout(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        normalSpeed = video.playbackRate;
                        video.playbackRate = 2.5;
                        isSpeedUp = true;
                        showSpeedIndicator();
                    }
                    event.preventDefault();
                    event.stopPropagation();
                }, 200);
            } else {
                if (Date.now() - pressStartTime > 200) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }, true);
    
    // 监听键盘释放事件
    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowRight') {
            const pressDuration = Date.now() - pressStartTime;
            
            if (speedTimeout) {
                clearTimeout(speedTimeout);
                speedTimeout = null;
            }
            
            if (pressDuration < 200) {
                return;
            }
            
            if (isSpeedUp) {
                const video = document.querySelector('video');
                if (video) {
                    video.playbackRate = normalSpeed;
                    isSpeedUp = false;
                    hideSpeedIndicator();
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }, true);
})();