/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file 自定义组件的超类代码
 * @author houyu(houyu01@baidu.com)
 */

export default {

    constructor() {

        this.communicator.onMessage(
            ['initData'],
            params => {
                params = Object.prototype.toString.call(params) === '[object Array]' ? params[0] : params;
                const componentPath = this.componentPath.replace(/.swan$/, '');
                const componentData = params.extraMessage.componentsData[componentPath];
                const initData = {...componentData, ...this.data.raw};
                for (const key in initData) {
                    this.data.set(key, initData[key]);
                    this.watch(key, value => this.propsChange(key, value));
                }
            },
            {listenPreviousEvent: true}
        );

        this.communicator.onMessage(
            ['setCustomComponentData'],
            params => {
                if (params.options.nodeId === this.uid) {
                    for (let path in params.setObject) {
                        this.data.set(path, params.setObject[path]);
                    }
                }
                this.nextTick(() => {
                    this.dispatch('slavePageRendered');
                    this.dispatch('abilityMessage', {
                        eventType: 'nextTickReach'
                    });
                });
            }
        );

        this.dispatch('addMasterNoticeComponents', {
            componentName: this.componentName,
            componentPath: this.componentPath.replace(/.swan$/g, ''),
            nodeId: this.uid,
            className: this.data.get('class') || '',
            data: this.data.raw,
            ownerId: this.owner.uid,
            parentId: this.parentComponent.uid
        });

        this.communicator.onMessage('triggerEvents', params => {
            if (params.nodeId === this.uid) {
                this.fire('bind' + params.eventName, params.eventDetail);
            }
        });

        this.insertStyle();
    },

    propsChange(key, value) {
        this.dispatch('abilityMessage', {
            eventType: 'customComponentEvent',
            eventParams: {
                type: 'customComponent:_propsChange',
                nodeId: this.uid,
                raw: {
                    key,
                    value
                }
            }
        });
    },

    behaviors: ['userTouchEvents', 'noNativeBehavior'],

    insertStyle() {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = this.customComponentCss;
        document.head.appendChild(styleTag);
    },

    detached() {
        this.dispatch('abilityMessage', {
            eventType: 'customComponentEvent',
            eventParams: {
                type: 'customComponent:detached',
                nodeId: this.uid
            }
        });
    },

    eventHappen(...args) {
        this.owner.eventHappen(...args, {nodeId: this.uid});
    }
};
