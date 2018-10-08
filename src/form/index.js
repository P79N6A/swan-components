/**
 * @file bdml's file's base elements <form>
 * @author jianglian(jianglian01@baidu.com)
 *          houyu(houyu01@baidu.com)
 *          sunbaixin(sunbaixin@baidu.com)
 */
import {attrValBool} from '../utils';
export default {

    behaviors: ['userTouchEvents', 'noNativeBehavior'],

    constructor(props) {
        this.formChilds = [];
    },
    initData() {
        return {
            reportSubmit: false
        };
    },
    template: `<swan-form>
        <slot></slot>
    </swan-form>`,

    messages: {
        'form:register'({value: {target, name}}) {
            if (name) {
                this.formChilds.push({target, name});
            }
        },

        'form:unregister'({value: {target, name}}) {
            this.formChilds = this.formChilds.filter(item => item.name !== name);
        },

        'form:reset'(...args) {
            this.resetHandler(...args);
        },

        'form:submit'(args) {
            this.submitHandler(args);
        }
    },

    submitHandler(args) {
        const formParams = this.formChilds.reduce((formParams, item, index) => {
            if (item.target.getFormValue) {
                formParams[item.name] = item.target.getFormValue();
            }
            return formParams;
        }, {});
        let srcElement = args.target.el;
        let target = {
            dataset: srcElement.dataset,
            id: srcElement.id,
            offsetLeft: srcElement.offsetLeft,
            offsetTop: srcElement.offsetTop
        };
        let detail = {
            target,
            value: formParams
        };
        if (attrValBool(this.data.get('reportSubmit'))) {
            // 创建二级回调的函数名及函数体
            this.callbackName = `formCallback_${new Date() - 0}_${this.id || ''}`;
            global[this.callbackName] = args => this.formCallback.call(this, detail, args);
            this.boxjs.data.get({
                name: 'swan-formId',
                data: {
                    cb: this.callbackName
                }
            }).catch(err => {
                detail.formId = '';
                this.dispatchEvent('bindsubmit', {
                    detail
                });
            });
        } else {
            this.dispatchEvent('bindsubmit', {
                detail
            });
        }
    },

    resetHandler() {
        this.formChilds.forEach(item => item.target.resetFormValue());
        this.dispatchEvent('bindreset');
    },
    formCallback(detail, res) {
        let resData = (typeof(res) === 'string') ? JSON.parse(res) : res;
        let formData = resData && resData.data && resData.data.data ? resData.data.data : {};
        let formId = formData.formid !== undefined ? formData.formid : '';
        detail.formId = formId;
        this.dispatchEvent('bindsubmit', {
            detail
        });
        // 销毁二级回调的函数名及函数体
        global[this.callbackName] = null;
        this.callbackName = null;
    }
};