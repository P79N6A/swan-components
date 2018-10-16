/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file swan xml querySelector operation
 * @author yican(yangtianyi01@baidu.com)
 */

import {NodeRefOperation} from './nodeRefOperation';

let execId = 0;

export class SelectorOperation {

    constructor(slaveId, communicator) {
        this.component = '';
        this.defaultComponent = {};
        this.queue = [];
        this.queueCb = [];
        this.slaveId = slaveId;
        this.nodeRef = {};
        this.communicator = communicator;
        this.execCallback = {};
        this.contextId = null;
    }

    /**
     * [select function]
     * @param  {[type]} selector [One or more CSS selectors separated by commas]
     * @param  {[type]} el       [element]
     * @return {[type]}          [The element found, if any]
     */
    select(selector, el = document) {
        this.nodeRef = new NodeRefOperation(selector, this.slaveId, this);
        this.nodeRef.queryType = 'select';
        return this.nodeRef;
    }

    /**
     * [select function]
     * @param  {[type]} selector [ One or more CSS selectors separated by commas]
     * @param  {[type]} el       [ element]
     * @return {[type]}          [description]
     */
    selectAll(selector, el = document) {
        this.nodeRef = new NodeRefOperation(selector, this.slaveId, this);
        this.nodeRef.queryType = 'selectAll';
        return this.nodeRef;
    }

    selectViewport() {
        this.nodeRef = new NodeRefOperation('', this.slaveId, this);
        this.nodeRef.queryType = 'selectViewport';
        return this.nodeRef;
    }

    // in(component) {
    //     return;
    // }

    exec(cb) {
        execId++;
        if (Object.prototype.toString.call(cb).indexOf('Function') > -1) {
            this.execCallback[execId] = {cb: cb, resultArray: []};
        }

        // 取对应selector 发送消息到slave
        const len = this.queue.length;
        for (let index = 0; index < len; index++) {
            const {selector, queryType, operation, fields} = this.queue[index];
            this._querySlaveSelector({
                slaveId: this.slaveId,
                selector,
                queryType,
                index,
                operation,
                fields,
                execId
            });
        }
    }

    in(component) {
        this.contextId = component.nodeId;
        return this;
    }

    _querySlaveSelector({slaveId, selector, queryType, index, operation, fields, execId}) {
        this.communicator.sendMessage(
            slaveId,
            {
                type: 'querySlaveSelector',
                value: {
                    selector,
                    queryType,
                    index,
                    operation,
                    fields,
                    execId,
                    contextId: this.contextId
                }
            }
        );

    }
}
