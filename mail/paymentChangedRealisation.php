<?
use app\components\mgcms\MgHelpers;

?>

<h1><?= Yii::t('db', 'Noble Platform - Your payment has been set to realisation'); ?> <?= $model->project->title?></h1>

<div>
  <?= MgHelpers::getSetting('payment_status_changed_realisation_' . Yii::$app->language, 'Your payment has been set to realisation') ?>
</div>