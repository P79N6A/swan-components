/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file bdml's file's picker-view elements <picker-view>
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 */
import style from './index.css';

export default {
    behaviors: ['userTouchEvents', 'noNativeBehavior'],
    constructor() {
        this.messages = {
            'UI:picker-view-column-change': () => {
                this.fireBindChange();
            }
        };
    },

    template: `
        <swan-picker-view value="{{value}}">
            <div class="wrapper" s-ref="wrapper">
                <slot 
                    var-value="value" var-indicatorStyle="indicatorStyle"
                    var-indicatorClass="indicatorClass" var-maskStyle="maskStyle"
                    var-maskClass="maskClass">
                </slot>
            </div>
        </swan-picker-view>`,

    initData() {
        return {
            indicatorStyle: '', // 设置选择器中间选中框的样式
            indicatorClass: '', // 设置选择器中间选中框的类名
            maskStyle: '', // 设置蒙层的样式
            maskClass: '', // 设置蒙层的类名
            value: [] // 默认值
        };
    },

    /*
     * 获取每列选择的值
     */
    getColumnValues() {
        return Array.prototype.slice.call(this.ref('wrapper').children).map(child => child.curIndex);
    },

    /*
     * 派发bindchange事件
     */
    fireBindChange() {
        const value = this.getColumnValues();
        this.data.set('value', value);
        this.dispatchEvent('bindchange', {
            detail: {
                value: value
            }
        });
    }
};
