<?php

use yii\web\View;

/* @var $this yii\web\View */
/* @var $model \app\models\mgcms\db\Article */
$this->registerLinkTag(['rel' => 'canonical', 'href' => \yii\helpers\Url::canonical()]);

?>


<section class="Section Section--big-padding-top Gallery">
    <h3 class="Header-icon">
        <?= $model->title ?>
        <img class="Header-icon__icon" src="/svg/znaczek.svg" alt=""/>
    </h3>

    <div class="container"><?= $model->content ?></div>
    <div class="container Gallery__wrapper animatedParent">


        <? foreach ($model->files as $file): ?>
            <? if (!$file->isImage()) continue; ?>
            <a class="Gallery__card" href="<?= $file->imageSrc ?>">
                <img
                        class="Gallery__image fadeIn animated"
                        src="<?= $file->imageSrc ?>"
                        alt=""
                />
            </a>
        <? endforeach; ?>
    </div>

</section>

<?= $this->render('/common/newsletterForm') ?>
