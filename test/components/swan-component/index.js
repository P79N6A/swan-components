/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file swan-component组件单测
 * @author yanghuabei@baidu.com
 */

import sinon from 'sinon';
import swanComponentProto from '../../../src/swan-component';
import {getComponentClass} from '../../mock/swan-core/build-component';
import {boxjsDataGetMock} from '../../mock/swan-api/mock-data';
import attach2Document from '../../utils/attach-to-document';
import Communicator from '../../mock/communicator';

const COMPONENT_NAME = 'swan-component';

/* eslint-disable max-nested-callbacks */
describe(`base component [${COMPONENT_NAME}]`, () => {

    it('should be an Object', () => {
        const actual = typeof swanComponentProto;
        const expected = 'object';
        expect(actual).toBe(expected);
    });

    describe('swan component proto public methods exist check', () => {
        const functions = [
            'constructor', 'bindAction', 'onTouchEnd',
            'onTouchcancel', 'onTouchStart', 'onTouchMove',
            'onContextmenu', 'slaveUpdated', 'slaveRendered',
            'getFirstParentComponentId'
        ];
        functions.forEach(name => {
            it(`should has a ${name} function`, () => {
                const actual = typeof swanComponentProto[name];
                const expected = 'function';
                expect(actual).toBe(expected);
            });
        });
    });

    describe('swan component instance check', () => {
        const SwanComponent = getComponentClass('test-component', {template: '<swan-component></swan-component>'});
        let component = null;

        beforeAll(() => {
            component = new SwanComponent();
            attach2Document(component);
        });

        afterAll(() => {
            component.dispose();
        });

        it('should has instance property slaveId', () => {
            const actual = component.slaveId;
            const expected = boxjsDataGetMock['swan-slaveIdSync'].slaveId;
            expect(actual).toBe(expected);
        });

        it('should has instance function property absolutePathResolve', () => {
            const actual = typeof component.absolutePathResolve;
            const expected = 'function';
            expect(actual).toBe(expected);
        });

        it('should has an not null instance property uid', () => {
            const actual = component.uid;
            expect(actual).toBeDefined();
        });

        it('should has a ref named sanComponent to self on el', () => {
            const actual = component.el.sanComponent;
            const expected = component;
            expect(actual).toBe(expected);
        });

        it('should has not hidden attibute on el', () => {
            const actual = component.el.hidden;
            const expected = false;
            expect(actual).toBe(expected);
        });

        describe('bindAction method', () => {
            it('should call on method with right args when called', () => {
                const on = sinon.spy(component, 'on');
                const callback = new Function();
                component.bindAction('test', callback);
                const actual = on.calledWith('test', callback);
                const expected = true;
                expect(actual).toBe(expected);
                on.restore();
            });
        });

        describe('getFirstParentComponentId method', () => {
            it('should return empty string on baidu app version less than 10.8.5', () => {
                const versionCompare = sinon.stub(component.boxjs.platform, 'versionCompare');
                versionCompare.returns(-1);
                const actual = component.getFirstParentComponentId(component);
                const expected = '';
                expect(actual).toBe(expected);
                versionCompare.restore();
            });


            it('should return empty string when self is topest element', () => {
                const actual = component.getFirstParentComponentId(component);
                const expected = '';
                expect(actual).toBe(expected);
            });

            it('should return parentComponent getFirstParentComponentId when parent is other component', () => {
                const originParentComponent = component.parentComponent;
                component.parentComponent = {
                    el: {
                        tagName: 'swan-view'
                    }
                };
                const actual = component.getFirstParentComponentId(component);
                const expected = '';
                expect(actual).toBe(expected);
                component.parentComponent = originParentComponent;
            });
        });

        describe('data watch', () => {
            let component = null;

            beforeEach(() => {
                component = new SwanComponent();
                attach2Document(component);
            });

            afterEach(() => {
                component.dispose();
            });

            it('should watch hidden data change and update el attribute', done => {
                component.data.set('hidden', true);
                component.nextTick(() => {
                    const actual = component.el.hidden;
                    const expected = true;
                    expect(actual).toBe(expected);
                    done();
                });
            });
        });

        describe('life circle event bind', () => {
            let component = null;
            beforeEach(() => {
                component = new SwanComponent();
                attach2Document(component);
            });

            it('should listen slaveUpdated event and call slaveUpdated hook properly', () => {
                const slaveUpdated = sinon.stub(component, 'slaveUpdated');
                expect(slaveUpdated.notCalled).toBe(true);
                Communicator.getInstance().fireMessage({type: 'slaveUpdated'});
                expect(slaveUpdated.calledOnce).toBe(true);

                component.dispose();
                Communicator.getInstance().fireMessage({type: 'slaveUpdated'});
                expect(slaveUpdated.calledOnce).toBe(true);
                slaveUpdated.restore();
            });

            it('should listen slaveRendered event and call slaveRendered hook properly', () => {
                const slaveRendered = sinon.stub(component, 'slaveRendered');
                expect(slaveRendered.notCalled).toBe(true);
                Communicator.getInstance().fireMessage({type: 'slaveRendered'});
                expect(slaveRendered.calledOnce).toBe(true);

                component.dispose();
                Communicator.getInstance().fireMessage({type: 'slaveRendered'});
                expect(slaveRendered.calledOnce).toBe(true);
                slaveRendered.restore();
            });
        });
    });
});
