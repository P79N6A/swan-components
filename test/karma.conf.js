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
            './components/animation-view/*.js',
            './components/ar-camera/*.js',
            './components/audio/*.js',
            './components/button/*.js',
            './components/camera/*.js',
            './components/canvas/*.js',
            './components/checkbox/*.js',
            './components/checkbox-group/*.js',
            './components/cover-image/*.js',
            './components/cover-view/*.js',
            './components/form/*.js',
            './components/icon/*.js',
            './components/image/*.js',
            './components/input/*.js',
            './components/label/*.js',
            './components/live-player/*.js',
            './components/map/*.js',
            './components/mask/*.js',
            './components/movable-area/*.js',
            './components/movable-view/*.js',
            './components/navigator/*.js',
            './components/open-data/*.js',
            './components/page/*.js',
            './components/picker/*.js',
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
            './components/textarea/*.js',
            './components/video/*.js',
            './components/view/*.js',
            './components/web-view/*.js'
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
