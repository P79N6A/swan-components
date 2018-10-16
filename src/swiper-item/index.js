/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file bdml's file's swiper-item elements <swiper-item>
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 */
import style from './index.css';

export default {

    behaviors: ['userTouchEvents', 'noNativeBehavior'],

    template: `
        <swan-swiper-item item-id="{{itemId}}">
            <slot></slot>
        </swan-swiper-item>`,

    initData() {
        return {
            itemId: ''
        };
    },

    attached() {
        Object.assign(this.el.style, {
            'position': 'absolute',
            'width': '100%',
            'height': '100%'
        });
    }
};
