<?php

use yii\web\View;
use app\components\mgcms\MgHelpers;


/* @var $this yii\web\View */

$this->title = Yii::t('db', 'For investor');

?>
<section class="info about-us">
    <div class="container">
        <h2><?= Yii::t('db', 'For investor') ?></h2>
        <div class="row">
            <div class="col-md-6 info__content info__content--left">
                <?= MgHelpers::getSetting('for investor text 1' . Yii::$app->language, true, 'for investor text 1') ?>
            </div>
            <div class="col-md-6">
                <img src="<?= MgHelpers::getSetting('for investor image', true, '/img/onas_1.jpg') ?>" alt=""/>
            </div>
        </div>
        <?= MgHelpers::getSetting('for investor text 2' . Yii::$app->language, true, 'for investor text 2') ?>
        <div class="banner" style="background-image: url(/img/banner.jpg)">
            <div>
                <div class="banner__header">
                    <?= MgHelpers::getSetting('for investor banner header' . Yii::$app->language, false, 'Tradycyjny biznes w połączeniu z najnowszą technologią') ?>

                </div>
                <div class="banner__desc"><?= MgHelpers::getSetting('for investor banner text' . Yii::$app->language, false, 'Dołącz do społeczności Be-funder.com') ?></div>
            </div>
        </div>
    </div>
</section>

<?= $this->render('/common/filesToDownload') ?>

