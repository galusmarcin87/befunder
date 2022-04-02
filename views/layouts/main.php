<?php
/* @var $this \yii\web\View */
/* @var $content string */
use app\widgets\Alert;
use yii\helpers\Html;
//use app\assets\AppAsset;
use app\assets\FrontAsset;
use app\components\mgcms\MgHelpers;

//AppAsset::register($this);
FrontAsset::register($this);

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
    <head>
        <meta charset="<?= Yii::$app->charset ?>">

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

        <link
                href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&display=swap"
                rel="stylesheet"
        />


        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?= Html::csrfMetaTags() ?>
        <title><?= Html::encode($this->title) ?></title>
        <?php $this->head() ?>

    </head>
    <body id="page_<?= Yii::$app->controller->id . '_' . Yii::$app->controller->action->id ?>">
        <?php $this->beginBody() ?>
        <?= $this->render('header') ?>
        <?= Alert::widget() ?>
        <?= $content ?>
        <?= $this->render('footer') ?>
        <?php $this->endBody() ?>


    </body>
</html>
<?php $this->endPage() ?>
