<?php
/* @var $model app\models\mgcms\db\Project */
/* @var $form app\components\mgcms\yii\ActiveForm */

/* @var $this yii\web\View */

/* @var $subscribeForm \app\models\SubscribeForm */

use app\components\mgcms\MgHelpers;
use yii\web\View;
use yii\helpers\Url;
use yii\bootstrap\ActiveForm;


$this->title = $model->name;
$model->language = Yii::$app->language;
if (!$model->money_full) {
    return false;
}
$index = 0;
?>

<section class="project">
    <div class="container">
        <div class="project__content">
            <h2><?= $model->name ?></h2>
            <div class="project__info">
                <? if ($model->file && $model->file->isImage()): ?>
                    <img class="project__banner" src="<?= $model->file->getImageSrc(635, 315) ?>"/>
                <? endif ?>

                <div class="project__map" id="map"></div>
            </div>
            <div class="project__info__content">
                <div class="row">
					<div class="col-md-8">
                        <?= $model->lead ?>
                    </div>
					<div class="col-md-4">
                        <div class="project__counter">
                            <?= $this->render('_counterHeader', ['model' => $model]) ?>
                            <?= $this->render('_counterWrapper', ['model' => $model]) ?>
                            <?= $this->render('_counterBody', ['model' => $model]) ?>
                            <a href="<?= Url::to(['project/buy', 'id' => $model->id]) ?>" class="button button--block"><?= Yii::t('db', 'INVEST') ?></a>
                        </div>
                    </div>
					<div class="col-md-12">
                        <?= $model->text ?>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div id="PROJECT_SLIDER" class="project-slider">
                            <? if (count($model->files) > 0): ?>
                                <img
                                        class="project__banner project__banner--small project-slider__image"
                                        src="<?= $model->files[0]->getImageSrc(838, 300) ?>"
                                />
                            <? endif ?>
                            <div class="row">
                                <? foreach ($model->files as $file): ?>
                                    <? if ($file->isImage()): $index++; ?>
                                        <div class="col-sm-4">
                                            <img
                                                    class="project-slider__item"
                                                    src="<?= $file->getImageSrc(838, 300) ?>"
                                                    alt=""
                                            />
                                        </div>
                                    <? endif; ?>
                                <? endforeach; ?>

                            </div>
                        </div>
                    </div>
                    <?= $this->render('view/table', ['model' => $model]) ?>
                </div>
            </div>
        </div>
    </div>
</section>

<?= $this->render('view/script', ['model' => $model]) ?>
