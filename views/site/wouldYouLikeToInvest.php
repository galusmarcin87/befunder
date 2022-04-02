<?php

use yii\web\View;
use app\components\mgcms\MgHelpers;


/* @var $this yii\web\View */

$this->title = Yii::t('db', 'Would you like to invest?');

?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--white animatedParent">
    <div class="container">
        <div class="text-center">
            <b style="color: #11375f"><?= MgHelpers::getSetting('wanna invest header 1 ' . Yii::$app->language, false, 'CHCESZ') ?>
                </b>
            <h1><?= MgHelpers::getSetting('wanna invest header 2 ' . Yii::$app->language, false, 'Zainwestować?') ?></h1>
        </div>
        <div class="section-with-long-bg">
            <div class="row">
                <div class="col-lg-6">
                    <img src="<?= MgHelpers::getSetting('wanna invest image', false, '/images/img2.jpg') ?>" alt=""/>
                </div>
                <div class="col-lg-6">
                    <div class="uppercase-header"><?= MgHelpers::getSetting('wanna invest section 1 header 1 ' . Yii::$app->language, false, 'Innowacyjne rozwiązanie') ?></div>
                    <p>
                        <?= MgHelpers::getSetting('wanna invest section 1 text 1 ' . Yii::$app->language, false, 'wanna invest section 1 text 1') ?>
                    </p>
                    <div class="uppercase-header"><?= MgHelpers::getSetting('wanna invest section 1 header 2 ' . Yii::$app->language, false, 'BEZPIECZNE INWESTOWANIE') ?></div>
                    <p>
                        <?= MgHelpers::getSetting('wanna invest section 1 text 2 ' . Yii::$app->language, false, 'wanna invest section 1 text 2') ?>
                    </p>
                </div>
            </div>
        </div>
        <h6 class="h6-normal">
            <?= MgHelpers::getSetting('wanna invest section 2 line 1 ' . Yii::$app->language, false, 'wanna invest section 2 line 1') ?>
        </h6>

        <p>
            <?= MgHelpers::getSetting('wanna invest section 2 line 2 ' . Yii::$app->language, false, 'wanna invest section 2 line 2') ?>
        </p>
    </div>
    <div class="container fadeIn animated">
        <div class="text-center">
            <b style="color: #11375f"><?= MgHelpers::getSetting('wanna invest section 3 header 1 ' . Yii::$app->language, false, 'JAK') ?></b>
            <h1><?= MgHelpers::getSetting('wanna invest section 3 header 2 ' . Yii::$app->language, false, 'inwestować') ?></h1>
        </div>
        <div class="List-grid List-grid--numbers">
            <div class="List-grid__item">
                <h6 class="List-grid__item__header">
                    <?= MgHelpers::getSetting('wanna invest section 3 column 1 header ' . Yii::$app->language, false, 'Wybierz <br/>
                    inwestycję') ?>

                </h6>
                <p class="List-grid__item__content">
                    <?= MgHelpers::getSetting('wanna invest section 3 column 1 text ' . Yii::$app->language, false, 'wanna invest section 3 column 1 text') ?>
                </p>
            </div>
            <div class="List-grid__item">
                <h6 class="List-grid__item__header">
                    <?= MgHelpers::getSetting('wanna invest section 3 column 2 header ' . Yii::$app->language, false, 'Wybierz <br/>
                    inwestycję') ?>

                </h6>
                <p class="List-grid__item__content">
                    <?= MgHelpers::getSetting('wanna invest section 3 column 2 text ' . Yii::$app->language, false, 'wanna invest section 3 column 2 text') ?>
                </p>
            </div>
            <div class="List-grid__item">
                <h6 class="List-grid__item__header">
                    <?= MgHelpers::getSetting('wanna invest section 3 column 3 header ' . Yii::$app->language, false, 'Wybierz <br/>
                    inwestycję') ?>

                </h6>
                <p class="List-grid__item__content">
                    <?= MgHelpers::getSetting('wanna invest section 3 column 3 text ' . Yii::$app->language, false, 'wanna invest section 3 column 3 text') ?>
                </p>
            </div>
        </div>
    </div>
</section>
