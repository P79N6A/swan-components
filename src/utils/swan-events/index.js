/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

import EventsEmitter from '@baidu/events-emitter';

const global = window;
global.swanEvents = global.swanEvents || new EventsEmitter();

export default function (type, data) {
    // console.log(type)
    global.swanEvents.fireMessage({
        type,
        data
    });
}
