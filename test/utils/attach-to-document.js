/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

export default function attach2Document(component) {
    let wrapper = document.createElement('div');
    let id =  'wrapper_' + (Date.now() + '').slice(-4) + '_' + (Math.random() + '').slice(-4)
    wrapper.id = id;
    document.body.appendChild(wrapper);
    component.attach(wrapper);
    return wrapper;
}