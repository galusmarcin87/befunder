<?php

use yii\helpers\Url;
use app\components\mgcms\MgHelpers;

$request = $this->context->request;
?>

<div class="col-md-6">
    <h3>
        <?= MgHelpers::getSetting('login right - header ' . Yii::$app->language,false,'login right - header') ?>
    </h3>

    <?= MgHelpers::getSetting('login right - text ' . Yii::$app->language,true,'login right - text') ?>
    <div class="text-center">
        <a href="<?= MgHelpers::getSetting('login right - video url ' . Yii::$app->language,false,'login right - video url') ?>" class="video-icon">
            <i class="fa fa-play" aria-hidden="true"></i>
        </a>
    </div>
</div>
