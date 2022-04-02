<?php

use \yii\helpers\Html;
use yii\web\View;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model app\models\mgcms\db\Article */
?>

<div class="Projects__card fadeIn animated item">
    <a href="<?= $model->linkUrl ?>">
        <div class="Projects__card__image-wrapper">
            <div class="Projects__card__date">
                <img
                        src="/svg/kalendarz.svg"
                        class="Projects__card__date__ico"
                        alt=""
                />
                <?= date('d.m.Y', strtotime($model->created_on)) ?>
            </div>
            <? if ($model->file && $model->file->isImage()): ?>
                <img src="<?= $model->file->imageSrc ?>" alt=""/>
            <? endif ?>
        </div>
        <div class="Projects__card__header">
            <div class="Projects__card__heading">
                <?= $model->title ?>
            </div>
        </div>
        <div class="Projects__card__body">
            <p class="Project__card__body__text">
                <?= $model->excerpt ?>
            </p>
        </div>
    </a>
</div>
