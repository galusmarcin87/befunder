<?
/* @var $this yii\web\View */

use app\components\mgcms\MgHelpers;
use yii\web\View;


?>


<section class="Section">
    <div class="container">
        <div>
            <b><?= Yii::t('db', 'WHO WE ARE'); ?></b>
        </div>
        <h1><?= MgHelpers::getSettingTypeText('Home section 1 - title 1 ' . Yii::$app->language, false, 'O nas coś więcej w liczbach i danych.') ?></h1>
        <div class="section-with-long-bg">
            <div class="row">
                <div class="col-lg-6">
                    <img src="<?= MgHelpers::getSetting('Home section 1 image', false, '/images/img2.jpg') ?>" alt=""/>
                </div>
                <div class="col-lg-6">
                    <div class="uppercase-header"><?= MgHelpers::getSettingTypeText('Home section 1 - subtitle 1 ' . Yii::$app->language, false, 'O platformie') ?></div>
                    <?= MgHelpers::getSettingTypeText('Home section 1 - text 1 ' . Yii::$app->language, true, '<p>Home section 1 - text 1</p>') ?>
                    <div class="uppercase-header"><?= MgHelpers::getSettingTypeText('Home section 1 - subtitle 2 ' . Yii::$app->language, false, 'Doświadczenie pokryte wiedzą') ?></div>
                    <?= MgHelpers::getSettingTypeText('Home section 1 - text 2 ' . Yii::$app->language, true, '<p>Home section 1 - text 2</p>') ?>
                    <a href="<?= MgHelpers::getSetting('Home section 1 link '. Yii::$app->language, false, '#') ?>" class="btn btn--arrow"
                    ><?= Yii::t('db', 'see more'); ?> <span>⟶</span></a
                    >
                </div>
            </div>
            <div class="row text-center" style="margin-top: 25px">
                <div class="col-md-4">
                    <div class="big-text">
                        <?= MgHelpers::getSetting('Home section 1 number 1', false, '8') ?>
                        <p class="small">
                            <?= MgHelpers::getSettingTypeText('Home section 1 - number 1 text' . Yii::$app->language, true, 'liczba<br/>emisji') ?>
                        </p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="big-text">
                        <?= MgHelpers::getSetting('Home section 1 number 2', false, '50') ?>
                        <p class="small">
                            <?= MgHelpers::getSettingTypeText('Home section 1 - number 2 text' . Yii::$app->language, true, 'mln PLN - kwota<br/>pozyskanych środków') ?>
                        </p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="big-text">
                        <?= MgHelpers::getSetting('Home section 1 number 3', false, '10') ?>
                        <p class="small">
                            <?= MgHelpers::getSettingTypeText('Home section 1 - number 3 text' . Yii::$app->language, true, 'lat doświadczenia<br/>w nieruchomościach') ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
