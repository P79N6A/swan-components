/**
 * @file live-player组件单测
 * @author v_wushuangzhao@baidu.com
 */

import sinon from 'sinon';
import livePlayer from '../../../src/live-player/index';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';


const COMPONENT_NAME = 'swan-live-player';

describe('component [' + COMPONENT_NAME + ']', () => {
    const component = buildComponent(COMPONENT_NAME, livePlayer);
    const $component = attach2Document(component);
    componentBaseFieldCheck(COMPONENT_NAME, component);
    it('should be rendered after attach', () => {
        const $swanLivePlayer = $component.querySelector('swan-live-player');
        expect($swanLivePlayer).not.toBe(null);
    });

    it('has a class name liveicon', () => {
        const $spanLiveicon = $component.querySelector('swan-live-player>span');
        expect($spanLiveicon.className.indexOf('liveicon')).not.toBe(-1);
    });

    it('should has one slot', () => {
        expect(component.slot.length).toBe(1);
    });

    describe('default props', () => {
        it('should has right default props', () => {
            const data = component.data;
            expect(data.get('autoplay')).toBe(false);
            expect(data.get('muted')).toBe(false);
            expect(data.get('objectFit')).toBe('contain');
            expect(data.get('backgroundMute')).toBe(false);
            expect(data.get('minCache')).toBe(1);
            expect(data.get('maxCache')).toBe(3);
        });
    });

    describe('liveplayer:fullscreenchange', () => {
        it('should set fullscreen if data equals "1"', done => {
            let component = buildComponent(COMPONENT_NAME, livePlayer);
            attach2Document(component);
            component.communicator.fireMessage({
                type: `live_${component.data.get('id')}`,
                params: {
                    action: 'fullscreenchange',
                    e: {
                        data: '{"fullscreen":"1", "width":"720", "height":"360", "videoId":"myde"}'
                    }
                }
            });
            component.nextTick(() => {
                const data = component.data;
                expect(component.ref('slot').style.display).toBe('none');
                expect(component.ref('full').style.display).toBe('block');
                component.dispose();
                done();
            });
        });
        it('should set fullscreen if data equals "0"', done => {
            let component = buildComponent(COMPONENT_NAME, livePlayer);
            attach2Document(component);
            component.communicator.fireMessage({
                type: `live_${component.data.get('id')}`,
                params: {
                    action: 'fullscreenchange',
                    e: {
                        data: '{"fullscreen":"0", "width":"720", "height":"360", "videoId":"myde"}'
                    }
                }
            });
            component.nextTick(() => {
                const data = component.data;
                expect(component.ref('slot').style.display).toBe('block');
                expect(component.ref('full').style.display).toBe('none');
                component.dispose();
                done();
            });
        });
    });

    describe('updata props', () => {
        const component = buildComponent(COMPONENT_NAME, livePlayer, {
            data: {
                hidden: true,
                autoplay: true,
                objectFit: "fillCrop"
            }
        });
        const $component = attach2Document(component);

        it('data check', () => {
            expect(component.data.get('hidden')).toEqual(true);
            expect(component.data.get('autoplay')).toEqual(true);
            expect(component.data.get('objectFit')).toEqual("fillCrop");
        });

        it('should openLivePlayer while clicked', done => {
            const stub = sinon.stub(component, 'openLivePlayer');
            $component.querySelector('span').click();
            component.nextTick(() => {
                expect(stub.calledOnce).toBe(true);
                stub.restore();
                done();
            });
        });
    });

    const component2 = buildComponent(COMPONENT_NAME, livePlayer);
    const $component2 = attach2Document(component2);
    it('should update native component while slaveRendered', done => {
        const spy = sinon.spy(component2.boxjs.media, 'live');
        component2.el.style.top = '-1px';
        component2.communicator.fireMessage({
            type: 'slaveRendered'
        });
        component2.nextTick(() => {
            expect(spy.calledOnceWith(sinon.match('type', 'update')));
            spy.restore()
            component2.dispose();
            done();
        })
    })
});




