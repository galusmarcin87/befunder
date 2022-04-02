<?php
/* @var $model app\models\mgcms\db\Project */
use app\components\mgcms\MgHelpers;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

/* @var $form app\components\mgcms\yii\ActiveForm */

$this->title = $model->title;

?>

<main>
  <section class="text-box single">
    <div class="container">
      <? if ($model->logo): ?>
        <h2><span style="height: 55px">
            <span><span></span></span> <img src="<?= $model->logo->imageSrc ?>"><span><span></span> </span></span>
        </h2>
      <? endif ?>
      <p><?= $model->buy_token_info ?></p>
    </div>
  </section>
</main>