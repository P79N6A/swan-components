/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file swan xml querySelector
 * @author yican(yangtianyi01@baidu.com)
 */
import {SelectorOperation} from './selectorOperation';
/**
 * 初始化selector生成器
 *
 * @param {Object} communicator - 监听的事件流对象
 * @return {Function} 创建selector的生成器
 */
export const initSelectorQuery = communicator => {

    let selectionInstanceMap = {};

    communicator.onMessage('getSlaveSelector', params => {
        const slaveId = params.slaveId;
        let selection = selectionInstanceMap[slaveId];
        const paramsValue = JSON.parse(params.value);
        if (selection) {
            const {index, data, execId} = paramsValue;
            const len = selection.queue.length;
            selection.queueCb[index] && selection.queueCb[index](data);
            // exec callback
            let execCallbackInfo = selection.execCallback[execId];
            if (execCallbackInfo) {
                execCallbackInfo.resultArray[index] = paramsValue.data;
                let currentResultArraySize = execCallbackInfo.resultArray.filter(info => info !== undefined).length;
                if (currentResultArraySize === len) {
                    execCallbackInfo.cb.apply(null, [execCallbackInfo.resultArray]);
                }
            }

        }
    });

    return slaveId => {
        selectionInstanceMap[slaveId] =  new SelectorOperation(slaveId, communicator);
        return selectionInstanceMap[slaveId];
    };
};
