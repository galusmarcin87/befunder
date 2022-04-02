<?
use app\components\mgcms\MgHelpers;

?>

<h1><?= Yii::t('db', 'Noble Assets Platform - Your account has been active again'); ?></h1>

<div>
  <?= MgHelpers::getSettingTranslated('mail_user_verified_again_text', 'Your account has been active again') ?>
</div>