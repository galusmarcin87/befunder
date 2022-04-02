<?

use yii\web\View;

/* @var $this yii\web\View */

?>
<section class="Breadcrumbs">
    <div class="container">
        <a href="/" class="Breadcrumbs__link">
            <?= Yii::t('db', 'Home'); ?>
        </a>
        <? if (isset($subNode)): ?>
            <a href="<?= $subNode['url'] ?>" class="Breadcrumbs__link">
                <?= $subNode['name'] ?>
            </a>
        <? endif ?>
        <a href="#" class="Breadcrumbs__link Breadcrumbs__link--active">
            <?= $this->title ?>
        </a>
    </div>
</section>