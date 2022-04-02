<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Main application asset bundle.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class FrontAsset extends AssetBundle
{

    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/bootstrap.min.css',
        'css/font-awesome.min.css',
        'css/owl.carousel.min.css',
        'css/animations.css',
        'scss/style.scss',
        'css/magnific-popup.min.css',
        'less/front.less',
        'fonts/stylesheet.css',
    ];
    public $js = [
        'js/popper.min.js',
        'js/bootstrap.min.js',
        'js/owl.carousel.min.js',
        'js/jquery.viewportchecker.min.js',
        'js/jquery.countTo.js',
        'js/css3-animate-it.js',
        'js/scriprs.js',
        'js/jquery.magnific-popup.min.js',
    ];
    public $depends = [
        'yii\web\JqueryAsset'
//        'yii\web\YiiAsset',
//        'yii\bootstrap\BootstrapAsset',
    ];

}
