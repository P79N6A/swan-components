/**
 * @file web-view组件单测
 * @author yanghuabei@baidu.com
 */

import sinon from 'sinon';
import Video from '../../../src/video';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';

const COMPONENT_NAME = 'video';

/* eslint-disable max-nested-callbacks */
describe(`component [${COMPONENT_NAME}]`, () => {
    describe('base feature', () => {
        const component = buildComponent(COMPONENT_NAME, Video);
        const $component = attach2Document(component);
        componentBaseFieldCheck(COMPONENT_NAME, component);
        it('should be rendered after attach', () => {
            const $swanVideo = $component.querySelector('swan-video');
            expect($swanVideo).not.toBe(null);
        });

        it('should has one slot', () => {
            expect(component.slot.length).toBe(1);
        });

        describe('default props', () => {
            it('should has right default props', () => {
                const data = component.data;
                expect(data.get('controls')).toBe(true);
                expect(data.get('autoplay')).toBe(false);
                expect(data.get('loop')).toBe(false);
                expect(data.get('muted')).toBe(false);
                expect(data.get('objectFit')).toBe('contain');
            });
        });

        describe('video:fullscreenchange', () => {
            let fullScreenChangeCallBack = null;

            beforeEach(() => {
                fullScreenChangeCallBack = jasmine.createSpy('fullScreenChangeCallBack');
                jasmine.clock().install();
            });

            afterEach(() => {
                jasmine.clock().uninstall();
            });

            it('should set fullscreen if data equals "1"', () => {

                component.communicator.fireMessage({
                    type: `video_${component.data.get('id')}`,
                    params: {
                        action: 'fullscreenchange',
                        e: {
                            data: '{"fullscreen":"1", "width":"720", "height":"360", "videoId":"myde"}'
                        }
                    }
                });

                const data = component.data;
                component.nextTick(() => {
                    data.get('isFullScreen', true);
                });

            });

            it('should set half screen if data not equals "1"', () => {

                component.communicator.fireMessage({
                    type: `video_${component.data.get('id')}`,
                    params: {
                        action: 'fullscreenchange',
                        e: {
                            data: '{"fullscreen":"0", "width":"720", "height":"360", "videoId":"myde"}'
                        }
                    }
                });

                const data = component.data;
                component.nextTick(() => {
                    data.get('isFullScreen', false);
                });

            });
        });
    });

    describe('props watch', () => {
        let component = null;
        beforeEach(() => {
            component = buildComponent(
                COMPONENT_NAME,
                Video,
                {
                    data: {
                        src: 'http://src'
                    }
                }
            );
            attach2Document(component);
        });
        afterEach(() => component.dispose());

        it('should call open when src change', done => {
            // 模拟触发attach
            component.communicator.fireMessage({
                type: 'slaveUpdated'
            });
            component.nextTick(() => {
                const spy = sinon.spy(component.boxjs.media, 'video');
                component.data.set('src', 'http');
                // test中通过data.set改变字段不会自动触发 slaveRendered，需要手动触发
                component.communicator.fireMessage({
                    type: 'slaveUpdated'
                });
                component.nextTick(() => {
                    expect(spy.calledOnceWith(sinon.match.has('type', sinon.match('open')))).toBe(true);

                    spy.restore();
                    done();
                });
            });
        });

        it('should not call update when no attribute changed', done => {
            // 模拟触发attach
            component.communicator.fireMessage({
                type: 'slaveUpdated'
            });
            component.nextTick(() => {
                const spy = sinon.spy(component.boxjs.media, 'video');
                component.communicator.fireMessage({
                    type: 'slaveUpdated'
                });
                component.nextTick(() => {
                    expect(spy.callCount).toBe(0);

                    spy.restore();
                    done();
                });
            });
        });

        it('should call update when other attribute changed', done => {
            // 模拟触发attach
            component.communicator.fireMessage({
                type: 'slaveUpdated'
            });
            component.nextTick(() => {
                const spy = sinon.spy(component.boxjs.media, 'video');
                component.data.set('hidden', !component.data.get('hidden'));
                // test中通过data.set改变字段不会自动触发 slaveUpdated，需要手动触发
                component.communicator.fireMessage({
                    type: 'slaveUpdated'
                });
                component.nextTick(() => {
                    expect(spy.calledOnceWith(sinon.match.has('type', sinon.match('update')))).toBe(true);

                    spy.restore();
                    done();
                });
            });
        });

    });
});
