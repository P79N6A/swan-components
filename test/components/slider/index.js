/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file slider组件单测
 * @author yanghuabei@baidu.com
 */

import Slider from '../../../src/slider';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';
import {createSingleTouchEvent} from '../../utils/touch';

const COMPONENT_NAME = 'slider';

/* eslint-disable max-nested-callbacks */
describe(`component [${COMPONENT_NAME}]`, () => {
    describe('base feature', () => {
        const component = buildComponent(COMPONENT_NAME, Slider);
        const $component = attach2Document(component);
        componentBaseFieldCheck(COMPONENT_NAME, component);
        it('should be rendered after attach', () => {
            const $swanSlider = $component.querySelector('swan-slider');
            expect($swanSlider).not.toBe(null);
        });

        describe('default props', () => {
            const defaults = [
                ['min', 0],
                ['max', 100],
                ['step', 1],
                ['disabled', false],
                ['value', 0],
                ['backgroundColor', ['#ccc', '#CCC', '#cccccc', '#CCCCCC'], 'includes'],
                ['blockSize', '24'],
                ['blockColor', ['#fff', '#ffffff', '#FFF', '#FFFFFF'], 'includes'],
                ['activeColor', ['#3c76ff', '#3C76FF'], 'includes'],
                ['showValue', false],
                ['bindchange', undefined],
                ['bindchanging', undefined]
            ];

            defaults.forEach(
                ([name, expected, checkType]) => {
                    const message = checkType === 'includes'
                        ? `${name} default value should be one of ${expected.join()}`
                        : `${name} default value should be ${expected}`;

                    it(message, () => {
                        const data = component.data;
                        const actual = data.get(name);
                        if (checkType === 'includes') {
                            expect(expected.includes(actual)).toBe(true);
                        }
                        else {
                            expect(actual).toBe(expected);
                        }
                    });
                }
            );
        });

        describe('check touch events', () => {
            let component = null;
            let $component = null;
            let sliderElement = null;
            let targetElement = null;
            beforeEach(() => {
                component = buildComponent(COMPONENT_NAME, Slider);
                $component = attach2Document(component);
                sliderElement = $component.querySelector('.swan-slider-handle');
                targetElement = $component.querySelector('.swan-slider-tap-area');
            });

            afterEach(() => component.dispose());

            it('should set startPageX on touchstart', done => {
                const pageX = sliderElement.getBoundingClientRect().left + 5;
                createSingleTouchEvent(sliderElement, [{x: pageX, y: 0}]).then(() => {
                    const actual = component.startPageX;
                    const expected = pageX;
                    expect(actual).toBe(expected);
                    done();
                });
            });

            it('should fire changing event on touchmove, fire change on touchend with right args', done => {
                const data = component.data;
                const pageX = targetElement.offsetLeft;
                const pageY = targetElement.offsetTop;

                const wrapperWidth = targetElement.clientWidth;
                const stepDistance = wrapperWidth / data.get('max');
                const movePageX = pageX + stepDistance * 2;


                createSingleTouchEvent(sliderElement, [{x: pageX, y: pageY}, {x: movePageX, y: pageY}]).then(() => {
                    expect(data.get('value')).toBe(2);
                    done();
                }).catch(() => {
                    done();
                });
            });
        });

        describe('verify set props', () => {
            it('blockSize width should not be small than 12px', () => {
                const component = buildComponent(
                    COMPONENT_NAME,
                    Slider,
                    {
                        data: {
                            blockSize: 5
                        }
                    }
                );
                const $component = attach2Document(component);
                const slider = $component.querySelector('.swan-slider-thumb');
                const actual = slider.style.width;
                const expected = '12px';
                expect(actual).toBe(expected);
                component.dispose();
            });

            it('blockSize width should not be larger than 28px', () => {
                const component = buildComponent(
                    COMPONENT_NAME,
                    Slider,
                    {
                        data: {
                            blockSize: 29
                        }
                    }
                );
                const $component = attach2Document(component);
                const slider = $component.querySelector('.swan-slider-thumb');
                const actual = slider.style.width;
                const expected = '28px';
                expect(actual).toBe(expected);
                component.dispose();
            });
        });
    });
});
