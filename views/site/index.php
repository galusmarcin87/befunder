<?php
/* @var $this yii\web\View */

use yii\helpers\Html;
use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Project;

?>

<?= $this->render('index/slider') ?>


<section class="news">
    <div class="container">
        <?= $this->render('/common/projects') ?>
        <div class="text-center">
            <a href="<?= \yii\helpers\Url::to(['project/index']) ?>"
               class="button"> <?= Yii::t('db', 'all projects'); ?> </a>
        </div>
    </div>
</section>


<?= $this->render('index/section1') ?>

<?= $this->render('index/section2') ?>

<?= $this->render('index/section3') ?>
3
<?= $this->render('/common/movies') ?>

<?= $this->render('/common/news') ?>

<?= $this->render('/common/team') ?>

<?= $this->render('index/cooperateWith') ?>

<?= $this->render('/common/faq') ?>
