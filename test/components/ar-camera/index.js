import sinon from 'sinon';
import ARCamera from '../../../src/ar-camera/index';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';
const COMPONENT_NAME = 'ar-camera';

describe('component [' + COMPONENT_NAME + ']', () => {
    const component = buildComponent(COMPONENT_NAME, ARCamera);
    const $component = attach2Document(component);

    afterAll(() => {
        component.dispose();
    });

    it('should be render while attach', () => {
        let $swanARCamera = $component.querySelector('swan-ar-camera');
        let $innerDiv = $component.querySelector('swan-ar-camera>div');
        expect($swanARCamera).not.toBe(null);
        expect($innerDiv).not.toBe(null);
    });

    it('should update Native component while slaveRenderd', done => {
        const spy = sinon.spy(component.boxjs.media, 'arCamera');
        component.el.style.top = '-1px';
        component.slaveUpdated();
        component.nextTick(() => {
            expect(spy.calledWith(sinon.match.has('type', sinon.match('update')))).toBe(true)
            spy.restore();
            done();
        })
    });

    const component2 = buildComponent(COMPONENT_NAME, ARCamera);
    const $component2 = attach2Document(component2);
    componentBaseFieldCheck(COMPONENT_NAME, component2);
    it('should remove Native component while detached', () => {
        const spy = sinon.spy(component2.boxjs.media, 'arCamera');
        component2.dispose();
        spy.restore();
        expect(spy.calledWith(sinon.match.has('type', sinon.match('remove')))).toBe(true)
    });

    
});