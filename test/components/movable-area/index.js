/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file movable-area组件单测
 * @author v_wushuangzhao@baidu.com
 */

import sinon from 'sinon';
import movableArea from '../../../src/movable-area/index';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';

const COMPONENT_NAME = 'movable-area';

describe('component' + '[' + COMPONENT_NAME + ']', () => {
    describe('base feature', () => {

        /*
        const  component = buildComponent(COMPONENT_NAME,movableArea);
        const  $component = attach2Document(component);
        componentBaseFieldCheck(COMPONENT_NAME,component);
        const $movableArea = $component.querySelector('movable-area');

        it('should be rendered after attached', () => {
            expect($movableArea).not.toBe(null);
        });

        it('should have zero slot', () => {
            expect($component.slot.length).toBe(0);
        });

        it('default props', ()=> {
            expect(component.data.get('scaleArea')).toBe(false);
            expect(window.getComputedStyle($movableArea, 'width').width).toEqual('10px');
            expect(window.getComputedStyle($movableArea, 'height').height).toEqual('10px');
        });*/

        describe('check touch events', () => {
            let component = null;
            let $component = null;
            let movableAreaElement = null;
            beforeEach(() => {
                component = buildComponent(COMPONENT_NAME, movableArea);
                $component = attach2Document(component);
                movableAreaElement = $component.querySelector('swan-movable-area');
            });
            afterEach(() => component.dispose());
            function createTouchEvent(type,touchInits, target) {
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
                            }),
                        ],
                        bubbles: true
                    }
                );
                return event;
            }

            it('preventEvents should be executed on touchstart', done => {
                const pageX = 6;
                const screenX = 10;
                component.data.set('scaleArea', true);
                const touchStartEvent = createTouchEvent(
                    'touchstart',
                    {
                        clientX: pageX,
                        pageX: pageX,
                        screenX: screenX

                    },
                    movableAreaElement
                );
                const stub = sinon.stub(component, 'preventEvents');
                movableAreaElement.dispatchEvent(touchStartEvent);
                component.nextTick(() => {
                    expect(stub.calledOnce).toBe(true);
                    stub.restore();
                    done();
                });
            });
            it('communicatorView should  be executed on touchMove', done => {
                const data = component.data;
                data.set('scaleArea', true);
                const pageX = movableAreaElement.offsetLeft;
                const wrapperWidth = movableAreaElement.clientWidth;
                const stepDistance = wrapperWidth / 2;
                const movePageX = pageX + stepDistance * 2;
                const touchStartEvent = createTouchEvent(
                    'touchstart',
                    {
                        clientX: 6,
                        pageX: 6,
                        screenX: 10
                    },
                    movableAreaElement
                );
                const touchMoveEvent = createTouchEvent(
                    'touchmove',
                    {
                        clientX: movePageX,
                        pageX: movePageX
                    },
                    movableAreaElement
                );
                const spy = sinon.spy(component, 'communicatorView');
                movableAreaElement.dispatchEvent(touchStartEvent);
                movableAreaElement.dispatchEvent(touchMoveEvent);
                component.nextTick(() => {
                    expect(spy.calledOnce).toBe(false);
                    spy.restore();
                    done();
                });
            });
        });
    });
});




