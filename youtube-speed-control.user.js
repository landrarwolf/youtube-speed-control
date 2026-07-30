// ==UserScript==
// @name         YouTube Speed Control
// @name:zh-CN   YouTube 按键加速播放
// @namespace    https://github.com/landrarwolf/youtube-speed-control
// @version      0.13
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
    let activeVideo = null; // 当前由脚本控制的视频
    
    // 事件监听器引用，用于清理
    let themeChangeListener = null;
    let fullscreenChangeListener = null;

    // 获取视频元素的辅助函数，带错误处理
    function getVideoElement() {
        try {
            const video = document.querySelector('video');
            if (!video) {
                console.warn('未找到视频元素');
                return null;
            }
            return video;
        } catch (error) {
            console.error('获取视频元素时出错:', error);
            return null;
        }
    }

    // 输入文字或使用组合快捷键时，不接管右方向键
    function shouldHandleKey(event) {
        const target = event.target;
        const isEditable = target instanceof Element && (
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
            target.isContentEditable ||
            target.closest('[contenteditable="true"], [role="textbox"]')
        );

        return event.key === 'ArrowRight' &&
            !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey &&
            !isEditable;
    }

    function consumeKeyEvent(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    // 创建速度提示元素
    function createSpeedIndicator() {
        try {
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
                pointer-events: none;
            `;

            // 创建样式更新函数
            const updateTheme = () => {
                try {
                    const isDarkMode = darkModeMediaQuery.matches;
                    const theme = isDarkMode ? config.darkTheme : config.lightTheme;

                    indicator.style.cssText = `
                        ${baseStyles}
                        background: ${theme.background};
                        color: ${theme.text};
                        box-shadow: ${theme.shadow};
                    `;
                } catch (error) {
                    console.error('更新主题样式时出错:', error);
                }
            };

            // 初始化样式
            updateTheme();

            // 只有在首次创建时才添加主题变化监听器
            if (!themeChangeListener) {
                themeChangeListener = updateTheme;
                darkModeMediaQuery.addEventListener('change', themeChangeListener);
            }

            // 使用当前语言的文本
            indicator.textContent = i18n[getCurrentLanguage()].speedIndicator;
            indicator.setAttribute('role', 'status');
            indicator.setAttribute('aria-live', 'polite');

            // 将指示器添加到合适的容器中
            const container = document.fullscreenElement || document.body;
            container.appendChild(indicator);

            // 只有在首次创建时才添加全屏变化监听器
            if (!fullscreenChangeListener) {
                fullscreenChangeListener = () => {
                    try {
                        if (speedIndicator) {
                            const newContainer = document.fullscreenElement || document.body;
                            if (speedIndicator.parentElement !== newContainer) {
                                speedIndicator.remove();
                                newContainer.appendChild(speedIndicator);
                            }
                        }
                    } catch (error) {
                        console.error('处理全屏变化时出错:', error);
                    }
                };
                document.addEventListener('fullscreenchange', fullscreenChangeListener);
            }

            return indicator;
        } catch (error) {
            console.error('创建速度提示元素时出错:', error);
            return null;
        }
    }

    // 显示速度提示
    function showSpeedIndicator() {
        try {
            if (!speedIndicator) {
                speedIndicator = createSpeedIndicator();
            }
            speedIndicator.style.display = 'block';
            speedIndicator.setAttribute('aria-hidden', 'false');
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
        try {
            if (speedIndicator) {
                speedIndicator.style.opacity = '0';
                speedIndicator.style.transform = 'translateX(-50%) translateY(-10px)';
                setTimeout(() => {
                    if (speedIndicator) {
                        speedIndicator.style.display = 'none';
                        speedIndicator.setAttribute('aria-hidden', 'true');
                    }
                }, 200);
            }
        } catch (error) {
            console.error('隐藏速度提示时出错:', error);
        }
    }

    // 监听键盘按下事件
    document.addEventListener('keydown', function (event) {
        if (shouldHandleKey(event)) {
            const video = getVideoElement();
            if (!video) {
                return;
            }

            // 完全接管本次按键，避免 YouTube 的长按处理与字幕层发生冲突
            consumeKeyEvent(event);

            if (!event.repeat && !activeVideo) {
                activeVideo = video;
                pressStartTime = Date.now();
                
                // 清除之前的定时器以避免竞态条件
                if (speedTimeout) {
                    clearTimeout(speedTimeout);
                    speedTimeout = null;
                }
                
                speedTimeout = setTimeout(() => {
                    speedTimeout = null;
                    try {
                        if (activeVideo) {
                            normalSpeed = activeVideo.playbackRate;
                            activeVideo.playbackRate = config.speedMultiplier;
                            isSpeedUp = true;
                            showSpeedIndicator();
                        }
                    } catch (error) {
                        console.error('设置视频加速时出错:', error);
                    }
                }, config.keyPressDelay);
            }
        }
    }, true);

    // 监听键盘释放事件
    document.addEventListener('keyup', function (event) {
        if (event.key === 'ArrowRight' && activeVideo) {
            consumeKeyEvent(event);
            try {
                const pressDuration = Date.now() - pressStartTime;

                if (speedTimeout) {
                    clearTimeout(speedTimeout);
                    speedTimeout = null;
                }

                // 如果按键时间小于延迟时间，模拟一次快进操作
                if (pressDuration < config.keyPressDelay && !isSpeedUp) {
                    const nextTime = activeVideo.currentTime + 5;
                    activeVideo.currentTime = Number.isFinite(activeVideo.duration)
                        ? Math.min(nextTime, activeVideo.duration)
                        : nextTime;
                }

                if (isSpeedUp) {
                    activeVideo.playbackRate = normalSpeed;
                    isSpeedUp = false;
                    hideSpeedIndicator();
                }

                activeVideo = null;
            } catch (error) {
                console.error('处理按键释放时出错:', error);
            }
        }
    }, true);

    // 松键事件可能在切换标签页或窗口时丢失，主动恢复原速度
    function cancelSpeedUp() {
        if (speedTimeout) {
            clearTimeout(speedTimeout);
            speedTimeout = null;
        }

        if (activeVideo && isSpeedUp) {
            activeVideo.playbackRate = normalSpeed;
            isSpeedUp = false;
            hideSpeedIndicator();
        }

        activeVideo = null;
    }

    window.addEventListener('blur', cancelSpeedUp);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelSpeedUp();
        }
    });

    // 在 IIFE 内部添加
    const cleanup = () => {
        try {
            cancelSpeedUp();

            // 清理速度提示元素
            if (speedIndicator && speedIndicator.parentNode) {
                speedIndicator.parentNode.removeChild(speedIndicator);
                speedIndicator = null;
            }
            
            // 清理事件监听器
            if (themeChangeListener && darkModeMediaQuery) {
                darkModeMediaQuery.removeEventListener('change', themeChangeListener);
                themeChangeListener = null;
            }
            
            if (fullscreenChangeListener) {
                document.removeEventListener('fullscreenchange', fullscreenChangeListener);
                fullscreenChangeListener = null;
            }
            
            // 重置状态
            isSpeedUp = false;
            normalSpeed = 1.0;
        } catch (error) {
            console.error('清理资源时出错:', error);
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
