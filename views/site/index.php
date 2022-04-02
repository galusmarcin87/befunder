<?php
/* @var $this yii\web\View */

use yii\helpers\Html;
use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Project;

?>
<section
        class="Section Projects animatedParent"
        style="padding-bottom: 75px"
>
    <div class="container fadeIn animated">

        <div class="Projects__header__wrapper">
            <h4 class="Projects__header text-center"><?= Yii::t('db', 'Current projects'); ?></h4>
            <a href="<?= \yii\helpers\Url::to(['project/index']) ?>" class="btn btn--transparent btn--medium">
                <?= Yii::t('db', 'SEE ALL'); ?>
            </a>
        </div>

        <?= $this->render('/common/projects') ?>


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
