/**
 * @file swan的所有app中的componet的基类
 * @author houyu(houyu01@baidu.com)
 */
import {attrValBool, absolutePathResolver, datasetFilter, rpx2Vm} from '../utils';
import {strToArrSpliter, addClassPrefix, delClassPrefix} from '../utils/custom-component';
import {TOUCH_EVENTS_NAME} from '../utils/constant';

let slaveIdObj = null;
let logData = {
    list: []
};
// 所有原生组件名
const COVERCOMPONENT_TAG = [
    'swan-cover-view',
    'swan-cover-image',
    'swan-video',
    'swan-live-player',
    'swan-map',
    'swan-camera',
    'swan-canvas',
    'swan-ar-camera'
];

export default {

    dependencies: ['swaninterface', 'communicator', 'san'],

    computed: {
        style() {
            const rawStyle = this.data.get('style');
            if (rawStyle && typeof rawStyle === 'string') {
                return rpx2Vm(rawStyle);
            } else {
                return rawStyle;
            }
        }
    },

    constructor() {
        this.boxjs = this.swaninterface.boxjs;
        this.swan = this.swaninterface.swan;
        this.slaveId = this.getSlaveId(this.boxjs).slaveId;
        this.absolutePathResolve = this.getAbsolutePathResolve(global.pageInfo);
        this.bindLifeCycle();
        this.uid = this.data.get('id') || this.data.get('id') === 0 ? this.data.get('id') : this.id;
        this.data.set('id', this.uid);
        this.__startTime = new Date();
        this.selfExternalClassesList = [];
        this.setRecentOwner(this.owner);
        this.convertClassReceiver();
        this.replaceCustomComponentClass();
        this.watch('class', () => {
            this.replaceCustomComponentClass();
        });
    },

    /**
     * 重设owner引用, 避免template被当做自定义组件, 同时保留owner实例
     *
     * @param {Object} owner - 当前组件owner
     */
    setRecentOwner(owner) {
        if (owner && owner.tagName === 'swan-template') {
            return this.setRecentOwner(owner.owner);
        }
        this.recentOwner = owner;
    },

    /**
     * 统一接收自定义组件工厂对自定义组件内部组件的通知 (目前仅包括外部样式类和全局样式类的通知)
     */
    convertClassReceiver() {
        const originClasses = this.data.get('class');
        if (this.recentOwner && this.recentOwner._isCustomComponent && originClasses) {
            this.communicator.onMessage('convertCustomComponentClass', params => {
                if (Object.prototype.toString.call(params) === '[object Array]') {
                    // 新生成的节点拿之前传递的数据
                    params
                        .filter(singleParmas => singleParmas.nodeId === this.recentOwner.uid)
                        .forEach(singleParmas => {
                            this.convertClassEntry(singleParmas, originClasses);
                        });
                } else if (params.nodeId === this.recentOwner.uid) {
                    this.convertClassEntry(params, originClasses);
                }
            }, {listenPreviousEvent: true});
        }
    },

    convertClassEntry(params, originClasses) {
        const eventType = params.extraMessage.eventType;
        switch (eventType) {
            case 'addExternalClasses': {
                this.extraClassParmas = params.extraMessage.value;
                Object.keys(this.extraClassParmas.classes)
                    .some(externalClass => strToArrSpliter(originClasses).includes(externalClass))
                && this.replaceCustomComponentClass();
                break;
            }
            case 'addGlobalClass': {
                this.addGlobalClassStatus = true;
                this.replaceCustomComponentClass();
                break;
            }
        }
    },
    /**
     * 检测当前组件是否在自定义组件中，如果是，则将class更新为加前缀的class
     */
    replaceCustomComponentClass() {
        const originClasses = this.data.get('class');
        if (this.recentOwner && this.recentOwner._isCustomComponent && originClasses) {
            // 筛掉所有加工过没用的空字符串
            const originClassesList = strToArrSpliter(originClasses);
            let filteredClassesList = [];
            let replacedClass = '';

            // 无外部样式类配置, 对class不做任何处理
            if (!this.extraClassParmas) {
                filteredClassesList = originClassesList.slice(0);
            } else {
                // 避免在externalClass前面添加class前缀 & 避免在availableClasses前面添加class前缀
                filteredClassesList = originClassesList.filter(className =>
                    !this.extraClassParmas.availableClasses.includes(className)
                    && !this.extraClassParmas.externalClasses
                        .some(externalClass => className.includes(externalClass)));
                // 提取自身设置的externalClass
                this.filterSelfExternalClasses();
            }

            // 当前组件class前缀统一处理
            replacedClass = this.addCustomClassPrefix(filteredClassesList);
            // 当前组件有外部样式类添加标识, 进行加工
            replacedClass = this.addExternalClasses(replacedClass);
            // 当前组件有全局样式类添加标识, 进行加工
            replacedClass = this.addGlobalClasses(replacedClass, filteredClassesList);

            this.data.set('class', replacedClass);
        }
    },

    /**
     * 当配置多个externalClass的情况下, 只处理组件本身包含的class
     */
    filterSelfExternalClasses() {
        const selfExternalClasses = Object.keys(this.extraClassParmas.classes)
            .filter(className => this.data.get('class').includes(className))
            .map(className => this.extraClassParmas.classes[className]);
        this.selfExternalClassesList = this.selfExternalClassesList.concat(selfExternalClasses);
    },

    /**
     * 自定义组件内得原生组件class前缀统一处理, 包括全局样式类的处理, 以及添加过前缀则将第二个进行前缀删除
     *
     * @param {Array} classList - class队列
     * @return {string} 经过处理的class产出
     */
    addCustomClassPrefix(classList) {
        const hadReplacedClassList = [];
        return classList.map(singleClass => {
            if (hadReplacedClassList.includes(addClassPrefix(singleClass, this.recentOwner.componentName))) {
                return delClassPrefix(singleClass, this.recentOwner.componentName);
            } else if (new RegExp(`${this.recentOwner.owner.componentName}__`).test(singleClass)) {
                return singleClass;
            } else {
                hadReplacedClassList.push(singleClass);
                return addClassPrefix(singleClass, this.recentOwner.componentName);
            }
        }).join(' ');
    },

    /**
     * 自定义组件外部样式类加工
     *
     * @param {string} replacedClass - 需要处理的class
     * @return {string} 经过外部样式类加工处理的class
     */
    addExternalClasses(replacedClass) {
        if (this.extraClassParmas) {
            let externalClass = this.selfExternalClassesList
                .filter(className => !replacedClass.includes(className));
            // 自定义组件内部的自定义组价中的外部样式类, 前缀应该是外层的自定义组件名
            if (this.recentOwner.owner && this.recentOwner.owner._isCustomComponent) {
                externalClass = externalClass
                    .map(singleClass => addClassPrefix(singleClass, this.recentOwner.owner.componentName));
            }
            externalClass.length && (replacedClass += ' ' + externalClass.join(' '));
        }
        return replacedClass;
    },

    /**
     * 自定义组件全局样式类加工
     *
     * @param {string} replacedClass       - 需要处理的class
     * @param {string} filteredClassesList - 过滤之后的class原材料
     * @return {string} 经过全局样式类加工处理的class
     */
    addGlobalClasses(replacedClass, filteredClassesList) {
        if (this.addGlobalClassStatus || this.recentOwner.addGlobalClassStatus) {
            const globalClasses = filteredClassesList
                .map(className => delClassPrefix(className, this.recentOwner.componentName))
                .filter(className => !new RegExp(`\\b${className}\\b`).test(replacedClass));
            globalClasses.length && (replacedClass += ' ' + globalClasses.join(' '));
        }
        return replacedClass;
    },

    /**
     * 获取路径解析器，路径解析器中，传入相对路径，即可以当前页面为基准进行解析
     *
     * @param {Object} pageInfo - 页面的路径信息
     * @return {Function} 页面的路径解析器
     */
    getAbsolutePathResolve(pageInfo) {
        return path => absolutePathResolver(pageInfo.appPath, pageInfo.pagePath, path);
    },

    /**
     * 由于ios的webview第一次取不到slaveId,临时前端修改为后取slaveId
     *
     * @param {Object} boxjs - 端能力boxjs
     * @return {Object} slave的同步信息(包含slaveId)
     */
    getSlaveId(boxjs) {
        if (slaveIdObj) {
            return slaveIdObj;
        }
        const slaveIdObjFromBoxjs = boxjs.data.get({name: 'swan-slaveIdSync'});
        if (!slaveIdObjFromBoxjs) {
            throw new Error('Can not get slave id from baiduapp.');
        }
        return (slaveIdObj = slaveIdObjFromBoxjs);
    },

    created() {
        this.el.sanComponent = this;
        this.initHiddenProperty();

        // 用户的自定义组件不需要统计打点。
        // swan-component的created和组件自身的created都会执行，相关逻辑在 swan-core/src/slave/component-factory mergeComponentProtos
        if (!this._isCustomComponent) {
            this.componentStatistics();
        }
    },

    updated() {
        this.selfExternalClassesList.splice(0);
    },

    /**
     * 初始化 hidden 属性
     *
     * @private
     */
    initHiddenProperty() {

        /**
         * 隐藏或显示当前 Component
         *
         * @private
         * @param {boolean} hidden 是否隐藏
         */
        const setDisplayProperty = hidden => {
            if (attrValBool(hidden)) {
                this.el.setAttribute('hidden', 'true');
            }
            else {
                this.el.removeAttribute('hidden');
            }
        };
        setDisplayProperty(this.data.get('hidden'));
        this.watch('hidden', hidden => setDisplayProperty(hidden));
    },

    /**
     * 关联组件的生命周期与 slave 的生命周期
     *
     * @private
     *
     */
    bindLifeCycle() {
        this.__slaveUpdatedHandler = () => {
            if (!this.lifeCycle.disposed) {
                this.slaveUpdated();
            }
        };
        this.__slaveRenderedHandler = () => {
            if (!this.lifeCycle.disposed) {
                this.slaveRendered();
            }
        };
        // 为swan的组件扩充slaveUpdated方法，用者复写
        this.communicator.onMessage('slaveUpdated', this.__slaveUpdatedHandler);
        this.communicator.onMessage('slaveRendered', this.__slaveRenderedHandler);
    },

    /**
     * 解除组件生命周期与 slave 生命周期的关联
     *
     * @private
     */
    unbindLifeCycle() {
        this.__slaveUpdatedHandler && this.communicator.delHandler('slaveUpdated', this.__slaveUpdatedHandler);
        delete this.__slaveUpdatedHandler;
        this.__slaveRenderedHandler && this.communicator.delHandler('slaveRendered', this.__slaveRenderedHandler);
        delete this.__slaveRenderedHandler;
    },

    /**
     * 批量绑定用户事件，如 tap/longpress 等
     *
     * @public
     * @param {string} eventName 事件名称
     * @param {callback} callback 事件 callback
     */
    bindAction(eventName, callback) {
        this.shouldBindEvents = true;
        this.on(eventName, callback);
    },

    /**
     * 封装fire事件返回结构
     * @param {Object} params 参数对象
     * @return {Object} 统一的事件参数格式
    */
    getDispatchEventObj(params = {}) {
        const target = {
            id: this.uid,
            offsetLeft: this.el.offsetLeft,
            offsetTop: this.el.offsetTop,
            dataset: {...datasetFilter(this.data.raw)}
        };
        Object.assign(params, {target, currentTarget: target}, {timeStamp: new Date() - this.__startTime});
        return params;
    },

    /**
     * 封装fire用户绑定的事件
     * @param {string} eventType 事件名称
     * @param {Object} params 参数对象
     */
    dispatchEvent(eventType, params = {}) {
        if (!this.el) {
            return;
        }
        params = this.getDispatchEventObj(params);
        this.fire(eventType, params);
    },

    /**
     * 通知 master 组件渲染状态更新
     *
     * @param  {string} componentName 组件名称
     * @param  {string} state         insert|remove
     * @param  {string} domId         domId
     */
    sendStateChangeMessage(componentName, state, domId) {
        this.communicator.sendMessage(
            'master',
            {
                type: 'componentStateChange',
                slaveId: this.slaveId,
                componentName,
                state,
                domId
            }
        );
    },

    /**
     * onTouchEnd
     * @public
     */
    onTouchEnd() {},

    /**
     * onTouchcancel
     * @public
     */
    onTouchcancel() {},

    /**
     * onTouchStart
     * @public
     */
    onTouchStart() {},

    /**
     * onTouchMove
     * @public
     */
    onTouchMove() {},

    /**
     * onContextmenu
     * @public
     */
    onContextmenu() {},

    /**
     * slaveUpdated
     * @public
     */
    slaveUpdated() {},

    /**
     * slaveRendered
     * @public
     */
    slaveRendered() {},

    /**
     * 判定是否原生组件
     * @public
     * @return {boolean} 是否原生组件
    */
    isNativeComponent() {
        const tagName = this.el ? this.el.tagName.toLocaleLowerCase() : null;
        if (COVERCOMPONENT_TAG.includes(tagName)) {
            return true;
        }
        return false;
    },

    getFirstNativeParentComponent() {
        const parentComponent = this.parentComponent || {};
        const parentTagName = parentComponent.el
            ? parentComponent.el.tagName.toLocaleLowerCase()
            : null;
        if (!this || !this.el
            || !parentComponent || !parentComponent.el
            || [null, 'swan-page'].includes(parentTagName)) {
            return null;
        }
        if (parentComponent.isNativeComponent) {
            const isNativeComponent = this.isNativeComponent.call(parentComponent);
            if (isNativeComponent) {
                return parentComponent;
            }
            return parentComponent.getFirstNativeParentComponent
                ? this.getFirstNativeParentComponent.call(parentComponent)
                : null;
        }
        return null;
    },

    hasNativeParentComponent() {
        return this.getFirstNativeParentComponent() ? true : false;
    },

    getFixedNativeParentComponent() {
        const parentComponent = this.parentComponent || {};
        const parentTagName = parentComponent.el
            ? parentComponent.el.tagName.toLocaleLowerCase()
            : null;
        if (!this || !this.el
            || !parentComponent || !parentComponent.el
            || [null, 'swan-page'].includes(parentTagName)) {
            return null;
        }
        if (parentComponent.isNativeComponent) {
            const isNativeComponent = this.isNativeComponent.call(parentComponent);
            if (isNativeComponent) {
                let fixed = parentComponent.el
                    ? global.getComputedStyle(parentComponent.el).position === 'fixed'
                    : false;
                if (fixed || attrValBool(parentComponent.data.get('fixed'))) {
                    return parentComponent;
                }
                return parentComponent.getFixedNativeParentComponent
                    ? this.getFixedNativeParentComponent.call(parentComponent)
                    : null;
            }
            return parentComponent.getFixedNativeParentComponent
                ? this.getFixedNativeParentComponent.call(parentComponent)
                : null;
        }
        return null;
    },

    /**
     * 获取父组件的节点 id
     * @public
     * @param {Object} component 组件
     * @return {string} id
     */
    getFirstParentComponentId(component) {
        const parentComponent = this.parentComponent;
        const parentTagName = parentComponent
            ? parentComponent.el.tagName.toLocaleLowerCase()
            : null;
        let parentId = '';
        if (!parentComponent || parentTagName === null) {
            return '';
        }
        if (this.hasNativeParentComponent && this.hasNativeParentComponent()) {
            const {canvasId, id} = parentComponent.data.get();
            // [TODO] 组件内部逻辑应该只用 san_id 才对
            switch (parentTagName) {
                case 'swan-canvas':
                    parentId = canvasId;
                    break;
                case 'swan-camera':
                    parentId = parentComponent.cameraId;
                    break;
                case 'swan-ar-camera':
                    parentId = parentComponent.ARCameraId;
                    break;
                default:
                    parentId = id || parentComponent.id;
            }
            return parentId;
        } else if (!this.getFirstParentComponentId || parentTagName === null) {
            return '';
        } else {
            return this.getFirstParentComponentId.call(parentComponent);
        }
    },

    /**
     * 判断用户是否绑定了手势事件
     * @return {enum} '1'或'0'
     */
    hasGestrue() {
        return +(!!(Object.keys(this.listeners).filter(name => TOUCH_EVENTS_NAME.includes(name)).length)) + '';
    },

    detached() {
        this.unbindLifeCycle();
    },

    /**
     * 组件打点统计
     * 参数：componentName='组件名称',duration
     * @param {Object} params 打点数据
     */
    componentStatistics(params = {}) {
        logData.list.push({
            params,
            _this: this,
            duration: params.duration || (new Date() - this.__startTime)
        });
        if (logData.list.length >= 30) {
            if (!logData.appInfo) {
                logData.appInfo = this.boxjs.data.get({name: 'swan-appInfoSync'});
            }
            if (!logData.systemInfo) {
                logData.systemInfo = this.boxjs.device.systemInfo({type: 'sync'});
            }
            const data = {};
            logData.list.forEach(item => {
                const curTag = item._this.subTag;
                if (data[curTag]) {
                    data[curTag].count++;
                    data[curTag].duration = data[curTag].duration + item.duration;
                } else {
                    item.count = 1;
                    data[curTag] = item;
                }
            });
            const _params = {
                actionId: 833,
                value: {
                    from: 'swan',
                    ext: {
                        appkey: logData.appInfo.appid,
                        appVersion: logData.systemInfo.SDKVersion,
                        pagePath: global.pageInfo.pagePath,
                        list: []
                    }
                }
            };
            const logParams = {
                groupId: '16',
                bizId: '45',
                appVersion: logData.systemInfo.SDKVersion,
                swanType: 'swan',
                eventName: 'open@success',
                content: {
                    ext: {
                        from: 'h5',
                        appkey: logData.appInfo.appid,
                        list: []
                    }
                }
            };
            Object.keys(data).forEach(key => {
                _params.value.ext.list.push({
                    componentName: data[key].params.componentName || data[key]._this.subTag,
                    count: data[key].count,
                    duration: Math.floor(data[key].duration / data[key].count * 100) / 100
                });
                logParams.content.ext.list.push({
                    componentName: data[key].params.componentName || data[key]._this.subTag,
                    count: data[key].count,
                    duration: Math.floor(data[key].duration / data[key].count * 100) / 100
                });
            });
            this.boxjs.log({
                name: 'ubcReport',
                data: _params
            });
            this.boxjs.log({
                name: 'openStatisticEvent',
                data: logParams
            });
            logData.list = [];
        }
    }
};
