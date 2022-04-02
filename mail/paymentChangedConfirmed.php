<?
use app\components\mgcms\MgHelpers;

?>

<h1><?= Yii::t('db', 'Noble Platform - Your payment has been confirmed'); ?> <?= $model->project->title?></h1>

<div>
  <?= MgHelpers::getSettingTranslated('payment_status_changed_confirmed_' . Yii::$app->language, 'Your payment has been confirmed') ?>
</div>