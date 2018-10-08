/**
 * @file Page 类，在 Slave 中运行
 * @author houyu(houyu01@baidu.com)
 */
import styles from './public/page.css';
import {uiLocation} from './utils/dom/uiLocation';
import {getSelectData} from './utils/dom/swanXml/parseDataUtil';
import {eventProccesser, getValueSafety, EnviromentEvent} from './utils';
import {accumulateDiff} from './utils/data-diff';
import swanEvents from './utils/swan-events';
export default {

    dependencies: ['swaninterface', 'communicator'],

    constructor(options = {}) {
        this.boxjs = this.swaninterface.boxjs;
        this.swan = this.swaninterface.swan;
        const slaveIdObj = this.boxjs.data.get({
            name: 'swan-slaveIdSync'
        });
        if (!slaveIdObj) {
            throw new Error('Can not get slave id from baiduapp.');
        }
        this.slaveId = slaveIdObj.slaveId;
        this.masterNoticeComponents = [];
        this.browserPatch();
        this.initMessagebinding();
    },
    /*
     * 默认的初始化数据
     */
    initData() {
        return {};
    },

    slavePageRendered() {
        if (this.masterNoticeComponents.length > 0) {
            this.sendAbilityMessage('onPageRender', {
                customComponents: this.masterNoticeComponents
            });
            this.masterNoticeComponents = [];
        }
        this.communicator.fireMessage({
            type: 'slaveRendered'
        });
    },

    slavePageUpdated() {
        this.communicator.fireMessage({
            type: 'slaveUpdated'
        });
    },

    updated() {
        this.slavePageUpdated();
        this.slavePageRendered();
    },

    getFPTiming(timeGap) {
        if ('performance' in global) {
            let paintMetrics = performance.getEntriesByType('paint');
            if (paintMetrics !== undefined && paintMetrics.length > 0) {
                let fp = paintMetrics.filter(entry => entry.name === 'first-paint');
                if (fp.length >= 1) {
                    swanEvents('slave_fe_first_paint', {
                        eventId: 'fe_first_paint',
                        errorType: 'setTimeout',
                        timeStamp: parseInt(timeGap + fp[0].startTime, 10)
                    });
                } else {
                    swanEvents('slave_fe_first_paint', {
                        eventId: 'nreach',
                        errorType: 'fe_first_paint_error',
                        timeStamp: Date.now()
                    });
                }
            } else {
                swanEvents('slave_fe_first_paint', {
                    eventId: 'nreach',
                    errorType: 'fe_first_paint_error',
                    timeStamp: Date.now()
                });
            }
        } else {
            swanEvents('slave_fe_first_paint', {
                eventId: 'nreach',
                errorType: 'fe_first_paint_error',
                timeStamp: Date.now()
            });
        }
    },
    attached() {
        swanEvents('slave_active_render_end', {
            slaveId: this.slaveId
        });
        if (this.swaninterface.boxjs.platform.isAndroid()) {
            if ('performance' in global) {
                let timeGap = Date.now() - global.performance.now();
                if ('PerformanceObserver' in global) {
                    let observerPromise = new Promise((resolve, reject) => {
                        let observer = new global.PerformanceObserver(list => {
                            resolve(list);
                        });
                        observer.observe({
                            entryTypes: ['paint']
                        });
                    }).then(list => {
                        let fp = list.getEntries().filter(entry => entry.name === 'first-paint');
                        if (fp.length >= 1) {
                            swanEvents('slave_fe_first_paint', {
                                eventId: 'fe_first_paint',
                                errorType: 'observer',
                                timeStamp: parseInt(timeGap + fp[0].startTime, 10)
                            });
                        } else {
                            setTimeout(() => {
                                this.getFPTiming(timeGap);
                            }, 3000);
                        }
                    }).catch(error => {
                        setTimeout(() => {
                            this.getFPTiming(timeGap);
                        }, 0);
                    });
                } else {
                    setTimeout(() => {
                        this.getFPTiming(timeGap);
                    }, 3000);
                }
            } else {
                setTimeout(() => {
                    this.getFPTiming();
                }, 3000);
            }
        }
        this.slavePageRendered();
        this.sendAbilityMessage('rendered', this.masterNoticeComponents);
        this.sendAbilityMessage('nextTickReach');
    },

    messages: {
        'video:syncCurrentTime'({value: {target, id}}) {
            this.videoMap = this.videoMap || {};
            this.videoMap[id] = target;
            this.sendAbilityMessage('videoSyncMap', id);
        },

        abilityMessage({value: {eventType, eventParams}}) {
            this.sendAbilityMessage(eventType, eventParams);
        },

        addMasterNoticeComponents({value: componentInfo}) {
            this.masterNoticeComponents.push(componentInfo);
        },

        slavePageRendered() {
            this.slavePageRendered();
        }
    },

	/**
	 * 发送abilityMessage
	 *
	 * @private
	 * @param  {string} eventType 事件名称
	 * @param  {Object} eventParams 事件参数
	 */
    sendAbilityMessage(eventType, eventParams = {}) {
        this.communicator.sendMessage(
            'master',
            {
                type: 'abilityMessage',
                value: {
                    type: eventType,
                    params: eventParams
                },
                slaveId: this.slaveId
            }
        );
    },

    /**
     * 执行用户绑定的事件
     *
     * @param {string} eventName 事件名称
     * @param {Object} $event 事件对象
     * @param {Function} reflectMethod 用户回调方法
     * @param {boolean} capture 是否事件捕获
     * @param {boolean} catchType 是否终止事件执行
     * @param {Object} customEventParams 用户绑定的事件集合
     */
    eventHappen(eventName, $event, reflectMethod, capture, catchType, customEventParams) {
        if ($event && catchType === 'catch') {
            $event.stopPropagation && $event.stopPropagation();
            (eventName === 'touchstart' || eventName === 'touchmove')
            && $event.preventDefault && $event.preventDefault();
        }
        this.communicator.sendMessage(
            'master',
            {
                type: 'event',
                value: {
                    eventType: eventName,
                    reflectMethod,
                    e: eventProccesser(eventName, $event)
                },
                slaveId: this.slaveId,
                customEventParams
            }
        );
    },

	/**
	 * slave加载完通知master开始加载slave的js
	 *
	 * @private
	 */
    slaveLoaded() {
        this.communicator.sendMessage(
            'master',
            {
                type: 'slaveLoaded',
                value: {
                    status: 'loaded'
                },
                slaveId: this.slaveId
            }
        );
    },

	/**
	 * slave加载完通知master开始加载slave的js
	 *
	 * @private
	 */
    slaveJsLog() {
    },

    /**
     *
     * 设置 page 的初始化数据
     *
     * @param {Object} Data  需要初始化的数据
     * @param {string} Data.value   data 初始值，会通过 this.data.set 设置到当前 Page 对象
     * @param {string} Data.appConfig app.json中的内容
     */
    setInitData({value, appConfig}) {
        for (let k in value) {
            this.data.set(k, value[k]);
        }
        this.initPageEnviromentEvent(appConfig);
    },

    /**
     * 初始化事件绑定
     * @private
     */
    initMessagebinding() {
        this.communicator.onMessage(
            ['setData', 'pushData', 'popData', 'unshiftData', 'shiftData', 'removeAtData', 'spliceData'],
            params => {
                const setObject = params.setObject || {};
                const operationType = params.type.replace('Data', '');
                if (operationType === 'set') {
                    let setDataDiff = accumulateDiff(this.data.get(), setObject);
                    setDataDiff && setDataDiff.reverse().forEach(ele => {
                        const {kind, rhs, path, item, index} = ele;
                        let dataPath = path.reduce((prev, cur) => `${prev}['${cur}']`);
                        // 将用户setData操作数组的时候，分解成san推荐的数组操作，上面reverse也是为了对数组进行增删改的时候顺序不乱
                        if (kind === 'A') {
                            if (item.kind === 'N') {
                                this.data.push(dataPath, item.rhs);
                            }
                            else if (item.kind === 'D') {
                                this.data.splice(dataPath, [index]);
                            }
                        }
                        else {
                            this.data.set(dataPath, rhs);
                        }
                    });
                }
                else {
                    for (let path in setObject) {
                        this.data[operationType](path, setObject[path]);
                    }
                }
                this.nextTick(() => {
                    this.sendAbilityMessage('nextTickReach');
                    swanEvents('pageDataUpdate', {
                        slaveId: this.slaveId,
                        timestamp: params.pageUpdateStart
                    });
                });
            }
        );

        this.communicator.onMessage('postScrollToMessage', params => {
            uiLocation().pageScrollTo(params.value || {});
        });

        this.communicator.onMessage('querySlaveSelector', params => {
            const {selector, queryType, index, operation, fields, execId, contextId} = params.value;
            const data = getSelectData({selector, queryType, operation, fields, contextId});

            this.communicator.sendMessage(
                'master',
                {
                    type: 'getSlaveSelector',
                    value: JSON.stringify({
                        data,
                        index,
                        execId
                    }),
                    slaveId: this.slaveId
                }
            );
        });

        // 客户端向slave派发事件
        this.communicator.onMessage('abilityMessage', e => {
            this.communicator.fireMessage({
                type: `${e.value.type}_${e.value.params.id}`,
                params: e.value.params
            });
        });

        this.swaninterface.bind('PullDownRefresh', e => {
            this.sendAbilityMessage('pullDownRefresh', e);
        });
    },

    /**
     *
     * 初始化页面绑定在宿主环境的相关的事件
     *
     * @private
     * @param {Object} appConfig app.json 配制文件中的内容
     */
    initPageEnviromentEvent(appConfig) {
        const DEFAULT_BOTTOM_DISTANCE = 50;
        const onReachBottomDistance = global.pageInfo.onReachBottomDistance
                                    || getValueSafety(appConfig, 'window.onReachBottomDistance')
                                    || DEFAULT_BOTTOM_DISTANCE;
        const enviromentEvent = new EnviromentEvent();
        enviromentEvent
            .enviromentListen('reachBottom', e => this.sendAbilityMessage('reachBottom'), {onReachBottomDistance})
            .enviromentListen('scroll', e => this.sendAbilityMessage('onPageScroll', e));
    },
    stabilityLog() {
    },
    browserPatch() {
        // 适配iPhonX样式
        // iOS端bug，在预加载中调用getSystemInfoSync会抛出错误，故后移至此，待修复后挪走
        const systemInfo = this.swaninterface.swan.getSystemInfoSync();
        if (systemInfo.model && (systemInfo.model.indexOf('iPhone X') > -1)
        || (systemInfo.model === 'iPhone Simulator <x86-64>'
        && systemInfo.screenHeight === 812
        && systemInfo.screenWidth === 375)) {
            const platform = this.swaninterface.boxjs.platform
            if (platform.isBox() && platform.boxVersion()
            && platform.versionCompare(platform.boxVersion(), '10.13.0') < 0) {
                return;
            }
            const styleEl = document.createElement('style');
            document.head.appendChild(styleEl);
            const styleSheet = styleEl.sheet;
            styleSheet.insertRule('.swan-security-padding-bottom {padding-bottom: 34px}');
            styleSheet.insertRule('.swan-security-margin-bottom {margin-bottom: 34px}');
            styleSheet.insertRule('.swan-security-fixed-bottom {bottom: 34px}');
        }
    }
};
