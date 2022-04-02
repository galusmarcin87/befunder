<?
/* @var $this yii\web\View */

use app\components\mgcms\MgHelpers;
use yii\web\View;


?>
<section class="Section Section--white">
    <div class="container">
        <div class="row">
            <div class="col-lg-6">
                <div class="image--shadow">
                    <img src="<?= MgHelpers::getSetting('Home section 1 image', false, '/images/img2.jpg') ?>" alt=""/>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="uppercase-header uppercase-header--reverse">
                    <?= MgHelpers::getSettingTypeText('Home section 2 - 1 subtitle' . Yii::$app->language, false, 'Chcesz zainwestować') ?>
                </div>
                <p class="small">
                    <?= MgHelpers::getSettingTypeText('Home section 2 - 1 text' . Yii::$app->language, false, 'Home section 2 - 1 text') ?>
                </p>
                <a href="<?= MgHelpers::getSetting('Home section 2 - 1 link '.Yii::$app->language, false, '#') ?>" class="btn btn--arrow"><?= Yii::t('db', 'see more'); ?> <span>⟶</span></a>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6 text-right">
                <div class="uppercase-header uppercase-header--reverse">
                    <?= MgHelpers::getSettingTypeText('Home section 2 - 2 subtitle' . Yii::$app->language, false, 'Chcesz zainwestować') ?>
                </div>
                <p class="small">
                    <?= MgHelpers::getSettingTypeText('Home section 2 - 2 text' . Yii::$app->language, false, 'Home section 2 - 2 text') ?>
                </p>
                <a href="<?= MgHelpers::getSetting('Home section 2 - 2 link '.Yii::$app->language, false, '#') ?>" class="btn btn--arrow"><?= Yii::t('db', 'see more'); ?> <span>⟶</span></a>
            </div>
            <div class="col-lg-6">
                <div class="image--shadow image--shadow--right">
                    <img src="<?= MgHelpers::getSetting('Home section 2 image', false, '/images/img3.jpg') ?>" alt=""/>
                </div>
            </div>
        </div>
    </div>
</section>
