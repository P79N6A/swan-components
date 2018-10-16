/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

import pickerViewColumn from '../../../src/picker-view-column/index';
import pickerView from '../../../src/picker-view/index';
import buildComponent from '../../mock/swan-core/build-component';
import attach2Document from '../../utils/attach-to-document';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import {getComponentClass, getFactory} from '../../mock/swan-core/build-component';
import {createSingleTouchEvent} from '../../utils/touch';
import sinon from 'sinon';
const COMPONENT_NAME = 'picker-view-column';

describe('component [' + COMPONENT_NAME + '] Should be rendered', () => {
    const factory = getFactory();
    factory.componentDefine(
        'swan-picker-test2',
        {
            template: `
            <div>
                <picker-view value='{{[0]}}' s-ref="pickerView" style="width: 100%; height: 300px;" indicator-style="height: 50px;">
                    <picker-view-column s-ref="column">
                        <view style="height:50px;line-height:50px;">1年</view>
                        <view style="height:50px;line-height:50px;">2年</view>
                        <view style="height:50px;line-height:50px;">3年</view>
                        <view style="height:50px;line-height:50px;">4年</view>
                        <view style="height:50px;line-height:50px;">5年</view>
                        <view style="height:50px;line-height:50px;">6年</view>
                    </picker-view-column>
                </picker-view>
            </div>
            `
        },
        {
            classProperties: {
                components: {
                    'picker-view': getComponentClass('picker-view', pickerView),
                    'picker-view-column': getComponentClass(COMPONENT_NAME, pickerViewColumn)
                }
            }
        }
    );
    const swanPickerView = factory.getComponents('swan-picker-test2');
    const $swanPickerView = new swanPickerView();
    attach2Document($swanPickerView);
    const columnRef = $swanPickerView.ref('column');
    columnRef.communicator.fireMessage({
        type: 'slaveRendered'
    });
    it('touch event should exec', done => {
        createSingleTouchEvent(columnRef.el.querySelector('.swan-picker__content'),
            [{x: 0, y: 0}, {x: 0, y: -150}]).then(() => {
            setTimeout(() => {
                expect(columnRef.el.curIndex >= 3).toBe(true);
                done();
            }, 1000)
        });
    });
});
