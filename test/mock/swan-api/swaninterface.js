/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

import { boxjsDataGetMock, boxjsDataGetAsyncMock, boxjsDataGetCallbackMock, boxjsCoverInsertMock, boxjsCoverUpdateMock, boxjsCoverRemoveMock, boxjsUiMock, boxjsDeviceMock } from './mock-data';
export default () => ({
    boxjs: {
        data: {
            get(query) {
                const name = query.name;
                if (boxjsDataGetCallbackMock[name]
                    && (query.data.callback || query.data.cb)) {
                    setTimeout( () => {
                        let callback = query.data.callback || query.data.cb;
                        switch (typeof callback) {
                            case 'string':
                                window[callback]
                                && window[callback](JSON.stringify(boxjsDataGetCallbackMock[name]));
                                break;
                            case 'function':
                                callback(JSON.stringify(boxjsDataGetCallbackMock[name]));
                                break;
                        }
                    }, 0);
                    
                }
                if (boxjsDataGetMock[name]) {
                    return boxjsDataGetMock[name];
                } else if(boxjsDataGetAsyncMock[name]){
                    return boxjsDataGetAsyncMock[name];
                }
                else {
                    // TODO how?
                    return;
                }
            },
            set() {}
        },
        cover: {
            insert(options) {
                let name = options.name;
                if (boxjsCoverInsertMock[name]) {
                    return Promise.resolve(boxjsCoverInsertMock[name].res);
                } else {
                    return Promise.reject();
                }
            },
            update(options) {
                let name = options.name;
                if (boxjsCoverUpdateMock[name]) {
                    return Promise.resolve(boxjsCoverUpdateMock[name].res);
                } else {
                    return Promise.reject();
                }
            },
            remove(options) {
                let name = options.name;
                if (boxjsCoverRemoveMock[name]) {
                    return Promise.resolve(boxjsCoverRemoveMock[name].res);
                } else {
                    return Promise.reject();
                }
            }
        },
        canvas: {
            insert(options) {
                return Promise.resolve();
            },
            update(options) {
                return Promise.resolve();
            },
            remove(options) {
                return Promise.resolve();
            }
        },
        media: {
            video() {
                return Promise.resolve();
            },
            live()  {
                return Promise.resolve();
            },
            camera() {
                return Promise.resolve();
            },
            arCamera() {
                return Promise.resolve();
            }
        },
        map: {
            operate () {
                return Promise.resolve();
            }
        },
        platform: {
            boxVersion() {
                return '10.9.0';
            },
            versionCompare() {
                return 1;
            },
            isIOS() {
                return true;
            },
            isAndroid() {
                return false;
            },
            isBox() {
                return true;
            },
            osVersion() {
                return '9.0'
            }
        },
        webView: {
            insert(options) {
                return Promise.resolve();
            },
            update(options) {
                return Promise.resolve();
            },
            remove(options) {
                return Promise.resolve();
            }
        },
        ui: {
            open(options) {
                let name = options.name;
                if (boxjsUiMock[name]) {
                    let res = boxjsUiMock[name].res;
                    //eval(options.data.cb + "(res)");
                    return Promise.resolve(res);
                } else {
                    return Promise.reject();
                }
            },
            update(options) {
                return Promise.resolve();
            },
            close(options) {
                return Promise.resolve();
            }
        },
        device: {
            networkType(){
                if (boxjsDeviceMock['networkType']) {
                    return Promise.resolve(boxjsDeviceMock['networkType'].res.data);
                } else {
                    return Promise.reject();
                }
            },
            systemInfo(){
               if (boxjsDeviceMock['systemInfo']) {
                    return Promise.resolve(boxjsDeviceMock['systemInfo'].res.data);
                } else {
                    return Promise.reject();
                }
            },
            vibrateShort(){
                return Promise.resolve();
            }
        }
    },
    swan: {
        getUserInfo(params) {
            return Promise.resolve(params.success && params.success({
                data: 'xxx',
                iv: 'yyy',
                userInfo: {}
            }));
        },
        getPhoneNumber(params) {
            return Promise.resolve(params.success && params.success());
        },
        getLocation() {
            return Promise.resolve();
        },
        request() {
            return Promise.resolve();
        },
        authorize(params) {
            if (params.success && typeof params.success === 'function') {
                params.success();
            }
            return Promise.resolve();
        },
        getSystemInfoSync() {
            return {
                "batteryLevel": -1,
                "version": "10.13.0.0",
                "system": "iOS 11.4",
                "brand": "iPhone",
                "windowHeight": 690,
                "devicePixelRatio": 3,
                "pixelRatio": 3,
                "platform": "ios",
                "SDKVersion": "1.13.4",
                "statusBarHeight": 44,
                "language": "zh_CN",
                "screenHeight": 812,
                "windowWidth": 375,
                "model": "iPhone Simulator <x86-64>",
                "screenWidth": 375,
                "fontSizeSetting": 2
            };
        }
    },
    invoke() {},
    bind() {}
});
