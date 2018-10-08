/**
 * @file swan's file's base elements
 * @author houyu(houyu01@baidu.com)
 */
import Image from './image';
import View from './view';
import CoverView from './cover-view';
import CoverImage from './cover-image';
import Text from './text';
import Map from './map';
import WebView from './web-view';
import ScrollView from './scroll-view';
import Navigator from './navigator';
import Input from './input';
import Textarea from './textarea';
import Button from './button';
import Swiper from './swiper';
import SwiperItem from './swiper-item';
import PickerView from './picker-view';
import PickerViewColumn from './picker-view-column';
import Picker from './picker';
import Icon from './icon';
import Label from './label';
import Form from './form';
import Slider from './slider';
import RichText from './rich-text';
import Canvas from './canvas';
import Checkbox from './checkbox';
import CheckboxGroup from './checkbox-group';
import LivePlayer from './live-player';
import Video from './video';
import VideoExt from './video/android';
import Radio from './radio';
import RadioGroup from './radio-group';
import Switch from './switch';
import Progress from './progress';
import Audio from './audio';
import MovableView from './movable-view';
import MovableArea from './movable-area';
import Camera from './camera';
import OpenData from './open-data';
import AnimationView from './animation-view';
import Arcamera from './ar-camera';
import Page from './page';
import Ad from './ad';
import {behavior} from './behaviorDecorators';
import SwanComponent from './swan-component';
import SuperCustomComponent from './super-custom-component';
import TrackLog from './track-log';
import Mask from './mask';

export const getComponents = environment => {
    return {
        'swan-component': SwanComponent,
        'view': View,
        'cover-view': CoverView,
        'image': Image,
        'text': Text,
        'map': Map,
        'scroll-view': ScrollView,
        'web-view': WebView,
        'navigator': Navigator,
        'input': Input,
        'textarea': Textarea,
        'cover-image': CoverImage,
        'button': Button,
        'swiper': Swiper,
        'swiper-item': SwiperItem,
        'picker-view': PickerView,
        'picker-view-column': PickerViewColumn,
        'picker': Picker,
        'icon': Icon,
        'label': Label,
        'form': Form,
        'slider': Slider,
        'rich-text': RichText,
        'canvas': Canvas,
        'checkbox': Checkbox,
        'checkbox-group': CheckboxGroup,
        'live-player': LivePlayer,
        'video': (environment.versionCompare(environment.boxVersion(), '10.8.5') < 0 && !environment.isIOS)
                ? VideoExt : Video,
        'radio': Radio,
        'radio-group': RadioGroup,
        'switch': Switch,
        'progress': Progress,
        'movable-view': MovableView,
        'movable-area': MovableArea,
        'audio': Audio,
        'camera': Camera,
        'open-data': OpenData,
        'animation-view': AnimationView,
        'ad': Ad,
        'ar-camera': Arcamera,
        'super-page': Page,
        'super-custom-component': SuperCustomComponent,
        'track-log': TrackLog,
        'mask': Mask
    };
};

export const getBehaviorDecorators = () => behavior;
