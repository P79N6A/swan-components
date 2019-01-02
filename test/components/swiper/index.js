import swiper from '../../../src/swiper/index';
import swiperItem from '../../../src/swiper-item/index';
import buildComponent from '../../mock/swan-core/build-component';
import attach2Document from '../../utils/attach-to-document';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import {swiperBindChangeEventCallbackFieldCheck} from "../../utils/event-callback-field-check";
import {getComponentClass,getFactory} from '../../mock/swan-core/build-component';
import sinon from 'sinon';
import {createSingleTouchEvent} from '../../utils/touch';
const COMPONENT_NAME = 'swiper';

describe('component [' + COMPONENT_NAME + ']', () => {
    const component = buildComponent(COMPONENT_NAME,swiper);
    const $component = attach2Document(component);
    componentBaseFieldCheck(COMPONENT_NAME, component);
    const $swiper = $component.querySelector('swan-swiper');
    describe('base feature' , () =>{
        
        it('should be rendered after attach', () =>{
            expect($component).not.toBe(null);
            expect($swiper).not.toBe(null);
        })

    })

    describe('default props', () =>{
        const defaults = [
            ['indicatorDots', false],
            ['indicatorColor', 'rgba(0, 0, 0, .3)'],
            ['indicatorActiveColor', '#000000'],
            ['autoplay', false],
            ['currentItemId', ''],
            ['interval', 5000],
            ['duration', 500],
            ['circular', false],
            ['vertical', false],
            ['bindchange', undefined]
        ];

        defaults.forEach( 
            ([name,expected]) => {
                it(`${name} default value should be ${expected}`, () => {
                    const data = component.data;
                    const actual = data.get(name);
                    expect(actual).toBe(expected);
                });
            }
        );
        it(`current default value should be NaN`, () => {
            expect(component.data.get('current')).not.toBe(component.data.get('current'));
        });
    });

    describe('margin props', () => {
        it('should set margin of swan-swiper-sliders', done => {
            const component = buildComponent(COMPONENT_NAME, swiper, {
                data: {
                    "previousMargin": "20px",
                    "nextMargin": "30px"
                }
            });
            const $component = attach2Document(component);
            const $slider = $component.querySelector('.swan-swiper-slides');
            component.nextTick(() => {
                expect(getComputedStyle($slider).left).toBe('20px');
                expect(getComputedStyle($slider).right).toBe('30px');
                component.dispose();
                done();
            });
        })
    });

    describe('current props', () => {
        it('should set current to init index', done => {
            const factory = getFactory();
            factory.componentDefine(
                'swiper-test1',
                {
                    template: `
                    <view>
                    <swiper current="1" s-ref="swiper">
                        <swiper-item></swiper-item>
                        <swiper-item></swiper-item>
                        <swiper-item></swiper-item>
                    </swiper>    
                    </view>`
                },
                {
                    classProperties: {
                        components: {
                            'swiper': getComponentClass(COMPONENT_NAME, swiper),
                            'swiper-item': getComponentClass('swiper-item', swiperItem)
                        }
                    }
                }
            );
            const TestView = factory.getComponents('swiper-test1');
            const testview = new TestView();
            attach2Document(testview);
            const swiperComponent = testview.ref('swiper');
            swiperComponent.communicator.fireMessage({
                type: 'slaveRendered'
            });
            swiperComponent.nextTick(() => {
                expect(swiperComponent.index).toBe(1);
                testview.dispose();
                done();
            });
        });
        it('should set init index by current-item-id', done => {
            const factory = getFactory();
            factory.componentDefine(
                'swiper-test2',
                {
                    template: `
                    <view>
                    <swiper current-item-id="c" s-ref="swiper">
                        <swiper-item item-id="a"></swiper-item>
                        <swiper-item item-id="b"></swiper-item>
                        <swiper-item item-id="c"></swiper-item>
                    </swiper>    
                    </view>`
                },
                {
                    classProperties: {
                        components: {
                            'swiper': getComponentClass(COMPONENT_NAME, swiper),
                            'swiper-item': getComponentClass('swiper-item', swiperItem)
                        }
                    }
                }
            );
            const TestView = factory.getComponents('swiper-test2');
            const testview = new TestView();
            attach2Document(testview);
            const swiperComponent = testview.ref('swiper');
            swiperComponent.communicator.fireMessage({
                type: 'slaveRendered'
            });
            swiperComponent.nextTick(() => {
                expect(swiperComponent.index).toBe(2);
                testview.dispose();
                done();
            });
        });
    });

    describe('indicatorDots props', () => {
        const factory = getFactory();
        factory.componentDefine(
            'swiper-test3',
            {
                template: `
                <view>
                    <swiper indicator-dots="true"
                        indicator-color="rgba(0, 0, 0, 0.5)"
                        indicator-active-color="#ffffff"
                        s-ref="swiper"
                    >
                        <swiper-item></swiper-item>
                        <swiper-item></swiper-item>
                        <swiper-item></swiper-item>
                    </swiper>    
                </view>`
            },
            {
                classProperties: {
                    components: {
                        'swiper': getComponentClass(COMPONENT_NAME, swiper),
                        'swiper-item': getComponentClass('swiper-item', swiperItem)
                    }
                }
            }
        );
        const TestView = factory.getComponents('swiper-test3');
        const testview = new TestView();
        const $testview = attach2Document(testview);
        const swiperComponent = testview.ref('swiper');
        swiperComponent.communicator.fireMessage({
            type: 'slaveRendered'
        });
        const $indicatorDots = swiperComponent.el.querySelector("swan-swiper>.swan-swiper-dots");
        afterAll(() => {
            testview.dispose();
        })
        it('should render indicator while indicator-dots is true', done => {
            swiperComponent.nextTick(() => {
                expect($indicatorDots).not.toBe(null);
                done();
            })
        });
        it('should set indicator color to custom variable', done => {
            swiperComponent.nextTick(() => {
                expect($indicatorDots.children[1].style.backgroundColor).toBe('rgba(0, 0, 0, 0.5)');
                done();
            })
        });
        it('should render indicator while indicator-dots is true', done => {
            swiperComponent.nextTick(() => {
                expect($indicatorDots.children[0].style.backgroundColor).toBe('rgb(255, 255, 255)');
                done();
            })
        });
    });

    describe('props watch', () =>{
        const factory = getFactory();
        factory.componentDefine(
            'swiper-test4',
            {
                template: `
                <view>
                    <swiper s-ref="swiper">
                        <swiper-item item-id="aaa"></swiper-item>
                        <swiper-item></swiper-item>
                        <swiper-item></swiper-item>
                    </swiper>    
                </view>`
            },
            {
                classProperties: {
                    components: {
                        'swiper': getComponentClass(COMPONENT_NAME, swiper),
                        'swiper-item': getComponentClass('swiper-item', swiperItem)
                    }
                }
            }
        );
        const TestView = factory.getComponents('swiper-test4');
        const testview = new TestView();
        attach2Document(testview);
        const swiperComponent = testview.ref('swiper');
        swiperComponent.communicator.fireMessage({
            type: 'slaveRendered'
        });
        afterAll(() => {
            testview.dispose();
        })
        it('autoPlay & interval change should be watched', done =>{
            const swiperSpy = sinon.spy(swiperComponent, 'autoPlayOn');
            swiperComponent.data.set('autoplay',true);
            swiperComponent.nextTick(() =>{
                expect(swiperSpy.callCount).toBe(1);
                swiperComponent.data.set('interval', 1000);
                swiperComponent.nextTick(() => {
                    expect(swiperSpy.callCount).toBe(2);
                    swiperSpy.restore();
                    done();
                })
            })
        });
        it('current chage should be watched', done => {
            swiperComponent.data.set('current', 1);
            swiperComponent.nextTick( () =>{
                expect(swiperComponent.index).toBe(1);
                swiperComponent.data.set('currentItemId', 'aaa');
                expect(swiperComponent.index).toBe(0);
                done();
            })
        });

        it ('should trigger bindchange while current change', done => {
            swiperComponent.on('bindchange', e => {
                swiperBindChangeEventCallbackFieldCheck(expect, done, e)
            });
            swiperComponent.data.set('current',2);
        });
    })
    
    describe('touch events', () => {
        const factory = getFactory();
        factory.componentDefine(
            'swiper-test5',
            {
                template: `
                <div style="position:relative;width:100px;height:100px;background-corlor:red;">
                    <swiper circular="true" s-ref="swiper">
                        <swiper-item></swiper-item>
                        <swiper-item></swiper-item>
                        <swiper-item></swiper-item>
                    </swiper>
                </div>    
                `
            },
            {
                classProperties: {
                    components: {
                        'swiper': getComponentClass('swiper', swiper),
                        'swiper-item': getComponentClass('swiper-item', swiperItem)
                    }
                }
            }
        );
        const TestSwiper = factory.getComponents('swiper-test5');
        const testSwiper = new TestSwiper();
        testSwiper.attach(document.body);
        testSwiper.communicator.fireMessage({
            type: 'slaveRendered'
        });
        const swiperComponent = testSwiper.ref('swiper');
        it('shoud', done => {
            createSingleTouchEvent(swiperComponent.el.querySelector('.swan-swiper-slide-frame'),
            [{x: 90, y: 50}, {x: 10, y: 40}]).then(() => {
                expect(swiperComponent.index).toBe(1);
                done();
            })
        })
    });

    describe('props type', () => {
        const attrArr = ['vertical', 'circular', 'indicatorDots', 'autoplay'];
        const component = buildComponent(COMPONENT_NAME, swiper);
        attach2Document(component);
        attrArr.forEach(name => {
            it(`__${name} should be boolean`, () => {
                const data = component.data;
                data.set(name, 'false');
                expect(data.get(`__${name}`)).toBe(false);
            });
        });
    });
})

