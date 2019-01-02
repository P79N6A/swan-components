import sinon from 'sinon';
import video from '../../../src/video/index';
import button from '../../../src/button/index';
import buildComponent from '../../mock/swan-core/build-component';
import attach2Document from '../../utils/attach-to-document';
import Communicator from '../../mock/communicator';
import {getComponentClass, getFactory} from '../../mock/swan-core/build-component';
const COMPONENT_NAME = 'button';

describe('component [' + COMPONENT_NAME + ']', () => {
    describe('h5 button', () => {
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
            let spy = sinon.spy(component.boxjs.data, 'get');
            component.nextTick(() => {
                component.fire('bindtap', {});
                expect(spy.calledWith(sinon.match.has('name', 'swan-userInfo'))).toBe(true);
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
        it('should be bindcontact while set attribute openType: contact', done => {
            component.data.set('openType', 'contact');
            let spy = sinon.spy(component.boxjs.ui, 'open');
            component.nextTick(() => {
                component.fire('bindtap', {});
                expect(spy.calledWith(sinon.match.has('name', 'swan-IM'))).toBe(true);
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
            const spy = sinon.spy(component.boxjs.data, 'get');
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
            const spy = sinon.spy(component.boxjs.data, 'get');
            Communicator.getInstance().fireMessage({
                type: 'LabelTapped',
                data: {
                    target: component.uid
                }
            });
            expect(spy.callCount).toBe(1);
            spy.restore();
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
    });

    describe('na button', () => {

        const componentVideo = getComponentClass('video', video);
        const componentButton = getComponentClass('button', button);

        const factory = getFactory();
        const properties = {
            classProperties: {
                components: {
                    button: componentButton,
                    video: componentVideo
                }
            }
        };
        factory.componentDefine(
            'testComponent', {
                template: `
                    <swan-page>
                        <video src="https://vd3.bdstatic.com/mda-ia8e6q3g23py8qdh/hd/mda-ia8e6q3g23py8qdh.mp4?playlist=%5B%22hd%22%5D&auth_key=1521549485-0-0-d5d042ba3555b2d23909d16a82916ebc&bcevod_channel=searchbox_feed&pd=share">
                            <button s-ref="button" size="{{size}}" open-type="getPhoneNumber">
                                na button
                            </button>
                        </video>
                    </swan-page>`,
                initData() {
                    return {
                        size: 'default'
                    };
                }
            },
            properties
        );
        const TestView = factory.getComponents('testComponent');

        describe('base feature', () => {
            let component = new TestView();
            component.attach(document.body);
            let buttonInstance = component.ref('button');
            it('should update while style change', done => {
                const spy = sinon.spy(buttonInstance.boxjs.button, 'update');
                buttonInstance.data.set('size', 'mini');
                // test中通过data.set改变字段不会自动触发 slaveUpdated ，需要手动触发
                buttonInstance.communicator.fireMessage({
                    type: 'slaveUpdated'
                });
                buttonInstance.nextTick(() => {
                    expect(spy.callCount).toBe(0);
                    spy.restore();
                    done();
                });
            });

            it('should call remove while detached', done => {
                const spy = sinon.spy(buttonInstance.boxjs.button, 'remove');
                component.dispose();
                buttonInstance.nextTick(() => {
                    expect(spy.callCount).toBe(1);

                    spy.restore();
                    done();
                });
            });
        });

        describe('touch events', () => {
            let component = new TestView();
            component.attach(document.body);
            let buttonInstance = component.ref('button');
            it('should have hoverClass while tap', done => {
                const spy = sinon.spy(buttonInstance.boxjs.button, 'update');

                buttonInstance.communicator.fireMessage({
                    type: `button_${buttonInstance.data.get('id')}`,
                    params: {
                        action: 'touchstart',
                        e: {
                            changedTouches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ],
                            touches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ]
                        }
                    }
                });
                buttonInstance.communicator.fireMessage({
                    type: `button_${buttonInstance.data.get('id')}`,
                    params: {
                        action: 'touchmove',
                        e: {
                            changedTouches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ],
                            touches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ]
                        }
                    }
                });
                buttonInstance.communicator.fireMessage({
                    type: `button_${buttonInstance.data.get('id')}`,
                    params: {
                        action: 'touchend',
                        e: {
                            changedTouches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ],
                            touches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ]
                        }
                    }
                });

                setTimeout(() => {
                    buttonInstance.nextTick(() => {
                        expect(spy.callCount).toBe(1);
                        expect(buttonInstance.el.classList.contains(buttonInstance.data.get('hoverClass'))).toBe(true);
                        spy.restore();
                        done();
                    });
                }, +buttonInstance.data.get('hoverStartTime'));
            });
            it('should not have hoverClass while move', done => {
                const spy = sinon.spy(buttonInstance.boxjs.button, 'update');

                buttonInstance.communicator.fireMessage({
                    type: `button_${buttonInstance.data.get('id')}`,
                    params: {
                        action: 'touchstart',
                        e: {
                            changedTouches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ],
                            touches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ]
                        }
                    }
                });
                buttonInstance.communicator.fireMessage({
                    type: `button_${buttonInstance.data.get('id')}`,
                    params: {
                        action: 'touchmove',
                        e: {
                            changedTouches: [
                                {
                                    clientX: 11,
                                    clientY: 11
                                }
                            ],
                            touches: [
                                {
                                    clientX: 11,
                                    clientY: 11
                                }
                            ]
                        }
                    }
                });
                buttonInstance.communicator.fireMessage({
                    type: `button_${buttonInstance.data.get('id')}`,
                    params: {
                        action: 'touchend',
                        e: {
                            changedTouches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ],
                            touches: [
                                {
                                    clientX: 10,
                                    clientY: 10
                                }
                            ]
                        }
                    }
                });
                setTimeout(() => {
                    buttonInstance.nextTick(() => {
                        expect(spy.callCount).toBe(0);
                        spy.restore();
                        done();
                    });
                }, +buttonInstance.data.get('hoverStartTime'));
            });
        });
    });
});
