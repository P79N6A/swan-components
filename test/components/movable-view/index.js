/**
 * @file movable-view组件单测
 * @author v_wushuangzhao@baidu.com
 */

import sinon from 'sinon';
import movableView from '../../../src/movable-view/index';
import movableArea from '../../../src/movable-area/index';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';
import {createSingleTouchEvent, createZoomEvent} from '../../utils/touch';
import {getComponentClass, getFactory} from '../../mock/swan-core/build-component';
import {privateKey} from '../../../src/utils';

const COMPONENT_NAME = 'movable-view';

describe('component[' + COMPONENT_NAME + ']', () => {
    describe('base feature', () => {
        const component = buildComponent(COMPONENT_NAME, movableView);
        const $component = attach2Document(component);
        componentBaseFieldCheck(COMPONENT_NAME, component);
        const $movableView = $component.querySelector('swan-movable-view');

        describe('check touch events', () => {
            let component = null;
            let $component = null;
            let movableViewElement = null;
            beforeEach(() => {
                component = buildComponent(COMPONENT_NAME, movableView);
                $component = attach2Document(component);
                movableViewElement = $component.querySelector('swan-movable-view');
            });

            afterEach(() => component.dispose());

            it('one finger translate', done => {
                const component2 = buildComponent(`${COMPONENT_NAME}2`,movableView);
                const $component = attach2Document(component2);
                const movableViewElement = $component.querySelector('swan-movable-view');
                const pageX = movableViewElement.getBoundingClientRect().left + 15;
                component2.data.set('direction', 'all');
                component2.data.set('inertia', true);
                const currentX = component2.data.get(`${privateKey}.x`);
                createSingleTouchEvent(movableViewElement, [{x: movableViewElement.getBoundingClientRect().left, y: 0}, {x: pageX, y: 0}]).then(() => {
                    expect(component2.data.get(`${privateKey}.x`) !== currentX).toBe(true);
                    done();
                });
            });

            it('two finger scale', done => {
                const component3 = buildComponent(`${COMPONENT_NAME}3`,movableView);
                const $component3 = attach2Document(component3);
                const movableViewElement = $component3.querySelector('swan-movable-view');
                const pageX = movableViewElement.getBoundingClientRect().left + 15;
                const currentScaleValue = component3.data.get(`${privateKey}.scaleValue`);
                component3.data.set('scale', true);
                component3.areaPosition.height = 100;
                createZoomEvent(movableViewElement, [
                    [{x: 0, y: 0, keyFrames: '0%'}, {x: 10, y: 15, keyFrames: '90%'}],
                    [{x: 100, y: 100, keyFrames: '0%'}, {x: 500, y: 500, keyFrames: '100%'}]
                ]).then(() => {
                    expect(component3.data.get(`${privateKey}.scaleValue`) !== currentScaleValue).toBe(true);
                });
                done();
            });
        });

        describe('props watch', () =>{
            it('x change should be watched', done => {
                const component5 = buildComponent(`${COMPONENT_NAME}5`, movableView);
                const $component5 = attach2Document(component5);
                $component5.style.height = '500px';
                component5.data.set('x', 200);
                component5.nextTick(() =>{
                    expect(component5.data.get(`${privateKey}.x`)).toBe(200);
                    done();
                });
            });
            it('scaleValue change should be watched', done => {
                const component5 = buildComponent(`${COMPONENT_NAME}5`, movableView);
                const $component5 = attach2Document(component5);
                component5.data.set('scaleValue', 2);
                component5.nextTick(() =>{
                    expect(component5.data.get(`${privateKey}.scaleValue`)).toBe(2);
                    done();
                });
            });
        });
    });
});
