<?php

use yii\web\View;

/* @var $this yii\web\View */
/* @var $model \app\models\mgcms\db\Article */
$this->registerLinkTag(['rel' => 'canonical', 'href' => \yii\helpers\Url::canonical()]);
$this->params['breadcrumbs'][] = $model->title;

?>
<?= $this->render('/common/breadcrumps') ?>

<section class="Section News News--single animatedParent">
    <div class="container fadeIn animated">
        <div>
            <div class="Card">
                <div class="Card__header__wrapper">
                    <? if ($model->file && $model->file->isImage()): ?>
                        <img class="Card__image" src="<?= $model->file->getImageSrc() ?>"/>
                    <? endif ?>
                    <div class="Card__header-block">
                        <div class="Projects__card__date">
                            <img
                                    src="/svg/kalendarz.svg"
                                    class="Projects__card__date__ico"
                                    alt=""
                            />
                            <?= date('d.m.Y', strtotime($model->created_on)) ?>
                        </div>
                        <h1><?= $model->title ?></h1>
                    </div>
                </div>
                <div class="Card__body">
                    <?= $model->content ?>
                </div>
            </div>
        </div>
    </div>
</section>

<?= $this->render('/common/news') ?>
