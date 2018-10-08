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
