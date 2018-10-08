/**
 * @file bdml's file's base elements <checkbox>
 * @author lijiahui(lijiahui02@baidu.com)
 *
 */
import style from './index.css';
import {attrValBool} from '../utils';

export default {

    behaviors: ['userTouchEvents', 'hoverEffect', 'form'],

    constructor() {
        this.initialValue = false;
    },

    initData() {
        return {
            privateStyle: style,
            privateClass: 'swan-switch-wrapper',
            checked: false,
            disabled: false,
            type: 'switch',
            color: '#3388ff'
        };
    },

    computed: {
        getSwitchChecked() {
            return attrValBool(this.data.get('checked')) ? ` swan-${this.data.get('type')}-input-checked` : '';
        },
        getUserColor() {
            return attrValBool(this.data.get('checked'))
                ? `border-color: ${this.data.get('color')}; background-color: ${this.data.get('color')};` : '';
        }
    },

    template: `<swan-switch
        class="{{privateClass}}"
        checked="{{checked}}"
        color="{{color}}"
        type="{{type}}"
        name="{{name}}"
        on-click="onClick($event)"
    >
        <div class="{{'${style['swan-switch-input']}'}}
            {{getSwitchChecked}}"
            style="{{getUserColor}}"
            hiddenl="{{type}}"
        ></div>
        <div class="{{'${style['swan-checkbox-input']}'}}
            {{getSwitchChecked}}"
            style="color: {{color}};"
            hiddenl="{{type}}"
        ></div>
    </swan-switch>`,

    /**
     * 组件创建
     */
    attached() {
        this.initialValue = attrValBool(this.data.get('checked'));
        // 声明点击label触发label内第一个控件的事件
        this.communicator.onMessage('LabelFirstTapped',
            message => {
                if (message.data && this.id === message.data.target) {
                    this.onClick(message.data.event);
                }
            }
        );
         // 响应 Label 发出的事件
        this.communicator.onMessage('LabelTapped',
            message => {
                if (message.data && message.data.target === this.id && !attrValBool(this.data.get('disabled'))) {
                    this.onClick(message.data.event);
                }
            }
        );
    },

    /**
     * 响应 form 组件的 submit 事件
     *
     * @override
     * @return {string} value 值
     */
    getFormValue() {
        return this.data.get('checked');
    },

    /**
     * 响应 form 组件的 reset 事件
     *
     * @override
     */
    resetFormValue() {
        this.data.set('checked', this.initialValue);
    },

    /**
     * 点击事件处理器
     *
     * @param {Event} $event 对象
     */
    onClick($event) {
        if (attrValBool(this.data.get('disabled'))) {
            return;
        }
        this.data.set('checked', !attrValBool(this.data.get('checked')));
        this.boxjs.device.vibrateShort();
        this.dispatchEvent('bindchange', {
            detail: {
                checked: this.data.get('checked')
            }
        });
    }
};
