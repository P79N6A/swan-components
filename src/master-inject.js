/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file swan的组件，在master中注入的方法
 * @author houyu(houyu01@baidu.com)
 */
import {createAnimation} from './utils/animation';
import {initSelectorQuery} from './utils/dom/swanXml';
import webviewEventsReciever from './web-view/webviewEventsReceiver';

export const getComponentRecievers = communicator => ({
    ...webviewEventsReciever
});

export const getContextOperators = (swaninterface, communicator, getSlaveId) => {
    const createSelectorQuery = initSelectorQuery(communicator);
    return {
        createAnimation,
        createSelectorQuery: () => createSelectorQuery(getSlaveId()),
        pageScrollTo: ({scrollTop = 0, duration = 300}) => {
            communicator.sendMessage(
                getSlaveId(),
                {
                    type: 'postScrollToMessage',
                    value: {
                        scrollTop,
                        duration
                    }
                }
            );
        }
    };
};
