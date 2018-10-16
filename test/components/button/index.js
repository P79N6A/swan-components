/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

import sinon from 'sinon';
import button from '../../../src/button/index';
import buildComponent from '../../mock/swan-core/build-component';
import attach2Document from '../../utils/attach-to-document';
import Communicator from '../../mock/communicator';
const COMPONENT_NAME = 'button';

describe('component [' + COMPONENT_NAME + ']', () => {
    let component = null;
    let $component = null;
    beforeEach(() => {
        component = buildComponent(COMPONENT_NAME, button);
        $component = attach2Document(component);
    });
    afterEach(() => {
        component.dispose();
    });

    it('should be render while attach', () => {
        let $swanButton = $component.querySelector('swan-button');
        expect($swanButton).not.toBe(null);
    });

    it('should has one default slot', () => {
        expect(component.slot.length).toBe(1);
    });

    it('should be getuserinfo while set attribute openType: getUserInfo', done => {
        let component = buildComponent(COMPONENT_NAME, button);
        attach2Document(component);
        component.data.set('openType', 'getUserInfo');
        let swan = component.swan;
        let spy = sinon.spy(swan, 'authorize');
        component.nextTick(() => {
            component.fire('bindtap', {});
            expect(spy.callCount).toBe(1);
            spy.restore();
            component.dispose();
            done();
        });
    });
    it('should be getPhoneNumber while set attribute openType: getPhoneNumber', done => {
        component.data.set('openType', 'getPhoneNumber');
        let spy = sinon.spy(component.boxjs.data, 'get');
        component.nextTick(() => {
            component.fire('bindtap', {});
            expect(spy.calledWith(sinon.match.has('name', 'swan-phoneNumber'))).toBe(true);
            spy.restore();
            done();
        });
    });

    it('should be getOpenSetting while set attribute openType: openSetting', done => {
        component.data.set('openType', 'openSetting');
        let spy = sinon.spy(component.boxjs.ui, 'open');
        component.nextTick(() => {
            component.fire('bindtap', {});
            expect(spy.calledWith(sinon.match.has('name', 'swan-setting'))).toBe(true);
            spy.restore();
            done();
        });
    });
    it('should be share while set attribute openType', done => {
        component.data.set('openType', 'share');
        const spy = sinon.spy(component, 'dispatch');
        component.nextTick(() => {
            component.fire('bindtap', {});
            expect(spy.calledWith(
                'abilityMessage',
                sinon.match
                    .has('eventType', 'share')
                )).toBe(true);
            spy.restore();
            done();
        });
    });
    it('should not call dispatch while set attribute disabled', done => {
        const spy = sinon.spy(component, 'dispatch');
        component.data.set('disabled', true);
        component.nextTick(() => {
            expect(spy.callCount).toBe(0);
            done();
        });
    });
    it('should listen LabelFirstTapped message from communicator', () => {
        component.data.set('openType', 'getUserInfo');
        const spy = sinon.spy(component.swan, 'authorize');

        Communicator.getInstance().fireMessage({
            type: 'LabelFirstTapped',
            data: {
                target: component.uid
            }
        });

        expect(spy.callCount).toBe(1);
        spy.restore();
    });
    it('should listen LabelTapped message from communicator', () => {
        component.data.set('openType', 'getUserInfo');
        const spy = sinon.spy(component.swan, 'authorize');

        Communicator.getInstance().fireMessage({
            type: 'LabelTapped',
            data: {
                target: component.uid
            }
        });

        expect(spy.callCount).toBe(1);
        spy.restore();
    });
});

describe('check touch events', () => {
    let component = buildComponent(COMPONENT_NAME, button);
    let $component = attach2Document(component);
    let $swanButton = $component.querySelector('swan-button');


    function createTouchEvent(type, touchInits, target) {
        const event = new TouchEvent(
            type,
            {
                changedTouches: [
                    new Touch({
                        identifier: 10001,
                        target: target,
                        ...touchInits
                    }),
                    new Touch({
                        identifier: 10002,
                        target: target,
                        ...touchInits
                    })
                ],
                targetTouches: [
                    new Touch({
                        identifier: 10001,
                        target: target,
                        ...touchInits
                    })
                ],
                bubbles: true
            }
        );
        return event;
    }
});
