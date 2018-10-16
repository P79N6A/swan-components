/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file 页面滚动的API
 * @author yican(yangtianyi01@baidu.com)
 */

class UiLocation {
    constructor() {
    }

    getWindowHeight() {
        return document.compatMode === 'CSS1Compat'
            ? document.documentElement.clientHeight
            : document.body.clientHeight;
    }

    getScrollHeight() {
        const quirksScrollHeight = document.body && document.body.scrollHeight;
        const standardsScrollHeight = document.documentElement && document.documentElement.scrollHeight;
        return Math.max(quirksScrollHeight, standardsScrollHeight);
    }

    pageScrollTo({scrollTop = 0, duration = 300}) {
        const body = document.body;
        scrollTop < 0 && (scrollTop = 0);
        duration < 0 && (duration = 300);
        const windowHeight = this.getWindowHeight();
        const scrollHeight = this.getScrollHeight();
        scrollHeight - windowHeight < scrollTop
        && (scrollTop = scrollHeight - windowHeight);
        if (0 === duration) {
            body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
        }
        else {
            const scrollFunc = function () {
                body.style.transition = '';
                body.style.webkitTransition = '';
                body.style.transform = '';
                body.style.webkitTransform = '';
                body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                body.removeEventListener('transitionend', scrollFunc);
                body.removeEventListener('webkitTransitionEnd', scrollFunc);
            };
            const sTop = body.scrollTop || document.documentElement.scrollTop;
            const transformMethod = 'translateY(' + (sTop - scrollTop) + 'px) translateZ(0)';
            body.style.transition = 'transform ' + (duration / 1000) + 's ease-out';
            body.style.webkitTransition = 'transform ' + (duration / 1000) + 's ease-out';
            body.addEventListener('transitionend', scrollFunc);
            body.addEventListener('webkitTransitionEnd', scrollFunc);
            body.style.transform = transformMethod;
            body.style.webkitTransform = transformMethod;
        }
    }
}

export const uiLocation = () => {
    return new UiLocation();
};
