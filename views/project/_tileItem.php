<?

use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Project;
use yii\web\View;

/* @var $model Project */
/* @var $this yii\web\View */
$model->language = Yii::$app->language;
?>

<div class="news__header"><?= $model->name ?></div>
<? if ($model->file && $model->file->isImage()): ?>
    <img src="<?= $model->file->getImageSrc(388, 174); ?>" alt=""/>
<? endif; ?>
<p>
    <?= Yii::t('db', 'Localization') ?>: <?= $model->localization ?>
    <br/>
    <?= Yii::t('db', 'Investition amount') ?>: <?= $model->value ?>
    <br/>
    <?= Yii::t('db', 'Profit') ?>: <?= $model->percentage ?>
</p>
<a href="<?= $model->linkUrl ?>"><?= Yii::t('db', 'DETAILS') ?> >></a>
<?= $this->render('_counterHeader', ['model' => $model]) ?>
<?= $this->render('_counterWrapper', ['model' => $model]) ?>
<?= $this->render('_counterBody', ['model' => $model]) ?>



