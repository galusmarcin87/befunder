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


<?= $this->render('index/benefits') ?>
