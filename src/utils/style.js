/**
 * @file 计算元素样式
 * @author qiaolin(qialin@baidu.com)
 */

 /**
  * 计算原生贴片位置
  * @param {Object} element DOM节点
  */
export const computedStyle = element => {
    let component = null;
    let fixed = false;
    if (Object.prototype.toString.call(element) === '[object Object]' && element.el) {
        component = {
            ...element
        };
        element = component.el;
        fixed = component.data.get('fixed');
    }
    if (!element) {
        return {
            style: {},
            position: {}
        };
    }
    const cssStyle = global.getComputedStyle(element);
    const clientRect = element.getBoundingClientRect();

    const padding = ['Top', 'Right', 'Bottom', 'Left'].map(item => {
        return parseFloat(cssStyle[`padding${item}`]);
    });

    const borderWidth = ['Top', 'Right', 'Bottom', 'Left'].map(item => {
        return parseFloat(cssStyle[`border${item}Width`]);
    });

    let textAlign = cssStyle.textAlign;
    ['left', 'center', 'right'].indexOf(textAlign) < 0
            && (textAlign = 'left');

    const style = {
        fontFamily: cssStyle.fontFamily,
        fontSize: parseFloat(cssStyle.fontSize) + '' || '16',
        fontWeight: parseFloat(cssStyle.fontWeight) || 'normal',
        color: hexColor(cssStyle.color),
        backgroundColor: hexColor(cssStyle.backgroundColor) || '#f0ffffff',
        textAlign: textAlign,
        padding
    };

    const position = {
        left: `${clientRect.left + borderWidth[3] + padding[3] + (fixed ? 0 : scrollX)}`,
        top: `${clientRect.top + (fixed ? 0 : scrollY)}`,
        width: `${clientRect.width - borderWidth[3] - borderWidth[1] - padding[3] - padding[1]}`,
        height: `${clientRect.height + borderWidth[0] + borderWidth[2]}`
    };

    return {
        style,
        position
    };
};

/**
 * 获得过渡动画所需参数
 * 仅支持 all、opacity、transform、-webkit-transform 属性
 *
 * @param {Object} element dom 节点
 * @return {Object} 参数集合
 */
export const getTransitionParams = element => {
    const res = {};
    if (!element) {
        return res;
    }
    const computedStyle = global.getComputedStyle(element);
    let duration = computedStyle.transitionDuration || computedStyle.webkitTransitionDuration;
    // 以毫秒作为动画时长单位
    duration = parseFloat(duration) * 1000;
    // 动画延迟
    let delay = computedStyle.transitionDelay || computedStyle.webkitTransitionDelay;
    delay = parseFloat(delay) * 1000;
    // 动画属性
    let properties = computedStyle.transitionProperty || computedStyle.webkitTransitionProperty;
    let timingFunction = computedStyle.transitionTimingFunction || computedStyle.webkitTransitionTimingFunction;
    const arrProperty = [];
    properties.split(/,\s?/i).map(property => {
        if (['all', 'opacity', 'transform', '-webkit-transform'].includes(property)) {
            arrProperty.push(property);
        }
    });
    if (duration && arrProperty.length) {
        res.transition = {
            duration,
            delay,
            easing: timingFunction,
            property: arrProperty.join(',')
        };
    }
    return res;
};

/**
 * rgb色值转换成十六进制
 * @param  {string} color rgb色值
 * @return {string} 十六进制色值
 */
export const hexColor = color => {
    if (color.indexOf('#') >= 0) {
        return color;
    } else if (!color) {
        return '#000000';
    }

    try {
        const regular = color.match(/\d+/g);
        const res = [];
        regular.map((item, index) => {
            if (index < 3) {
                item = parseInt(item, 10).toString(16);
                item = item.length > 1 ? item : '0' + item;
                res.push(item);
            }
        });
        if (regular.length > 3) {
            if (regular.length > 3) {
                let item = parseFloat(regular.slice(3).join('.'));
                if (+item === 0) {
                    res.unshift('00');
                } else if (item >= 1) {
                    res.unshift('ff');
                } else {
                    item = parseInt(255 * item, 10).toString(16);
                    item = item.length > 1 ? item : '0' + item;
                    res.unshift(item);
                }
            }
        }
        return `#${res.join('')}`;
    } catch (e) {
        return 'ff000000';
    }
};