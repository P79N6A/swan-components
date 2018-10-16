/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

import { rejects } from "assert";

export const boxjsDataGetMock = {
    'swan-slaveIdSync': { slaveId: '1' },
};
export const boxjsDataGetAsyncMock = {
    'swan-privateGetUserInfo': Promise.resolve({}),
    'swan-appInfoSync': Promise.resolve({}),
    'swan-regionData': Promise.resolve({content: [
        {
            code: 1,
            name: 'A',
            children: [
                {
                    code: 11,
                    name: 'a',
                    children: [
                        {
                            code: 111,
                            name: 'aa'
                        }
                    ]
                },
                {
                    code: 12,
                    name: 'b',
                    children: [
                        {
                            code: 121,
                            name: 'bb'
                        }
                    ]
                }
            ]
        }
    ]}),
    'swan-localImgData': Promise.resolve({}),
    'swan-formId': Promise.resolve({})
}
export const boxjsDataGetCallbackMock = {
    'swan-privateGetUserInfo': {
        status: 0,
        message:'调起成功',
        data:{
            "displayname":"测试用户",
            "portrait" : "https://xxxx.png",
            "gender" : "1"
        }
    },
    'swan-phoneNumber': {
        status: 0,
        message: '调起成功',
        data: {
            errno: 0,
            data: 'xxx',
            iv: 'yyy'
        }
    },
    'swan-formId': {
        status: 2000,
        message: '',
        data: {
            data: {
                formId: 111
            }
        }
    },
    'swan-setting': {
        status: 0,
        message: '',
        data: {
            mapp_camera: '1'
        }
    }
}
export const boxjsCoverInsertMock = {
    'swan-coverimage': {
        res: { status: 0, message: '调起成功' },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-animView': {
        res: {
            style: '',
            viewId: 0,
            position: {
                left: 0,
                top: 0
            }
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-coverview': {
        res: { status: 0, message: '调起成功' },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    }
};

export const boxjsCoverUpdateMock = {
    'swan-animView': {
        res: {
            style: '',
            viewId: 0,
            position: {
                left: 0,
                top: 0
            }
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-coverview': {
        res: { status: 0, message: '调起成功' },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-coverimage': {
        res: { status: 0, message: '调起成功' },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    }
};

export const boxjsCoverRemoveMock = {
    'swan-animView': {
        res: { status: 0, message: '调起成功' },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-coverview': {
        res: { status: 0, message: '调起成功' },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-coverimage': {
        res: { status: 0, message: '调起成功' },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    }
};
/*
export const boxjsSwanInputMock = {
    'swan-input': {
        res: {
            status: 0,
            message: '调起成功',
            data: encodeURIComponent(JSON.stringify({ eventName: 'change', value: '123' }))
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    }
};
export const boxjsSwanPickerMock = {
    'swan-datePickerView': {
        res: {
            status: 0,
            message: '调起成功',
            value:'1'
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'utils-picker': {
        res: {
            status: 0,
            message: '调起成功',
            value:'1'
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    }
};
*/
export const boxjsUiMock = {
    'swan-input': {
        res: {
            status: 0,
            message: '调起成功',
            data: encodeURIComponent(JSON.stringify({ eventName: 'change', value: '123' }))
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-datePickerView': {
        res: {
            status: 0,
            message: '调起成功',
            value:'1'
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-regionData': {
        res: {
            status: 0,
            message: '调起成功',
            value:'1'
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'utils-multiPicker': {
        res: {
            status: 0,
            message: '调起成功',
            value:'1'
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'utils-picker': {
        res: {
            status: 0,
            message: '调起成功',
            value:'1'
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'swan-textarea': {
        res: {
            status: 0,
            message: '调起成功',
            value:'1'
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    }
}
export const boxjsDeviceMock = {
    'networkType': {
        res: {
            status: 0,
            message: '调起成功',
            data: {
                networkType: 'wifi'
            }
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    },
    'systemInfo': {
        res: {
            status: 0,
            message: '调起成功',
            data: {
                brand:'',
                model:'',
                pixelRatio:'',
                screenWidth:'',
                screenHeight:'',
                windowWidth:'',
                windowHeight:'',
                language:'',
                version:'',
                system:'',
                fontSizeSetting:'',
                platform:''
            }
        },
        rej: { status: 202, message: '解析失败，请检查参数是否正确' }
    }
};