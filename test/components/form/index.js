import form from '../../../src/form/index';
import buildComponent from '../../mock/swan-core/build-component';
import attach2Document from '../../utils/attach-to-document';
import button from '../../../src/button/index';
import input from '../../../src/input/index';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import {getComponentClass, getFactory} from '../../mock/swan-core/build-component';
import {boxjsDataGetCallbackMock} from '../../mock/swan-api/mock-data';
import sinon from 'sinon';
const COMPONENT_NAME = 'form';

describe('component [' + COMPONENT_NAME + ']', () => {
    const component = buildComponent(COMPONENT_NAME, form);
    const $button = buildComponent('button', button);
    const $component = attach2Document(component);
    componentBaseFieldCheck(COMPONENT_NAME, component);
    const $form = $component.querySelector('swan-form');
    it('should be render while attach', () => {
        expect($form).not.toBe(null);
    });
    describe('verify form event', () => {
        const componentForm = getComponentClass(COMPONENT_NAME, form);
        const componentButton = getComponentClass('button', button);
        const componentInput = getComponentClass('input', input);
        const factory = getFactory();
        const properties = {
            classProperties: {
                components: {
                    form: componentForm,
                    button: componentButton,
                    input: componentInput
                }
            }
        };
        factory.componentDefine(
            'swan-form',
            {
                template: `
                <view>
                   <form s-ref='form'>
                       <button s-ref='btn' formType="submit"></button>
                       <input s-ref="input" name="input" value="123"/>
                    </form>
                </view>
                `
            },
            properties
        );
        const TestView = factory.getComponents('swan-form');
        const testview = new TestView();
        testview.attach(document.body);
        it('verify submit event', () => {
            const formSpy = sinon.spy(testview.ref('form'), 'submitHandler');
            testview.ref('btn').dispatch('form:submit', 123123);
            expect(formSpy.callCount).toBe(1);
        });
        it('verify reset event', done => {
            let input = testview.ref('input');
            input.data.set('value', 123);
            testview.ref('btn').dispatch('form:reset');
            testview.nextTick(() => {
                expect(input.data.get('__value')).toBe('');
                done();
            });
        });
        it('submit should receive formId', done => {
            testview.ref('form').data.set('reportSubmit', true);
            testview.ref('btn').dispatch('form:submit', 123123);
            testview.ref('form').on('bindsubmit', e => {
                expect(e.detail.formId).toBe('');
                done();
            });
        });
    });
});
