<?php

use yii\web\View;
use app\components\mgcms\MgHelpers;


/* @var $this yii\web\View */

$this->title = Yii::t('db', 'About us');

?>
<section class="info about-us">
    <div class="container">
        <h2><?= Yii::t('db', 'About us') ?></h2>
        <div class="row">
            <div class="col-md-6 info__content info__content--left">
                <?= MgHelpers::getSetting('about us text 1 ' . Yii::$app->language, true, 'about us text 1'); ?>
            </div>
            <div class="col-md-6">
                <img src=" <?= MgHelpers::getSetting('about us image ', false, '/img/onas_1.jpg'); ?>" alt=""/>
            </div>
        </div>
    </div>
</section>

<?= $this->render('/common/team') ?>

<section>
    <div class="container">
        <?= MgHelpers::getSetting('about us text 2 ' . Yii::$app->language, true, 'about us text 2'); ?>
    </div>
</section>

<section class="files-wrapper">
    <div class="container text-center">
        <h2><?= Yii::t('db', 'Files to download') ?></h2>
        <?= MgHelpers::getSetting('about us files to download text header ' . Yii::$app->language, true, 'about us files to download text header'); ?>
        <div class="text-center files">
            <?= MgHelpers::getSetting('about us files to download text ' . Yii::$app->language, true, 'about us files to download text'); ?>

            <?= MgHelpers::getSetting('about us files to download ' . Yii::$app->language, true, 'about us files to download'); ?>


        </div>
    </div>
</section>
