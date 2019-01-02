import { rejects } from "assert";

export const boxjsDataGetMock = {
    'swan-slaveIdSync': { slaveId: '1' },
    'swan-appInfoSync': {appId: 'appId'},
};
export const boxjsDataGetAsyncMock = {
    'swan-privateGetUserInfo': Promise.resolve({}),
    'swan-privateGetUserInfo-unLogined': Promise.resolve({}),
    'swan-appInfoSync': Promise.resolve({}),
    'swan-regionData': Promise.resolve({content: [
        {
            code: '11',
            name: '北京市',
            children: [
                {
                    code: '1101',
                    name: '市辖区',
                    children: [
                        {
                            code: '110101',
                            name: '东城区'
                        },
                        {
                            name: "西城区",
                            code: "110102"
                        }
                    ]
                }
            ]
        },
        {
            code: '12',
            name: '天津市',
            children: [
                {
                    code: '1201',
                    name: '市辖区',
                    children: [
                        {
                            code: '120101',
                            name: '和平区'
                        },
                        {
                            name: "河东区",
                            code: "120102"
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
        message: '调起成功',
        data: {
            displayname: '测试用户',
            portrait: 'https://xxxx.png',
            gender: '1'
        }
    },
    'swan-privateGetUserInfo-unLogined': {
        status: 1,
        message: '调起成功',
        data: {}
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
    },
    'swan-setting': {
        res: {
            status: 0,
            message: '',
            data: {
                mapp_camera: '1'
            }
        },
        rej: {status: 202, message: '解析失败，请检查参数是否正确'}
    },
    'swan-IM': {
        res: {
            status: 0,
            message: '',
            data: {
            }
        },
        rej: {status: 202, message: '解析失败，请检查参数是否正确'}
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