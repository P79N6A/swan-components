/**
 * @file karma配置文件
 * @author liuyuekeng@baidu.com
 */

const webpackConfig = require('../webpack/webpack.test.conf');

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        port: 9876,
        colors: true,
        autoWatch: true,
        files: [
            './components/audio/*.js',
            './components/button/*.js',
            './components/checkbox/*.js',
            './components/checkbox-group/*.js',
            './components/form/*.js',
            './components/icon/*.js',
            './components/image/*.js',
            './components/input/*.js',
            './components/label/*.js',
            './components/mask/*.js',
            './components/movable-area/*.js',
            './components/movable-view/*.js',
            './components/page/*.js',
            './components/picker-view/*.js',
            './components/picker-view-column/*.js',
            './components/progress/*.js',
            './components/radio/*.js',
            './components/radio-group/*.js',
            './components/rich-text/*.js',
            './components/scroll-view/*.js',
            './components/slider/*.js',
            './components/super-custom-component/*.js',
            './components/swan-component/*.js',
            './components/swiper/*.js',
            './components/swiper-item/*.js',
            './components/switch/*.js',
            './components/text/*.js',
            './components/view/*.js',
        ],
        preprocessors: {
            '../test/**/*.js': ['webpack']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            dir: '../coverage',
            reporters: [
                {
                    type: 'lcov',
                    subdir: '.'
                },
                {
                    type: 'text-summary'
                }
            ]
        }
    });
};
