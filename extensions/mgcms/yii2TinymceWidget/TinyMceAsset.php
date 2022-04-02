<?php

namespace app\extensions\mgcms\yii2TinymceWidget;

use yii\web\AssetBundle;

class TinyMceAsset extends AssetBundle
{
    public $sourcePath = '@vendor/tinymce/tinymce';

    public $js = [
        'tinymce.js',
        'themes/modern/theme.js',
        'plugins/*'
    ];
    
}
