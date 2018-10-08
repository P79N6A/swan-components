/**
 * @file swan的所有app中的componet的基类
 * @author houyu(houyu01@baidu.com)
 */
import {attrValBool, absolutePathResolver, datasetFilter} from '../utils';

let slaveIdObj = null;

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

    dependencies: ['swaninterface', 'communicator'],

    computed: {
        style() {
            const rawStyle = this.data.get('style');
            if (rawStyle && typeof rawStyle === 'string') {
                return rawStyle.replace(/(\d+(\.\d+)?)rpx/g, (...arg) => {
                    return ((+arg[1]) / 7.5) + 'vw';
                });
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
        this.startTime = new Date().getTime();
        this.replaceCustomComponentClass();
    },

    /**
     * 检测当前组件是否在自定义组件中，如果是，则将class更新为加前缀的class
     */
    replaceCustomComponentClass() {
        if (this.owner && this.owner.componentPath && this.data.get('class')) {
            const replacedClass = this.data.get('class').split(' ')
                .map(singleClass => singleClass
                    .replace(
                        new RegExp('^(' + this.owner.componentName + '__)?'),
                        this.owner.componentName + '__'
                    )
                )
                .join(' ');
            this.data.set('class', replacedClass);
        }
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
    },

    /**
     *
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
        // 为swan的组件扩充slaveUpdated方法，用者复写
        this.communicator.onMessage('slaveUpdated', () => {
            if (!this.lifeCycle.disposed) {
                this.slaveUpdated();
            }
        });
        this.communicator.onMessage('slaveRendered', () => {
            if (!this.lifeCycle.disposed) {
                this.slaveRendered();
            }
        });
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
        Object.assign(params, {target, currentTarget: target}, {timeStamp: new Date().getTime() - this.startTime});
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
     * 获取父组件的节点 id
     * @public
     * @param {Object} component 组件
     * @return {string} id
     */
    getFirstParentComponentId(component) {
        const parentComponent = this.parentComponent;
        const tagName = parentComponent ? parentComponent.el.tagName.toLocaleLowerCase() : null;
        let parentId = '';
        if (!parentComponent || tagName === null) {
            return '';
        }
        if (COVERCOMPONENT_TAG.includes(tagName)) {
            // [TODO] 组件内部逻辑应该只用 san_id 才对
            const {canvasId, id} = parentComponent.data.get();
            const sanId = parentComponent.id;
            switch (tagName) {
                case 'swan-video':
                    parentId = sanId;
                    break;
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
                    parentId = id || parentComponent.id || '';
            }
            return parentId;
        } else if (!this.getFirstParentComponentId || tagName === null) {
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
        return +(!!Object.keys(this.listeners).length) + '';
    }
};
