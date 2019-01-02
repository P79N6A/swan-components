import sinon from 'sinon';
import animationView from '../../../src/animation-view/index';
import buildComponent from '../../mock/swan-core/build-component';
import attach2Document from '../../utils/attach-to-document';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
const COMPONENT_NAME = 'animation-view';

describe('component [' + COMPONENT_NAME + ']', () => {
    const component = buildComponent(COMPONENT_NAME, animationView);
    const $component = attach2Document(component);
    componentBaseFieldCheck(COMPONENT_NAME, component);
    it('should be render while attach', () => {
        let $swanAnimationView = $component.querySelector('swan-animation-view');
        let $innerDiv = $component.querySelector('swan-animation-view>div');
        expect($swanAnimationView).not.toBe(null);
        expect($innerDiv).not.toBe(null);
    });
    it('should has one default slot', () => {
        expect(component.slot.length).toBe(1);
    });
    it('data set and get verify', () => {
        component.data.set('loop', true);
        expect(component.data.get('loop')).toBe(true);
    });

    it('should has hidden attribute when set hidden', () => {
        component.data.set('hidden', true);
        const $swanAnimationView = $component.querySelector('swan-animation-view');
        expect($swanAnimationView.getAttribute('hidden')).toBe('true');
        component.data.set('hidden', false);
    });

    const component2 = buildComponent(COMPONENT_NAME, animationView);
    attach2Document(component2);
    it('should call updateNativeAnimationView when specified props change', done => {
        const spy = sinon.spy(component2, 'updateNativeAnimationView');
        const changes = [
            ['action', 'pause'],
            ['style', 'background:red'],
            ['hidden', true]
        ];
        changes.forEach(([prop, value]) => {
            component2.data.set(prop, value);
            component2.communicator.fireMessage({
                type: 'slaveUpdated'
            });
        });
        component2.nextTick(() => {
            expect(spy.callCount).toEqual(changes.length);
            spy.restore();
            done();
        });
    });

    const component3 = buildComponent(COMPONENT_NAME, animationView);
    attach2Document(component3);
    it('should call removeNativeAnimationView null when run detached', done => {
        component3.nextTick(() => {
            component3.dispose();
            component3.nextTick(() => {
                expect(component3.isInserted).toBe(false);
                expect(component3.args).toBe(null);
                done();
            });
        });
    });
});
