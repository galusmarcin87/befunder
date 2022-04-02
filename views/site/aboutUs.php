<?php

use yii\web\View;
use app\components\mgcms\MgHelpers;


/* @var $this yii\web\View */

$this->title = Yii::t('db', 'About us');

?>
<style>
    .List-custm__checklist__item:before {
        content: '';
        width: var(--size);
        height: var(--size);
        background: #dbe3e9;
        border-radius: 3px;
        position: absolute;
        left: 0;
        top: 0;
    }
    .List-custm__checklist__item:after {
        content: '\2713';
        width: var(--size);
        height: var(--size);
        color: #35a1d9;
        position: absolute;
        font-size: 30px;
        left: 0%;
        font-weight: bold;
        top: 0%;
        display: -ms-grid;
        display: grid;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
    }
</style>
<?= $this->render('/common/breadcrumps') ?>
<section class="Section  Section--white">
    <div class="container">
        <div class="text-center">
            <b><?= Yii::t('db', 'ABOUT US'); ?></b>
        </div>
        <h1 class="text-center"><?= Yii::t('db', 'and our experience'); ?></h1>
        <div class="row animatedParent">
            <div class="col-md-6 fadeIn animated">
                <p class="big">
                    <?= MgHelpers::getSetting('about us section 1 column 1 header ' . Yii::$app->language, false, 'about us section 1 column 1 header') ?>
                </p>
                <p>
                    <?= MgHelpers::getSetting('about us section 1 column 1 text ' . Yii::$app->language, false, 'about us section 1 column 1 text') ?>
                </p>
            </div>
            <div class="col-md-6 fadeIn animated">
                <p>
                    <?= MgHelpers::getSetting('about us section 1 column 2 header ' . Yii::$app->language, false, 'about us section 1 column 2 header') ?>
                </p>
                <p>
                    <?= MgHelpers::getSetting('about us section 1 column 2 text ' . Yii::$app->language, false, 'about us section 1 column 2 text') ?>
                </p>
            </div>
        </div>
    </div>
</section>

<section>
    <div class="container">
        <div class="section-with-long-bg">
            <div class="row">
                <div class="col-lg-6">
                    <img src="<?= MgHelpers::getSetting('about us section 2 image', false, '/images/img3.jpg') ?>"
                         alt=""/>
                </div>
                <div class="col-lg-6">
                    <div class="uppercase-header"><?= MgHelpers::getSetting('about us section 2 header ' . Yii::$app->language, false, 'O platformie') ?></div>
                    <p class="big">
                        <?= MgHelpers::getSetting('about us section 2 text 1 ' . Yii::$app->language, false, 'about us section 2 text 1') ?>
                    </p>
                    <p class="small">
                        <?= MgHelpers::getSetting('about us section 2 text 2 ' . Yii::$app->language, false, 'about us section 2 text 2') ?>
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="Section Section--white">
    <div class="container">
        <div class="text-center">
            <b><?= Yii::t('db', 'OUR COMPANY'); ?></b>
        </div>
        <h1 class="text-center"><?= Yii::t('db', 'with numbers'); ?></h1>
        <div class="row text-center">
            <div class="col-md-4">
                <div class="big-text">
                    <?= MgHelpers::getSetting('about us section 3 number 1', false, '8') ?>
                    <p class="small">
                        <?= MgHelpers::getSetting('about us section 3 text 1 ' . Yii::$app->language, false, 'liczba<br /> emisji') ?>

                    </p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="big-text">
                    <?= MgHelpers::getSetting('about us section 3 number 2', false, '50') ?>
                    <p class="small">
                        <?= MgHelpers::getSetting('about us section 3 text 2 ' . Yii::$app->language, false, 'mln PLN - kwota<br /> pozyskanych środków') ?>
                    </p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="big-text">
                    <?= MgHelpers::getSetting('about us section 3 number 3', false, '10') ?>
                    <p class="small">
                        <?= MgHelpers::getSetting('about us section 3 text 3 ' . Yii::$app->language, false, 'lat doświadczenia<br/> w nieruchomościach') ?>

                    </p>
                </div>
            </div>
        </div>
    </div>
</section>


<section class="Section Section--white">
    <div class="container">
        <div class="text-center">
            <b><?= MgHelpers::getSetting('about us section 4 header ' . Yii::$app->language, false, 'JAK DZIAŁAMY') ?></b>
        </div>
        <h1 class="text-center"><?= MgHelpers::getSetting('about us section 4 subheader ' . Yii::$app->language, false, 'na rynku inwestycji') ?></h1>
        <ul class="List-custm__checklist">
            <li class="List-custm__checklist__item">
                <strong><?= MgHelpers::getSetting('about us section 4 header 1 ' . Yii::$app->language, false, 'Zakup tokenów') ?></strong>
                <?= MgHelpers::getSetting('about us section 4 text 1 ' . Yii::$app->language, false, 'about us section 4 text 1') ?>
            </li>
            <li class="List-custm__checklist__item">
                <strong><?= MgHelpers::getSetting('about us section 4 header 2 ' . Yii::$app->language, false, 'Zakup tokenów') ?></strong>
                <?= MgHelpers::getSetting('about us section 4 text 2 ' . Yii::$app->language, false, 'about us section 4 text 2') ?>
            </li>
            <li class="List-custm__checklist__item">
                <strong><?= MgHelpers::getSetting('about us section 4 header 3 ' . Yii::$app->language, false, 'Zakup tokenów') ?></strong>
                <?= MgHelpers::getSetting('about us section 4 text 3 ' . Yii::$app->language, false, 'about us section 4 text 3') ?>
            </li>
            <li class="List-custm__checklist__item">
                <strong><?= MgHelpers::getSetting('about us section 4 header 4 ' . Yii::$app->language, false, 'Zakup tokenów') ?></strong>
                <?= MgHelpers::getSetting('about us section 4 text 4 ' . Yii::$app->language, false, 'about us section 4 text 4') ?>
            </li>
        </ul>
    </div>
</section>

<section class="Section" style="overflow: hidden">
    <div class="container">
        <div class="section-with-long-bg section-with-long-bg--right">
            <div class="uppercase-header"><?= MgHelpers::getSetting('about us section 5 header ' . Yii::$app->language, false, 'O platformie') ?></div>

            <p class="small">
                <?= MgHelpers::getSetting('about us section 5 text 1 ' . Yii::$app->language, false, 'about us section 5 text 1') ?>
            </p>
            <p class="small">
                <?= MgHelpers::getSetting('about us section 5 text 2 ' . Yii::$app->language, false, 'about us section 5 text 2') ?>
            </p>
        </div>
    </div>
</section>

<?= $this->render('/common/movies')?>
<?= $this->render('/common/team')?>
<?= $this->render('/common/faq')?>
