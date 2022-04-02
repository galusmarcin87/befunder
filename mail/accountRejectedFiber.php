<?
use app\components\mgcms\MgHelpers;

?>

<h1><?= Yii::t('db', 'Verification by FiberID'); ?></h1>

<div>
  <?= MgHelpers::getSettingTranslated('mail_user_rejected_fiber_id_text', 'Your account has been rejected by FiberID') ?>
</div>
