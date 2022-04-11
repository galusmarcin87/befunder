<?
/* @var $this yii\web\View */

use app\components\mgcms\MgHelpers;
use yii\web\View;


?>
<section class="info">
    <div class="container">
        <div class="row">
            <div class="col-md-6 info__content info__content--left">
                <h2><?= MgHelpers::getSetting('HP - section 1 - 1 header ' . Yii::$app->language, false, 'HP - section 1 - 1 header') ?></h2>
                <p>
                    <?= MgHelpers::getSetting('HP - section 1 - 1 text ' . Yii::$app->language, false, 'HP - section 1 - 1 text') ?>
                </p>
                <div class="text-end">
                    <a href="<?= MgHelpers::getSetting('HP - section 1 - 1 link url ' . Yii::$app->language, false, 'HP - section 1 - 1 link url ') ?>" class="button"><?= Yii::t('db', 'read more') ?></a>
                </div>
            </div>
            <div class="col-md-6">
                <img src="<?= MgHelpers::getSetting('HP - section 1 - 1 image ' . Yii::$app->language, false, '/img/inwestycja.jpg') ?>" alt=""/>
            </div>
        </div>
    </div>
</section>
<section class="info">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <img src="<?= MgHelpers::getSetting('HP - section 1 - 2 image ' . Yii::$app->language, false, '/img/kapital.jpg') ?>" alt="" />
            </div>
            <div class="col-md-6 info__content--right">
                <h2><?= MgHelpers::getSetting('HP - section 1 - 2 header ' . Yii::$app->language, false, 'HP - section 1 - 2 header') ?></h2>
                <p>
                    <?= MgHelpers::getSetting('HP - section 1 - 2 text ' . Yii::$app->language, false, 'HP - section 1 - 2 text') ?>
                </p>
                <div class="text-end">
                    <a href="<?= MgHelpers::getSetting('HP - section 1 - 2 link url ' . Yii::$app->language, false, 'HP - section 1 - 2 link url ') ?>" class="button"><?= Yii::t('db', 'read more') ?></a>
                </div>
            </div>
        </div>
    </div>
</section>
