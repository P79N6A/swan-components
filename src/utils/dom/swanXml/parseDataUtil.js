/**
 * @file XML返回数据处理工具
 * @author liangshiquan
 */
import {datasetFilter} from '../../index'

const WHITE_LIST_SCROLL_VIEW = '.scroll-view-compute-offset';

// 判断selectDOM是否为scrollView组件
function isScrollView(selectDom) {
    return selectDom.tagName === 'SWAN-SCROLL-VIEW';
}

function isBody(selectDom) {
    return selectDom.tagName === 'BODY';
}

/**
 *
 * 获取DOM节点信息数据
 *
 * @private
 * @param {HTMLElement} selectDom 选择器对应的DOM
 * @param {string} operation 调用exec前的操作类型
 * @param {Object} fields fields方法传入的指定数据
 *
 * @return {Object} 返回节点信息数据集
 */
function getOperationData(selectDom, operation, fields = {}) {
    if (!selectDom) {
        return null;
    }
    const selectedDataMap = {
        'id': selectDom.id,
        'dataset': (selectDom.sanComponent
            && selectDom.sanComponent.data.raw
            && datasetFilter(selectDom.sanComponent.data.raw)) || {},
        'rect': {
            'left': selectDom.getBoundingClientRect().left,
            'right': selectDom.getBoundingClientRect().right,
            'top': selectDom.getBoundingClientRect().top,
            'bottom': selectDom.getBoundingClientRect().bottom
        },
        'size': {
            'width': selectDom.offsetWidth,
            'height': selectDom.offsetHeight
        }
    };
    const effectSelectDom = isScrollView(selectDom)
        ? (selectDom.querySelector(WHITE_LIST_SCROLL_VIEW))
        : selectDom;
    const scrollLeft = isBody(effectSelectDom)
        ? (document.documentElement.scrollLeft || document.body.scrollLeft)
        : effectSelectDom.scrollLeft;
    const scrollTop = isBody(effectSelectDom)
        ? (document.documentElement.scrollTop || document.body.scrollTop)
        : effectSelectDom.scrollTop;
    const selectedScrollDataMap = {
        id: effectSelectDom.id,
        dataset: effectSelectDom.dataset,
        scrollLeft,
        scrollTop
    };

    const operationActionMap = {
        'boundingClientRect': () => {
            return {
                id: selectedDataMap.id,
                dataset: selectedDataMap.dataset,
                ...selectedDataMap.rect,
                ...selectedDataMap.size
            };
        },
        'fields': () => {
            const fieldsTrueKeys = Object.keys(fields).filter(key => fields[key]);
            const trueKeysLen = fieldsTrueKeys.length;
            if (!trueKeysLen) {
                return {};
            }
            let data = {};
            for (let key of fieldsTrueKeys) {
                if (selectedDataMap[key]) {
                    Object.prototype.toString.call(selectedDataMap[key]).indexOf('Object') > -1
                    ? (data = {...data, ...selectedDataMap[key]})
                    : (data[key] = selectedDataMap[key]);
                }
                if (key === 'scrollOffset') {
                    data = {...data,
                            scrollLeft: selectedScrollDataMap.scrollLeft,
                            scrollTop: selectedScrollDataMap.scrollTop
                        };
                }
            }
            return data;
        },
        'scrollOffset': () => {
            return selectedScrollDataMap;
        }
    };

    return operationActionMap[operation] && operationActionMap[operation]() || {};
}

export function getSelectData({selector, queryType, operation, fields, contextId}) {
    const rootDom = contextId ? document.querySelector('#' + contextId) : document;
    switch (queryType) {
        case 'select':
            const selectDom = rootDom.querySelector(selector);
            return getOperationData(selectDom, operation, fields);
        case 'selectAll':
            const selectDomArr =  Array.prototype.slice.call(rootDom.querySelectorAll(selector));
            return selectDomArr.map(item => {
                return getOperationData(item, operation, fields);
            });
        case 'selectViewport':
            let data = getOperationData(rootDom.body, operation, fields);
            const rectArr = ['left', 'right', 'top', 'bottom'];
            rectArr.forEach(key => {
                data.hasOwnProperty(key) && (data[key] = 0);
            });
            return data;
        default:
            return {};
    }
}
