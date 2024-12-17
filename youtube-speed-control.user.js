// ==UserScript==
// @name         YouTube Speed Control
// @name:zh-CN   YouTube 按键加速播放
// @namespace    https://github.com/landrarwolf/youtube-speed-control
// @version      0.10
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

// 用户可配置选项
const config = {
    speedMultiplier: 2.5, // 加速倍数
    keyPressDelay: 200,   // 按键延迟时间（毫秒）
    darkTheme: {
        background: 'rgba(33, 33, 33, 0.9)',
        text: '#ffffff',
        shadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    },
    lightTheme: {
        background: 'rgba(255, 255, 255, 0.9)',
        text: '#000000',
        shadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
};

// 在文件开头添加语言配置
const i18n = {
    en: {
        speedIndicator: `⚡ ${config.speedMultiplier}x Speed`
    },
    zh: {
        speedIndicator: `⚡ ${config.speedMultiplier}x 加速中`
    }
};

// 在文件开头添加
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// 获取当前语言
function getCurrentLanguage() {
    const lang = navigator.language.toLowerCase().split('-')[0];
    return lang in i18n ? lang : 'en';
}

(function () {
    'use strict';

    let normalSpeed = 1.0;  // 保存正常播放速度
    let speedTimeout = null; // 用于延迟处理速度变化
    let isSpeedUp = false;  // 标记是否处于加速状态
    let pressStartTime = 0;  // 记录按键开始时间
    let speedIndicator = null; // 速度提示元素

    // 创建速度提示元素
    function createSpeedIndicator() {
        const indicator = document.createElement('div');

        // 基础样式
        const baseStyles = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            border-radius: 8px;
            z-index: 2147483647;
            font-size: 14px;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            display: none;
            opacity: 0;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        `;

        // 创建样式更新函数
        const updateTheme = () => {
            const isDarkMode = darkModeMediaQuery.matches;
            const theme = isDarkMode ? config.darkTheme : config.lightTheme;

            indicator.style.cssText = `
                ${baseStyles}
                background: ${theme.background};
                color: ${theme.text};
                box-shadow: ${theme.shadow};
            `;
        };

        // 初始化样式
        updateTheme();

        // 监听系统主题变化
        darkModeMediaQuery.addEventListener('change', updateTheme);

        // 使用当前语言的文本
        indicator.textContent = i18n[getCurrentLanguage()].speedIndicator;

        // 将指示器添加到合适的容器中
        const container = document.fullscreenElement || document.body;
        container.appendChild(indicator);

        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', () => {
            const newContainer = document.fullscreenElement || document.body;
            if (indicator.parentElement !== newContainer) {
                indicator.remove();
                newContainer.appendChild(indicator);
            }
        });

        return indicator;
    }

    // 显示速度提示
    function showSpeedIndicator() {
        try {
            if (!speedIndicator) {
                speedIndicator = createSpeedIndicator();
            }
            speedIndicator.style.display = 'block';
            requestAnimationFrame(() => {
                speedIndicator.style.opacity = '1';
                speedIndicator.style.transform = 'translateX(-50%) translateY(0)';
            });
        } catch (error) {
            console.error('显示速度提示时出错:', error);
        }
    }

    // 隐藏速度提示
    function hideSpeedIndicator() {
        if (speedIndicator) {
            speedIndicator.style.opacity = '0';
            speedIndicator.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                speedIndicator.style.display = 'none';
            }, 200);
        }
    }

    // 监听键盘按下事件
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') {
            // 立即阻止事件传播，防止触发 YouTube 的快进功能
            event.preventDefault();
            event.stopPropagation();

            if (!event.repeat) {
                pressStartTime = Date.now();
                speedTimeout = setTimeout(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        normalSpeed = video.playbackRate;
                        video.playbackRate = config.speedMultiplier;
                        isSpeedUp = true;
                        showSpeedIndicator();
                    }
                }, config.keyPressDelay);
            }
        }
    }, true);

    // 监听键盘释放事件
    document.addEventListener('keyup', function (event) {
        if (event.key === 'ArrowRight') {
            const pressDuration = Date.now() - pressStartTime;

            if (speedTimeout) {
                clearTimeout(speedTimeout);
                speedTimeout = null;
            }

            // 如果按键时间小于延迟时间，模拟一次快进操作
            if (pressDuration < config.keyPressDelay) {
                const video = document.querySelector('video');
                if (video) {
                    video.currentTime += 5; // 手动触发5秒快进
                }
            }

            if (isSpeedUp) {
                const video = document.querySelector('video');
                if (video) {
                    video.playbackRate = normalSpeed;
                    isSpeedUp = false;
                    hideSpeedIndicator();
                }
            }
        }
    }, true);

    // 在 IIFE 内部添加
    const cleanup = () => {
        if (speedIndicator && speedIndicator.parentNode) {
            speedIndicator.parentNode.removeChild(speedIndicator);
        }
        if (speedTimeout) {
            clearTimeout(speedTimeout);
        }
    };

    // 添加清理监听
    if (typeof window.onbeforeunload === 'function') {
        const originalUnload = window.onbeforeunload;
        window.onbeforeunload = function () {
            cleanup();
            return originalUnload.apply(this, arguments);
        };
    } else {
        window.onbeforeunload = cleanup;
    }
})();