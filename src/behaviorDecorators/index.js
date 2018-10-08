/**
 * @file swan component's decorator
 * @author houyu(houyu01@baidu.com)
 */
import san from 'san';
import {
    noop,
    computeDistance,
    attrValBool,
    isEqualObject
} from '../utils';
import {animationEffect} from '../utils/animation';
import {eventUtils, hasCustomEvent} from '../utils/event';
// 长按时长
const LONG_PRESS_TIME_THRESHOLD = 350;
// 点击容差触发距离
const TAP_DISTANCE_THRESHOLD = 10;
// 处理含有disabled属性的标签
const HAS_DISABLED_TAG = ['button', 'input', 'checkbox', 'picker', 'radio', 'slider', 'textarea', 'switch'];
// 手势事件是否满足执行条件
const eventExecCondition = function (e) {
    if (HAS_DISABLED_TAG.indexOf(this.subTag) > -1 && attrValBool(this.data.get('disabled'))) {
        return false;
    }
    return true;
};
const behaviorMap = {
    form: {
        methods: {
            attached(originMethod = noop, ...args) {
                this.dispatch('form:register', {
                    target: this,
                    name: this.data.get('name')
                });
                return originMethod.call(this, ...args);
            },

            detached(originMethod = noop, ...args) {
                this.dispatch('form:unregister', {
                    target: this,
                    name: this.data.get('name')
                });
                return originMethod.call(this, ...args);
            },

            getFormValue(originMethod) {
                if (!originMethod) {
                    return this.el.value;
                }
                return originMethod.call(this);
            },

            resetFormValue(originMethod) {
                if (!originMethod) {
                    return (this.el.value = null);
                }
                return originMethod.call(this);
            }
        }
    },

    userTouchEvents: {
        methods: {
            onTouchEnd(originMethod = noop, $event, capture) {
                if (!eventExecCondition.call(this, $event)) {
                    return;
                }
                const prefix = capture ? 'capture' : '';
                clearTimeout(this[`__${prefix}longpressTimer`]);
                let touchRelation = this.touchRelation;
                touchRelation.end = {
                    x: $event.changedTouches[0].screenX,
                    y: $event.changedTouches[0].screenY,
                    time: +new Date()
                };
                if (this.__touchesLength === 1
                    && computeDistance(touchRelation.end, touchRelation.start) < TAP_DISTANCE_THRESHOLD) {
                    if (touchRelation.end.time - touchRelation.start.time < LONG_PRESS_TIME_THRESHOLD) {
                        this.fire(prefix + 'bindtap', $event);
                    }
                }
                this.fire(prefix + 'bindtouchend', $event);
                return originMethod.call(this, $event, capture);
            },

            onTouchcancel(originMethod = noop, $event, capture) {
                if (!eventExecCondition.call(this, $event)) {
                    return;
                }
                const prefix = capture ? 'capture' : '';
                this.fire(prefix + 'bindtouchcancel', $event);
                return originMethod.call(this, $event, capture);
            },

            onTouchStart(originMethod = noop, $event, capture) {
                if (!eventExecCondition.call(this, $event)) {
                    return;
                }
                this.__touchesLength = $event.touches.length;
                const prefix = capture ? 'capture' : '';
                this.touchRelation.start = {
                    x: $event.changedTouches[0].screenX,
                    y: $event.changedTouches[0].screenY,
                    time: +new Date()
                };
                // 备份event参数
                this.$event = {
                    currentTarget: $event.currentTarget,
                    target: $event.target,
                    changedTouches: $event.changedTouches,
                    touches: $event.touches,
                    timeStamp: $event.timeStamp
                };
                this[`__${prefix}longpressTimer`] = setTimeout(() => {
                    const bindEvents = Object.keys(this.listeners);
                    // longpress事件优先级比longtap高，若开发者绑定了longpress和longtap，只会触发longpress
                    if (bindEvents.includes(prefix + 'bindlongpress')) {
                        this.fire(prefix + 'bindlongpress', this.$event);
                    }
                    else if (bindEvents.includes(prefix + 'bindlongtap')) {
                        this.fire(prefix + 'bindlongtap', this.$event);
                    }
                }, LONG_PRESS_TIME_THRESHOLD);
                this.fire(prefix + 'bindtouchstart', $event);
                return originMethod.call(this, $event, capture);
            },

            onTouchMove(originMethod = noop, $event, capture) {
                if (HAS_DISABLED_TAG.indexOf(this.subTag) > -1 && attrValBool(this.data.get('disabled'))) {
                    return;
                }
                const prefix = capture ? 'capture' : '';
                let touchRelation = this.touchRelation;
                touchRelation.move = {
                    x: $event.changedTouches[0].screenX,
                    y: $event.changedTouches[0].screenY
                };
                if (computeDistance(touchRelation.move, touchRelation.start) > TAP_DISTANCE_THRESHOLD) {
                    clearTimeout(this[`__${prefix}longpressTimer`]);
                }
                this.fire(prefix + 'bindtouchmove', $event);
                return originMethod.call(this, $event, capture);
            },

            created(originMethod = noop, ...args) {
                this.touchRelation = {};
                if ((hasCustomEvent(this.listeners) || this.shouldBindEvents) && !this.eventsBinded) {
                    this.nativeEvents = this.nativeEvents.concat(eventUtils.normalEvents);
                    this.eventsBinded = true;
                }
                return originMethod.call(this, ...args);
            },

            detached(originMethod = noop, ...args) {
                clearTimeout(this.__longpressTimer);
                clearTimeout(this.__capturelongpressTimer);
                return originMethod.call(this, ...args);
            }
        }
    },

    hoverEffect: {
        methods: {
            created(originMethod = noop, ...args) {
                const hoverClass = this.data.get('hoverClass');
                if (hoverClass && !this.eventsBinded) {
                    this.nativeEvents = this.nativeEvents.concat(eventUtils.normalEvents);
                    this.eventsBinded = true;
                }
                return originMethod.call(this, ...args);
            },

            onTouchStart(originMethod = noop, $event, capture) {
                if (!eventExecCondition.call(this, $event)) {
                    return;
                }
                if (!capture) {
                    this.hovering = true;
                    if (!$event.stopHoverClass) {
                        this.hoverStart($event);
                    }
                    if (attrValBool(this.data.get('hoverStopPropagation'))) {
                        $event.stopHoverClass = true;
                    }
                }
                return originMethod.call(this, $event, capture);
            },

            hoverCancel(originMethod = noop, $event, capture) {
                if (!capture) {
                    if (this.hovering) {
                        if (!$event.stopHoverClass) {
                            this.hoverStay($event);
                        }
                        if (attrValBool(this.data.get('hoverStopPropagation'))) {
                            $event.stopHoverClass = true;
                        }
                    }
                    this.hovering = false;
                }
            },

            onTouchMove(originMethod = noop, $event, capture) {
                if (HAS_DISABLED_TAG.indexOf(this.subTag) > -1 && attrValBool(this.data.get('disabled'))) {
                    return;
                }
                this.hoverCancel($event, capture);
                return originMethod.call(this, $event, capture);
            },

            onTouchEnd(originMethod = noop, $event, capture) {
                if (!eventExecCondition.call(this, $event)) {
                    return;
                }
                this.hoverCancel($event, capture);
                return originMethod.call(this, $event, capture);
            },

            onTouchcancel(originMethod = noop, $event, capture) {
                if (!eventExecCondition.call(this, $event)) {
                    return;
                }
                this.hoverCancel($event, capture);
                return originMethod.call(this, $event, capture);
            },

            hoverStay(originMethod = noop, $event) {
                const hoverClass = this.data.get('hoverClass');
                if (hoverClass) {
                    let hoverStayTime = this.data.get('hoverStayTime');
                    let privateClass = this.data.get('privateClass');
                    this.deleted = false;
                    clearTimeout(this.hoverStayId);
                    this.hoverStayId = setTimeout(() => {
                        this.data.set('privateClass', this.classDel(privateClass, hoverClass));
                        this.deleted = true;
                    }, hoverStayTime);
                }
            },

            hoverStart(originMethod = noop, $event) {
                const hoverClass = this.data.get('hoverClass');
                if (hoverClass) {
                    let hoverStartTime = this.data.get('hoverStartTime');
                    let privateClass = this.data.get('privateClass');
                    this.deleted = false;
                    this.hoverStartId = setTimeout(() => {
                        this.data.set('privateClass', this.classAdd(privateClass, hoverClass));
                        if (this.deleted) {
                            this.hoverStay($event);
                        }
                    }, hoverStartTime);
                }
            },

            classAdd(originMethod = noop, origin, fragmentName) {
                return (origin + ' ' + fragmentName).trim();
            },

            classDel(originMethod = noop, origin, fragmentName) {
                return origin.replace(new RegExp(`${fragmentName}`, 'g'), '');
            }
        }
    },

    noNativeBehavior: {
        methods: {
            onContextmenu($event) {
                $event.preventDefault && $event.preventDefault();
            },

            compiled(originMethod = noop, ...args) {
                this.nativeEvents = this.nativeEvents.concat(eventUtils.nativeBehaviorEvents);
                return originMethod.call(this, ...args);
            }
        }
    },

    animateEffect: {
        methods: {
            created(originMethod = noop, ...args) {
                const animationEvents = [
                    'transitionend', 'webkitTransitionEnd',
                    'animationiteration', 'webkitAnimationIteration',
                    'animationstart', 'webkitAnimationStart',
                    'animationend', 'webkitAnimationEnd'];
                animationEvents.forEach(eventName => {
                    this.el.addEventListener(eventName, e => {
                        this.dispatchEvent(`bind${eventName}`);
                    });
                });
                return originMethod.call(this, ...args);
            },
            slaveRendered(originMethod = noop, ...args) {
                let animationData = this.data.get('animation');
                if (animationData && animationData.commandSetQueue
                    && !isEqualObject(this.__animationData, animationData)) {
                    this.__animationData = animationData;
                    animationData = null;
                    animationEffect(this.el, this.__animationData);
                }
                return originMethod.call(this, ...args);
            }
        }
    },
    nativeEventEffect: {
        methods: {
            created(originMethod = noop, ...args) {
                this.el.catchEvent = {
                    bubbling: {},
                    capture: {}
                };
                // 支持冒泡、捕获的事件
                this.bubEventNames = ['bindtouchstart', 'bindtouchmove',
                    'bindtouchend', 'bindtouchcancel', 'bindtap',
                    'bindlongpress', 'bindlongtap', 'bindtouchforcechange'];
                // 能终止tap事件冒泡、捕获的事件集合
                this.stopTapTags = ['bindtouchstart', 'capturebindtouchstart'];
                // 终止事件冒泡的NA组件集合
                this.stopBubblingTags = ['SWAN-CANVAS', 'SWAN-VIDEO', 'SWAN-LIVE-PLAYER',
                    'SWAN-CAMERA', 'SWAN-AR-CAMERA', 'SWAN-MAP'];
                // 没有手势事件的NA组件集合即不支持冒泡、捕获的组件(如：map组件的bindtap属于自定义事件)
                this.noTouchEventTags = ['SWAN-MAP'];
                this.noTouchEventTags.indexOf(this.el.tagName) === -1 && this.bindNaEvents();
                return originMethod.call(this, ...args);
            },
            // 绑定手势事件监听
            bindNaEvents() {
                // NA组件未绑定touchstart事件，默认也监听，默认是冒泡阶段
                let eventList = Object.keys(this.listeners);
                this.el.tagName !== 'SWAN-VIEW'
                    && !this.listeners['bindtouchstart'] && !this.listeners['capturebindtouchstart']
                    && eventList.push('bindtouchstart');
                eventList.forEach(eventName => {
                    if (this.bubEventNames.indexOf(eventName.replace('capture', '')) > -1) {
                        this.bindNaBubblingEvent(eventName.replace('capture', '')); // 默认绑定冒泡事件
                        const capture = eventName.startsWith('capture');
                        capture && this.bindNaCaptureEvent(eventName.replace('capture', ''));
                        this.getEventCatch(eventName, capture);
                    }
                });
            },
            // 获取终止事件执行的参数catch
            getEventCatch(originMethod = noop, eventName, capture) {
                if (this.listeners[eventName]
                    && this.listeners[eventName][0].declaration.expr.args[4].value === 'catch') {
                    capture ? (this.el.catchEvent.capture[eventName] = true)
                        : (this.el.catchEvent.bubbling[eventName] = true);
                    if (this.stopTapTags.indexOf(eventName) > -1) {
                        this.el.catchEvent.bubbling['bindtap'] = true;
                        capture && (this.el.catchEvent.capture['capturebindtap'] = true);
                    }
                }
            },
            // 拼接返回给用户的参数
            getDispatchEvent(originMethod = noop, e) {
                e.detail.changedTouches.forEach(touch => {
                    touch.pageX = touch.clientX + window.scrollX;
                    touch.pageY = touch.clientY + window.scrollY;
                });
                e.detail.touches.forEach(touch => {
                    touch.pageX = touch.clientX + window.scrollX;
                    touch.pageY = touch.clientY + window.scrollY;
                });
                return {
                    target: e.target,
                    currentTarget: e.currentTarget,
                    touches: e.detail.touches,
                    changedTouches: e.detail.changedTouches,
                    timeStamp: e.detail.timeStamp
                };
            },
            // 绑定冒泡事件
            bindNaBubblingEvent(originMethod = noop, eventName) {
                this.el.addEventListener(eventName, e => {
                    // 冒泡到stopBubblingTags标签，终止冒泡
                    if (this.stopBubblingTags.indexOf(e.currentTarget.tagName) > -1
                        && e.currentTarget.tagName !== e.target.tagName) {
                        return e.stopPropagation();
                    }
                    // 点击到了目标元素&&触发了touchstart事件,表示可以触发tap事件
                    if (eventName === 'bindtouchstart' && e.target.id === e.currentTarget.id) {
                        this.el.triggerTap = true;
                    }
                    this.fire(eventName, this.getDispatchEvent(e));
                    // 遇到catch事件，终止冒泡
                    this.el.catchEvent.bubbling[eventName] && e.stopPropagation();
                });
            },
            // 绑定捕获事件
            bindNaCaptureEvent(originMethod = noop, eventName) {
                this.el.addEventListener(eventName, e => {
                    // 点击到了目标元素&&触发了touchstart事件,表示可以触发tap事件
                    if (eventName === 'bindtouchstart' && e.target.id === e.currentTarget.id) {
                        this.el.triggerTap = true;
                    }
                    this.fire(`capture${eventName}`, this.getDispatchEvent(e));
                    // 遇到catch事件，终止捕获
                    this.el.catchEvent.capture[`capture${eventName}`] && e.stopPropagation();
                }, true);
            },
            // 派发事件，先捕获再冒泡
            dispatchNaEvent(originMethod = noop, eventName, params = {}) {
                // 当前实例touchstart事件没触发则tap、longtap事件也不触发
                // 除去map组件，因为map组件的bindtap属于自定义事件
                if (!this.el || ((eventName === 'tap' || eventName === 'longtap')
                    && this.noTouchEventTags.indexOf(this.el.tagName) === -1
                    && (params.touches.length > 1 || !this.el.triggerTap))) {
                    return;
                }
                eventName === 'longtap' && this.dispatchNaEvent('longpress', params); // 长按事件支持longtap/longpress
                if (this.bubEventNames.indexOf(`bind${eventName}`) > -1
                    && this.noTouchEventTags.indexOf(this.el.tagName) === -1) {
                    this.el.dispatchEvent(new CustomEvent(`bind${eventName}`, {
                        detail: {
                            ...params
                        },
                        bubbles: true
                    }));
                } else { // 不需要冒泡的自定义事件
                    this.dispatchCustomEvent && this.dispatchCustomEvent(`bind${eventName}`, params);
                }
            }
        }
    }
};
const decorateAction = (target, methodName, methods) => {
    const originMethod = target.prototype[methodName];
    target.prototype[methodName] = function (...args) {
        return methods[methodName].call(this, originMethod, ...args);
    };
};

export const behavior = (type, target) => {
    const types = typeof type === 'string' ? [type] : type;
    types.forEach(type => {
        const methods = (behaviorMap[type] || {}).methods;
        if (methods) {
            Object.keys(methods).forEach(methodName => decorateAction(target, methodName, methods));
        }
    });
    return target;
};
