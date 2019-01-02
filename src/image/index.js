/**
 * @file swan's file's base elements <image>
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 */
import styles from './index.css';
import {internalDataComputedCreator, typesCast} from '../computedCreator';

export default {

    constructor(props) {
        this.aheadDistance = 50; // 提前懒加载的距离
        this.rate = 1; // 图片 宽/高 比例
        this.originalHeight = ''; // 开发者设置在style上的高度
    },

    behaviors: ['userTouchEvents', 'noNativeBehavior', 'animateEffect'],

    initData() {
        return {
            src: '',
            mode: 'scaleToFill', // 图片裁剪、缩放的模式
            lazyLoad: false
        };
    },

    computed: {
        ...internalDataComputedCreator([
            {name: 'src', caster: typesCast.stringCast},
            {name: 'mode', data: ['scaleToFill', 'aspectFit', 'aspectFill', 'widthFix',
                'top', 'bottom', 'center', 'left', 'right', 'top left',
                'top right', 'bottom left', 'bottom right']},
            {name: 'lazyLoad', caster: typesCast.boolCast}
        ])
    },

    template: `<swan-image>
            <div s-ref="img"></div>
        </swan-image>`,

    attached() {
        this.img = this.ref('img');
        this.changeMode(this.data.get('__mode'));
        this.getImgPath();
        this.bindLazyLoadEvents();
        // 要确保setOutsideRulesPosition在changeMode后面调用，因为改了image的position
        this.setOutsideRulesPosition();
        this.watch('mode', val => {
            if (val !== 'widthFix') {
                this.el.style.height = this.originalHeight;
            }
            this.changeMode(this.data.get('mode'));
            this.setOutsideRulesPosition();
        });
        this.watch('src', src => {
            this.loaded = false;
            this.getImgPath();
        });
    },

    detached() {
        this.unbindLazyLoadEvents();
    },

    slaveUpdated() {
        // 对于widthFix的特殊处理，保持图片比例
        if (this.data.get('__mode') === 'widthFix') {
            this.handleWidthFixMode();
        }
    },

    bindLazyLoadEvents() {
        if (!this.data.get('__lazyLoad')) {
            return;
        }
        this.lazyloadHandler = () => {
            this.getImgPath();
        };
        // scroll-view, swiper组件里的懒加载
        this.communicator.onMessage('componentScroll', this.lazyloadHandler);
        // Page里的懒加载
        window.addEventListener('scroll', this.lazyloadHandler);
    },

    unbindLazyLoadEvents() {
        this.lazyloadHandler && this.communicator.delHandler('componentScroll', this.lazyloadHandler);
        this.lazyloadHandler && window.removeEventListener('scroll', this.lazyloadHandler);
        delete this.lazyloadHandler;
    },

    /**
     * 图片裁剪、缩放的模式
     * @param {string} [mode] 模式
     * @return {Object} 模式
     */
    selectMode(mode) {
        const modeMap = {
            'scaleToFill': {
                backgroundSize: '100% 100%'
            },
            'aspectFit': {
                backgroundSize: 'contain',
                backgroundPosition: 'center center'
            },
            'aspectFill': {
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
            },
            'widthFix': {
                backgroundSize: '100% 100%'
            },
            'top': {
                backgroundPosition: 'top center'
            },
            'bottom': {
                backgroundPosition: 'bottom center'
            },
            'center': {
                backgroundPosition: 'center center'
            },
            'left': {
                backgroundPosition: 'center left'
            },
            'right': {
                backgroundPosition: 'center right'
            },
            'top left': {
                backgroundPosition: 'top left'
            },
            'top right': {
                backgroundPosition: 'top right'
            },
            'bottom left': {
                backgroundPosition: 'bottom left'
            },
            'bottom right': {
                backgroundPosition: 'bottom right'
            }
        };
        return modeMap[mode];
    },

    /**
     * 选择图片裁剪、缩放的模式
     * @param {string} [mode] 模式
     * @return {boolean} 设置的模式是否存在
     */
    changeMode(mode) {
        let curStyle = this.selectMode(mode);
        if (!curStyle) {
            return false;
        }
        const commonStyle = {
            backgroundSize: 'auto auto',
            backgroundPosition: '0% 0%',
            backgroundRepeat: 'no-repeat'
        };
        const mergedStyle = {...commonStyle, ...curStyle};
        for (let s in mergedStyle) {
            this.img.style[s] = mergedStyle[s];
        }
    },

    /**
     * 设置用户写的position相关属性
     */
    setOutsideRulesPosition() {
        const positionAttrList = ['backgroundPosition', 'backgroundPositionX', 'backgroundPositionY'];
        positionAttrList.forEach(i => {
            if (this.el.style[i]) {
                this.img.style[i] = this.el.style[i];
            }
        });
    },

    /**
     * 是否满足在Page里的懒加载条件
     * @return {boolean} 是否满足懒加载条件
     */
    isShowImgInPage() {
        let rect = this.img.getBoundingClientRect();
        return rect.top + this.img.offsetHeight >= 0 && rect.left + this.img.offsetWidth >= 0
            && rect.top <= window.innerHeight && rect.left <= window.innerWidth;
    },

    /**
     * 获取图片地址
     * todo:如果图片地址是bdfile，需要调用隐藏端能力getLocalImgData方法获取本地图片地址
     * @return {string} 图片地址
     */
    getImgPath() {
        const src = this.data.get('__src');
        if (!src) {
            return;
        }
        if (src.indexOf('bdfile://') === 0) {
            this.boxjs.data.get({
                name: 'swan-localImgData',
                data: {filePath: src}
            }).then(fileObj => {
                const imgPath =  fileObj.filePath;
                this.loadImage(imgPath);
            }).catch(err => {
                console.err(err);
            });
        }
        else {
            let imgPath = this.absolutePathResolve(src);
            if (/^\s*data:image\//.test(src)) {
                imgPath = src;
            }
            this.loadImage(imgPath);
        }
    },

    /**
     * 加载背景图
     */
    loadImage(imgPath) {
        imgPath = this.data.get('__lazyLoad')
            ? (this.isShowImgInPage() ? imgPath : false) : imgPath;

        if (imgPath && !this.loaded) {
            this.tryLoadImg(imgPath)
            .then(imgEntity => {
                this.rate = imgEntity.width / imgEntity.height;
                this.originalHeight = this.el.style.height; // 记录开发者通过 style="height: xxx" 方式设置的高度，当mode由widthFix变为其它需要还原到此height
                // 对于widthFix的特殊处理，保持图片比例
                if (this.data.get('__mode') === 'widthFix') {
                    this.handleWidthFixMode();
                }
            }).catch(e => {
                console.error('image load faild');
            });
            this.img.style.backgroundImage = `url('${imgPath}')`;
            this.img.style.transform = 'translateZ(0)';
            setTimeout(() => {
                this.img.style.transform = '';
            }, 0);
            this.loaded = true;
        }
    },

    /**
     * 加载图片获取宽高
     * @param {string} [imgPath] 图片地址
     * @return {Object} promise对象
     */
    tryLoadImg(imgPath) {
        return new Promise((resolve, reject) => {
            let imgEntity = new window.Image();
            imgEntity.onerror = e => {
                this.dispatchEvent('binderror', {
                    detail: {
                        errMsg: 'something wrong: ' + JSON.stringify(e)
                    }
                });
                reject();
            };
            imgEntity.onload = e => {
                this.dispatchEvent('bindload', {
                    detail: {
                        height: e.target.height,
                        width: e.target.width
                    }
                });
                resolve(imgEntity);
            };
            imgEntity.src = imgPath;
        });
    },

    /**
     * 对于widthFix的特殊处理，保持图片比例
     */
    handleWidthFixMode() {
        this.el.style.height = this.el.offsetWidth / this.rate + 'px';
    }
};

