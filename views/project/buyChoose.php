<?php
/* @var $model app\models\mgcms\db\Project */
use app\components\mgcms\MgHelpers;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

/* @var $payment app\models\mgcms\db\Payment */
/* @var $form app\components\mgcms\yii\ActiveForm */

$this->title = $model->title;

?>

<main>
  <section class="text-box single">
    <div class="container">
      <? if ($model->logo): ?>
        <h2><span style="height: 55px"><span><span></span></span> <img src="<?= $model->logo->imageSrc ?>"><span><span></span> </span></span></h2>
      <? endif ?>
      <div class="row animatedParent">
        <div class="col-lg-12 fadeIn animated">
          <a href="<?= \yii\helpers\Url::to(['project/buy', 'slug' => $model->slug, 'type' => 1]) ?>" class="btn btn-black">
            <?= Yii::t('db', 'Investition below 1000$') ?>
            <span></span>
          </a>
          &nbsp;
          <a href="<?= \yii\helpers\Url::to(['project/buy', 'slug' => $model->slug, 'type' => 2]) ?>" class="btn btn-black">
            <?= Yii::t('db', 'Investition over 1000$') ?>
            <span></span>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>