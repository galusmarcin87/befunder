<?
use app\components\mgcms\MgHelpers;

?>

<h1><?= Yii::t('db', 'Piesto - Activation'); ?></h1>
<?= MgHelpers::getSetting('register_mail_' . Yii::$app->language) ?>
<?= Yii::t('db', 'Your activation link:'); ?>
<a href="<?=
yii\helpers\Url::to([
    '/site/activate',
    'hash' => app\components\mgcms\MgHelpers::encrypt($model->id)
    ], true)

?>"><?= Yii::t('db', 'Click here'); ?></a>
