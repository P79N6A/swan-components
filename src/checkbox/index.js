/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file bdml's file's base elements <checkbox>
 * @author lijiahui(lijiahui02@baidu.com)
 *
 */
import style from './index.css';
import {attrValBool} from '../utils';

export default {

    behaviors: ['userTouchEvents', 'hoverEffect'],

    initData() {
        return {
            privateStyle: style,
            privateClass: '',
            checked: false,
            disabled: false,
            color: '#3c76ff'
        };
    },

    computed: {
        setUserColor() {
            return attrValBool(this.data.get('checked'))
                ? `background-color: ${this.data.get('color')};` : '';
        }
    },

    template: `<swan-checkbox
        class="{{privateClass}}"
        value="{{value}}"
        checked="{{checked}}"
        disabled="{{disabled}}"
        on-click="onClick($event)"
    >
        <div class="{{'${style['swan-checkbox-input']}'}}"
            style="{{setUserColor}}"
        ></div>
        <slot></slot>
    </swan-checkbox>`,

    attached() {
        this.dispatch('checkbox-item-init', {
            item: this,
            checked: this.data.get('checked'),
            value: this.data.get('value')
        });
        // 配合 label
        // 声明点击label触发label内第一个控件的事件
        this.communicator.onMessage('LabelFirstTapped',
            message => {
                if (message.data && this.id === message.data.target) {
                    this.onClick(message.data.event);
                }
            }
        );
        // 响应 Label 发出的事件
        this.communicator.onMessage('LabelTapped', message => {
            // 使用 label 的 for + id
            if (message.data && message.data.target === this.id) {
                this.onClick(message.data.event);
            }
        });
    },

    /**
     * 响应数据变化
     */
    updated() {
        this.dispatch('checkbox-item-change', {
            checked: this.data.get('checked'),
            value: this.data.get('value')
        });
    },

    /**
     * 点击事件处理
     *
     * @param {Event} $event 事件对象
     */
    onClick($event) {
        if (attrValBool(this.data.get('disabled'))) {
            return;
        }
        this.data.set('checked', !attrValBool(this.data.get('checked')));
    }
};
