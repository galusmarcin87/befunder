<?php

use yii\web\View;

/* @var $this yii\web\View */
/* @var $model \app\models\mgcms\db\Article */
$this->registerLinkTag(['rel' => 'canonical', 'href' => \yii\helpers\Url::canonical()]);

?>

<?= $this->render('/common/breadcrumps', ['subNode' => [
    'name' => Yii::t('db', 'News'), 'url' => $model->category->linkUrl
]]) ?>

<section class="Section News News--single animatedParent">
    <div class="container fadeIn animated">
        <div class="row">
            <div class="col-sm-6">
                <h4 class="Projects__header"><?= $model->title ?>></h4>
            </div>
            <div class="col-sm-6 text-right">
                <div class="Projects__filter">
                    <a
                            href="javascript:history.back()"
                            class="btn btn-success btn-success--outline btn-success--reverse-colors"
                    ><?= Yii::t('db', 'Back'); ?></a
                    >
                </div>
            </div>
        </div>
        <h3>

        </h3>
        <div>
            <div class="Card">
                <? if ($model->file && $model->file->isImage()): ?>
                    <?= $model->file->getImage(1170) ?>
                <? endif; ?>
                <div class="Card__body">
                    <div class="Card__date">
                        <?= date('d.m.Y', strtotime($model->created_on)) ?>
                    </div>
                    <div class="Card__text">
                        <?= $model->content ?>
                    </div>

                </div>
            </div>
        </div>

</section>


<?= $this->render('/common/news', ['showAllButton' => false]) ?>

<?= $this->render('/common/newsletterForm') ?>
