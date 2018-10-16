/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file bdml's file's icon elements <icon>
 * @author hzz780(huangzongzhe@baidu.com)
 */
import style from './index.css';

export default {

    behaviors: ['userTouchEvents', 'noNativeBehavior', 'hoverEffect', 'animateEffect'],
    template: `<swan-icon
            class="{{privateClass}}"
        >
            <span class="{{iconClass}} ${style['swan-icon']}" 
            s-if="{{type != 'loadingWhite' && type != 'loadingGrey'}}" 
            style="{{color ? 'color:' + color : ''}};{{size ? 'font-size:' + size + 'px': ''}}"></span>
            <span class="{{iconClass}} ${style['swan-icon']}" 
            s-if="{{type == 'loadingWhite' || type == 'loadingGrey'}}" 
            style="width: {{size}}px;height: {{size}}px;"></span>
        </swan-icon>`,
    computed: {
        iconClass() {
            return style['swan-icon-' + this.data.get('type')];
        }
    },

    initData() {
        return {
            privateClass: '',
            hoverStopPropagation: false,
            type: '',
            size: 23,
            color: ''
        };
    }
};