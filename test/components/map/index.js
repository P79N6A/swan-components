/**
 * @file map组件单测
 * @author v_wushuangzhao@baidu.com
 */

import sinon from 'sinon';
import Map from '../../../src/map/index';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';

const COMPONENT_NAME = 'map';

describe('component [' + COMPONENT_NAME + ']', () => {
    describe('base feature', () => {
        const component = buildComponent(COMPONENT_NAME, Map);
        const spy = sinon.spy(component, 'openMap');
        const $component = attach2Document(component);

        it('openMap will be executed while attached', done => {
            component.nextTick(() => {
                expect(spy.calledOnce).toBe(true);
                spy.restore();
                done();
            });
        });
        componentBaseFieldCheck(COMPONENT_NAME, component);

        it('should be rendered after attach', () => {
            const $swanMap = $component.querySelector('swan-map');
            expect($swanMap).not.toBe(null);
        });

        it('should has one slot', () => {
            expect($component.slot.length).toBe(0);
        });

        describe('default props', () => {

            it('should has one default props', () => {
                const data = component.data;
                expect(data.get('scale')).toBe(16);
            });
        });

        it('should call updateMap when slaveUpdated', done => {
            const spy = sinon.spy(component.boxjs.map, 'operate');
            component.data.set('longitude',114);
            component.communicator.fireMessage({ type: 'slaveUpdated' });
            component.nextTick(() => {
                (+component.data.get('scale') >= component.scaleMin) && (+component.data.get('scale') <= component.scaleMax) && expect(spy.calledOnceWith(
                    sinon.match
                    .has('type', 'update')
                    .and(sinon.match.has('data', component.args.scale !== component.getMapParams().scale ? (Object.assign({}, component.getMapParams(), { longitude: null, latitude: null })) : component.getMapParams()))
                )).toBe(true);
                spy.restore();
                done();

            });

        });

        const component2 = buildComponent(COMPONENT_NAME, Map);
        const $component2 = attach2Document(component2);
        it('should removeMap while detached', () => {
            const spy = sinon.spy(component2, 'removeMap');
            component2.dispose();
            expect(spy.calledOnce).toBe(true);
        });

        it('should handle control tap', done => {
            const component = buildComponent(COMPONENT_NAME, Map);
            attach2Document(component);
            component.nextTick(() => {
                component.on('bindcontroltap', e => {
                    expect(e.controlId).toBe(123);
                    done();
                    component.dispose();
                });
                component.communicator.fireMessage({
                    type: `map_${component.data.get('id')}`,
                    params: {
                        action: 'controltap',
                        e: {
                            data: JSON.stringify({
                                controlId: 123
                            })
                        }
                    }
                });
            });
        });

        it('should handle marker tap', done => {
            const component = buildComponent(COMPONENT_NAME, Map);
            attach2Document(component);
            component.nextTick(() => {
                component.on('bindmarkertap', e => {
                    expect(e.markerId).toBe(456);
                    done();
                    component.dispose();
                });
                component.communicator.fireMessage({
                    type: `map_${component.data.get('id')}`,
                    params: {
                        action: 'markertap',
                        e: {
                            data: JSON.stringify({
                                markerId: 456
                            })
                        }
                    }
                });
            });
        });
    });
});