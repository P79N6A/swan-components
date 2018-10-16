/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file bdml's file's base elements <view>
 * @author houyu(houyu01@baidu.com)
 */

export default {

    superComponent: 'swan-component',

    template: `<swan-view class="{{privateClass}}">
        <slot></slot>
    </swan-view>`,

    behaviors: ['userTouchEvents', 'noNativeBehavior', 'hoverEffect', 'animateEffect', 'nativeEventEffect'],

    initData() {
        return {
            privateClass: '',
            hoverStartTime: 50,
            hoverStayTime: 400,
            hoverStopPropagation: false
        };
    }
};
