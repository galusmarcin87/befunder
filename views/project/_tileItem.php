<?

use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Project;
use yii\web\View;

/* @var $model Project */
/* @var $this yii\web\View */
$model->language = Yii::$app->language;
?>

    <div class="news__header"><?= $model->name ?></div>
    <? if ($model->file && $model->file->isImage()): ?>
        <img src="<?= $model->file->getImageSrc(455, 303); ?>" alt=""/>
    <? endif; ?>
    <p>
        <?= Yii::t('db', 'Localization') ?>: <?= $model->localization ?>
        <br/>
        <?= Yii::t('db', 'Investition amount') ?>: <?= $model->localization ?>
        <br/>
        <?= Yii::t('db', 'Profit') ?>:
    </p>
    <a href="<?= $model->linkUrl ?>"><?= Yii::t('db', 'DETAILS') ?> >></a>
    <div class="counter-header">
        <div class="counter-header__source">
            <span class="counter-header__source__value"><?= $model->money ?></span>
            PLN
        </div>
        <div class="counter-header__target"><?= $model->money_full ?> PLN</div>
    </div>
    <? if ($model->money_full): ?>
        <div class="counter-wrapper">
            <div class="counter">
                <div class="counter__line" style="width: <?= round(($model->money / $model->money_full) * 100, 0) ?>%"></div>
            </div>
        </div>
    <? endif; ?>
    <div class="counter-body">
        <div class="counter-body__heading">
            <?= Yii::t('db', 'Time left to the end of collection') ?>
        </div>
        <div data-date="<?= $model->date_crowdsale_end ?>" class="count-down-timer">
            <div class="count-down-timer__day"><span></span> <?= Yii::t('db', 'days') ?></div>
            <div class="count-down-timer__hour"><span></span> <?= Yii::t('db', 'hours') ?></div>
            <div class="count-down-timer__minute"><span></span> <?= Yii::t('db', 'minutes') ?></div>
            <div class="count-down-timer__second"><span></span> <?= Yii::t('db', 'seconds') ?></div>
        </div>
    </div>



