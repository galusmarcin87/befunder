<?php

use yii\web\View;

/* @var $this yii\web\View */
/* @var $model \app\models\mgcms\db\Article */
$this->registerLinkTag(['rel' => 'canonical', 'href' => \yii\helpers\Url::canonical()]);
$this->params['breadcrumbs'][] = $model->title;

?>


<section class="info about-us">
    <div class="container">
        <h2><?= $model->title ?></h2>

        <?= $model->content ?>

    </div>
</section>


