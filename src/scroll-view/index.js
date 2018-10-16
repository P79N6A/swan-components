/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file bdml's file's base elements <scroll-view>
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 */
import style from './index.css';
import {attrValBool} from '../utils';

export default {

    behaviors: ['userTouchEvents', 'noNativeBehavior', 'animateEffect'],

    template: `
        <swan-scroll-view>
            <div s-ref="wrap" class="swan-scroll-view">
                <div s-ref="main" class="swan-scroll-view scroll-view-compute-offset"
                    on-scroll="onScroll($event)"
                    on-touchend="onTouchEnd($event)"
                    on-touchstart="onTouchStart($event)"
                    on-touchmove="onTouchMove($event)">
                    <div s-ref="content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </swan-scroll-view>`,

    constructor(props) {
        this.contentHeight = 0;
        this.lastLeftDistance = 0;
        this.lastTopDistance = 0;
        this.lastScrollTime = 0;
        this.startPageX = 0; // 起点横坐标
        this.startPageY = 0; // 起点纵坐标
        this.direction = ''; // 手指滑动方向，一旦确认方向不可变更
        this.isAutoHeight = false; // 高度自适应
    },

    initData() {
        return {
            upperThreshold: 50, // 距顶部/左边多远时（单位px），触发 scrolltoupper 事件
            lowerThreshold: 50, // 距底部/右边多远时（单位px），触发 scrolltolower 事件
            scrollY: false, // 允许纵向滚动
            scrollX: false, // 允许横向滚动
            scrollLeft: 0, // 设置横向滚动条位置
            scrollTop: 0, // 设置竖向滚动条位置
            scrollWithAnimation: false, // 是否动画过渡
            scrollIntoView: '' // 元素id,滚动到该元素
        };
    },

    attached() {
        let pageData = this.data.get();
        this.wrap = this.ref('wrap');
        this.main = this.ref('main');
        this.content = this.ref('content');
        this.upperThresHold = +pageData.upperThreshold;
        this.lowerThreshold = +pageData.lowerThreshold;
        this.scrollWithAnimation = attrValBool(pageData.scrollWithAnimation);
        this.scrollX = attrValBool(this.data.get('scrollX'));
        this.scrollY = attrValBool(this.data.get('scrollY'));
        this.watchParams();
        this.scrollXChanged();
        this.scrollY && this.scrollYChanged();
        pageData.scrollIntoView && this.scrollIntoViewChanged();
        pageData.scrollLeft && this.scrollLeftChanged(pageData.scrollLeft);
        pageData.scrollTop && this.scrollTopChanged(pageData.scrollTop);
        this.data.set('scrollLeft', '');
        this.data.set('scrollTop', '');
    },

    /**
     * 监听用户传入参数变化
     */
    watchParams() {
        this.watch('scrollLeft', leftVal => {
            if (leftVal || parseInt(leftVal, 10) === 0) {
                this.main.style.webkitOverflowScrolling = 'auto';
                this.scrollLeftChanged(leftVal);
            }
        });
        this.watch('scrollTop', topVal => {
            if (topVal || parseInt(topVal, 10) === 0) {
                this.main.style.webkitOverflowScrolling = 'auto';
                this.scrollTopChanged(topVal);
            }
        });
        this.watch('scrollIntoView', value => {
            value && this.scrollIntoViewChanged();
        });
    },

    /**
     * 数据变更重新计算样式
     */
    slaveUpdated() {
        if (this.scrollX && (this.contentHeight !== this.content.offsetHeight)) {
            this.contentHeight = this.content.offsetHeight;
            this.scrollXChanged();
        }
    },

    /**
     * 横向滚动样式设置
     */
    scrollXChanged() {
        if (this.scrollX) {
            this.checkIsAutoHeight();
            this.main.style.overflowX = 'auto';
            this.main.style.overflowY = 'hidden';
            this.main.style.paddingBottom = '20px';
            this.wrap.style.overflowY = 'hidden';
            this.isAutoHeight
                ? (this.wrap.style.height = this.content.offsetHeight + 'px', this.content.style.height = '')
                : (this.wrap.style.height = '', this.content.style.height = this.el.offsetHeight + 'px');
        } else {
            this.wrap.style.overflowY = '';
            this.wrap.style.height = '';
            this.main.style.overflowX = 'hidden';
            this.main.style.paddingBottom = '';
        }
    },

    /**
     * 检查容器高度是否自适应
     */
    checkIsAutoHeight() {
        this.wrap.style.height = 0;
        const style = getComputedStyle(this.el);
        this.isAutoHeight = parseFloat(style.height) === 0 ? true : false;
    },

    /**
     * 竖向滚动样式设置
     */
    scrollYChanged() {
        this.main.style.overflowY = 'auto';
        this.content.style.height = '100%';
    },

    /**
     * 横向滚动条位置
     * @param {number} [scrollLeft] 横向滚动条位置
     */
    scrollLeftChanged(scrollLeft) {
        this.scrollWithAnimation ? this.scrollTo(scrollLeft, 'x')
            : (this.main.scrollLeft = scrollLeft, this.main.style.webkitOverflowScrolling = 'touch');
    },

    /**
     * 竖向滚动条位置
     * @param {number} [scrollTop] 竖向滚动条位置
     */
    scrollTopChanged(scrollTop) {
        this.scrollWithAnimation ? this.scrollTo(scrollTop, 'y')
            : (this.main.scrollTop = scrollTop, this.main.style.webkitOverflowScrolling = 'touch');
    },

    /**
     * 滚动到某个元素位置
     */
    scrollIntoViewChanged() {
        const pageData = this.data.get();
        const scrollIntoViewId = pageData.scrollIntoView;
        if (scrollIntoViewId) {
            const scrollTarget = this.main.querySelector(`#${scrollIntoViewId}`);
            if (scrollTarget) {
                const targetScroll = scrollTarget.getBoundingClientRect();
                const mainScroll = this.main.getBoundingClientRect();
                if (pageData.scrollX) {
                    const scrollLeft = this.main.scrollLeft + targetScroll.left - mainScroll.left;
                    pageData.scrollWithAnimation ? this.scrollTo(scrollLeft, 'x') : this.main.scrollLeft = scrollLeft;
                }
                if (pageData.scrollY) {
                    const scrollTop = this.main.scrollTop + targetScroll.top - mainScroll.top;
                    pageData.scrollWithAnimation ? this.scrollTo(scrollTop, 'y') : this.main.scrollTop = scrollTop;
                }
            }
        }
    },

    /**
     * 滚动到某个元素位置
     * @param {number} [scrollValue] 横/竖向滚动条位置
     * @param {number} [direction] 滚动方向
     */
    scrollTo(scrollValue, direction) {
        const maxScrollWidth = this.main.scrollWidth - this.main.offsetWidth;
        const maxScrollHeight = this.main.scrollHeight - this.main.offsetHeight;
        let style = '';
        let canMoveDis = 0; // 可以滑动的距离
        if (scrollValue < 0) {
            scrollValue = 0;
        } else if (direction === 'x' && scrollValue > maxScrollWidth) { // 横向
            scrollValue = maxScrollWidth;
        } else if (direction === 'y' && scrollValue > maxScrollHeight) { // 竖向
            scrollValue = maxScrollHeight;
        }
        direction === 'x' ? (canMoveDis = this.main.scrollLeft - scrollValue)
            : direction === 'y' && (canMoveDis = this.main.scrollTop - scrollValue);
        if (canMoveDis !== 0) {
            this.content.removeEventListener('transitionend', this._transitionEnd);
            this.content.removeEventListener('webkitTransitionEnd', this._transitionEnd);
            this._transitionEnd = this.transitionEnd.bind(this, scrollValue, direction);
            this.content.addEventListener('transitionend', this._transitionEnd);
            this.content.addEventListener('webkitTransitionEnd', this._transitionEnd);
            this.content.style.transition = 'transform .3s ease-out';
            this.content.style.webkitTransition = '-webkit-transform .3s ease-out';
            direction === 'x' ? style = 'translateX(' + canMoveDis + 'px) translateZ(0)'
                : style = 'translateY(' + canMoveDis + 'px) translateZ(0)';
            this.content.style.transform = style;
            this.content.style.webkitTransform = style;
        }
    },

    /**
     * 动画结束执行的操作
     * @param {number} [scrollValue] 横/竖向滚动条位置
     * @param {number} [direction] 滚动方向
     */
    transitionEnd(scrollValue, direction) {
        Object.assign(this.content.style, {
            transition: '',
            webkitTransition: '',
            transform: '',
            webkitTransform: ''
        });
        direction === 'x' && (this.main.scrollLeft = scrollValue);
        direction === 'y' && (this.main.scrollTop = scrollValue);
        this.main.style.webkitOverflowScrolling = 'touch';
        this.content.removeEventListener('transitionend', this._transitionEnd);
        this.content.removeEventListener('webkitTransitionEnd', this._transitionEnd);
    },

    /**
     * 滑动时的4方位距离的计算函数
     * @param {Object} [target] DOM事件对象
     * @return {Object} 4方位距离
     */
    computeScrollRect(target) {
        return {
            rightDistance: target.scrollWidth - target.scrollLeft - target.clientWidth,
            bottomDistance: target.scrollHeight - target.scrollTop - target.clientHeight,
            topDistance: target.scrollTop,
            leftDistance: target.scrollLeft
        };
    },

    /**
     * 判断是否需要横/纵向滑动
     * @param {Object} [target] 滑动原生对象
     * @param {string} [type] 横/纵类型
     * @return {boolean} 判断在此方向上，是否需要处理滑动函数
     */
    shouldProccessScroll(target, type) {
        // 如果clientWidth比scrollWidth小，证明有必要触发一下，如果clientWidth比scrollWidth还大的话，证明没必要触发scrolltolower了,
        // 所以叫noNeedWidthScroll
        if (type === 'x') {
            const hasScrollX = !!this.data.get('scrollX');
            const noNeedWidthScroll = target.clientWidth >= target.scrollWidth;
            return hasScrollX && !noNeedWidthScroll;
        }
        else {
            const hasScrollY = !!this.data.get('scrollY');
            const noNeedHeightScroll = target.clientHeight >= target.scrollHeight;
            return hasScrollY && !noNeedHeightScroll;
        }
    },

    /**
     * 计算滑动的方向的事件派发，依据滑动的方向，滑动到的位置是否符合传入条件，是否设置过scroll滑动事件，来判断触发何种事件
     * @param {Object} [$event] 滑动产生的事件对象
     * @return {Array} 所有需要触发的directions
     */
    computeScrollDirection(target) {
        const {topDistance, leftDistance, rightDistance, bottomDistance} = this.computeScrollRect(target);
        const {upperThresHold, lowerThreshold} = this;
        const deltaX = this.lastLeftDistance - leftDistance;
        const deltaY = this.lastTopDistance - topDistance;
        const scrollingRight = deltaX < 0;
        const scrollingLeft = deltaX > 0;
        const scrollingUp = deltaY > 0;
        const scrollingDown = deltaY < 0;
        const scrollDirections = [];
        // 是否横向触发lower
        const horizontalTriggerLower = this.shouldProccessScroll(target, 'x')
                && rightDistance <= lowerThreshold && scrollingRight;
        // 是否纵向触发lower
        const verticalTriggerLower = this.shouldProccessScroll(target, 'y')
                && bottomDistance <= lowerThreshold && scrollingDown;
        // 是否横向触发upper
        const horizontalTriggerUpper = this.shouldProccessScroll(target, 'x')
                && leftDistance <= upperThresHold && scrollingLeft;
        // 是否纵向触发upper
        const verticalTriggerUpper = this.shouldProccessScroll(target, 'y')
                && topDistance <= upperThresHold && scrollingUp;

        if (horizontalTriggerLower || verticalTriggerLower) {
            scrollDirections.push('bindscrolltolower');
        }

        if (horizontalTriggerUpper || verticalTriggerUpper) {
            scrollDirections.push('bindscrolltoupper');
        }

        scrollDirections.push('bindscroll');
        return scrollDirections;
    },

    /**
     * 拼接fire开发者回调事件数据
     * @param {Object} [target] DOM事件目标对象
     * @return {Object} 滚动相关数据
     */
    getScrollData(target) {
        return {
            detail: {
                deltaX: target.deltaX,
                deltaY: target.deltaY,
                scrollHeight: target.scrollHeight,
                scrollWidth: target.scrollWidth,
                scrollTop: target.scrollTop,
                scrollLeft: target.scrollLeft
            }
        };
    },

    /**
     * 原生滚动条事件
     * @param {Object} [$event] DOM事件对象
     */
    onScroll($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($event.timeStamp - this.lastScrollTime < 20) { // 防止频繁计算导致卡顿问题
            return;
        }
        this.data.set('scrollTop', '');
        this.data.set('scrollLeft', '');
        this.data.set('scrollIntoView', '');
        this.lastScrollTime = $event.timeStamp;
        const target = $event.target;
        Object.assign(target, {
            deltaX: this.lastLeftDistance - target.scrollLeft,
            deltaY: this.lastTopDistance - target.scrollTop
        });
        this.computeScrollDirection(target)
        .forEach(direction => {
            target.type = direction === 'bindscroll' ? 'scroll'
            : (direction === 'bindscrolltoupper' ? 'upper' : (direction === 'bindscrolltolower' ? 'lower' : ''));
            this.dispatchEvent(direction, this.getScrollData(target));
        });
        this.lastLeftDistance = target.scrollLeft;
        this.lastTopDistance = target.scrollTop;
        // image组件懒加载
        this.communicator.fireMessage({type: 'imgLazyLoad'});
    },

    onTouchStart($event) {
        const touch = $event.changedTouches[0];
        this.startPageX = touch.pageX;
        this.startPageY = touch.pageY;
        // 阻止ios webview回弹效果
        this.swaninterface.boxjs.platform.isIOS() && this.boxjs.ui.close({
            name: 'swan-springback'
        });
    },

    onTouchMove($event) {
        const touch = $event.changedTouches[0];
        if (!this.direction) {
            Math.abs(touch.pageX - this.startPageX) >= Math.abs(touch.pageY - this.startPageY)
                ? this.direction = 'x' : this.direction = 'y';
        }
        this.data.get('scrollX') && this.direction === 'x' && $event.stopPropagation();
        this.data.get('scrollY') && this.direction === 'y' && $event.stopPropagation();
    },

    onTouchEnd($event) {
        this.data.get('scrollX') && this.direction === 'x' && $event.stopPropagation();
        this.data.get('scrollY') && this.direction === 'y' && $event.stopPropagation();
        this.direction = '';
        // 开启ios webview回弹效果
        this.swaninterface.boxjs.platform.isIOS() && this.boxjs.ui.open({
            name: 'swan-springback'
        });
    }
};
