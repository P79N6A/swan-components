/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file bdml's file's base elements <text>
 * @author jiamiao(jiamiao@baidu.com)
 */
import style from './index.css';
import {attrValBool} from '../utils';

export default {

    behaviors: ['userTouchEvents', 'animateEffect'],

    initData() {
        return {
            selectable: false,
            space: false
        };
    },

    computed: {
        textSelectableClass() {
            return attrValBool(this.data.get('selectable')) ? 'text-selectable' : '';
        }
    },

    attached() {
        this.showText = this.ref('showText');
        this.templateText = this.ref('templateText');
        this.filterSpace();
    },

    slaveUpdated() {
        const context = this;
        this.nextTick(() => {
            context.filterSpace();
        });
    },

    /**
     * 对text中的文本处理后append到真实展示的dom节点中
     */
    filterSpace() {
        let newDocument = document.createDocumentFragment();
        const childLength = this.templateText.childNodes.length;
        for (let n = 0; n < childLength; n++) {
            let childItem = this.templateText.childNodes.item(n);
            // 若子节点为文本文档，替换之后插入文档碎片
            if (childItem.nodeType === childItem.TEXT_NODE) {
                let afterSpaceArr = this.textSpace(childItem.textContent).split('\n');
                afterSpaceArr.forEach((item, index) => {
                    index && newDocument.appendChild(document.createElement('br'));
                    newDocument.appendChild(document.createTextNode(item));
                });
            }
            // 若子节点为元素，除了swan-text标签之外，其余的都过滤掉，text组件只能嵌套text
            else if (childItem.nodeType === childItem.ELEMENT_NODE && 'SWAN-TEXT' === childItem.tagName) {
                newDocument.appendChild(childItem.cloneNode(!0));
            }
        }
        // 插入实际展示的dom里，因为如果只有一个span，以下操作会使view层找不到原本的元素，导致视图层不动态更新
        this.showText.innerHTML = '';
        this.showText.appendChild(newDocument);
    },

    /**
     * 根据接收的space处理文本子节点中的空格
     * @param {string} text 当前文本为文本文档的子节点
     * @return {string} 处理完空格后的文本
     */
    textSpace(text) {
        const space = this.data.get('space');
        return space ? ('nbsp' === space ? text = text.replace(/ /g, ' ') : 'ensp' === space
            ? text = text.replace(/ /g, ' ') : 'emsp' === space && (text = text.replace(/ /g, ' '))) : text;
    },

    template: `<swan-text class="{{textSelectableClass}}">
        <span s-ref='templateText' style="display: none;"><slot></slot></span>
        <span s-ref='showText'></span>
    </swan-text>`
};
