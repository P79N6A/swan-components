/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

export default (name, component) => {
    describe('component [' + name + ']', () => {
        it('should be an Object', () => {
            expect(typeof component).toBe('object');
        });
        it('should contains a slaveId', () => {
            expect(component.slaveId).not.toBe(undefined);
        });
        it('should contains a constructor function', () => {
            expect(typeof component.constructor).toBe('function');
        });
        it('should contains a DOM element el', () => {
            expect(component.el).not.toBe(undefined);
        })
    });
}