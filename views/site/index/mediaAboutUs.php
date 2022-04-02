<?

use app\components\mgcms\MgHelpers;

$category = \app\models\mgcms\db\Category::findOne(['name' => 'media o nas ' . Yii::$app->language]);
if (!$category) {
    return false;
}

?>

<section class="Section Section--bg-fixed-two Media animatedParent">
    <div class="container fadeIn animated">
        <h3 class="Header-icon">
            <?= Yii::t('db', 'Mass media about us'); ?>
            <img class="Header-icon__icon" src="/svg/znaczek.svg" alt=""/>
        </h3>
        <div class="Carousel">
            <div class="owl-carousel owl-theme animatedParent">
                <? foreach ($category->articles as $article): ?>
                    <div class="Media__card fadeIn animated item">
                        <div class="Media__card__header">
                            <div class="Media__card__heading">
                                <? if ($article->file && $article->file->isImage()): ?>
                                    <img
                                            class="Media__card__heading__image"
                                            src="<?= $article->file->imageSrc ?>"
                                            alt=""
                                    />
                                <? endif ?>
                                <div class="Media__card__heading__date"><?= $article->custom ?></div>
                            </div>
                        </div>
                        <div class="Media__card__body">
                            <?= $article->title ?>
                            <div class="Media__card__text">
                                <?= $article->excerpt ?>
                            </div>
                        </div>
                        <a class="btn btn-primary--reverse btn-small" href="<?= $article->linkUrl ?>"
                        ><?= Yii::t('db', 'Read more'); ?></a
                        >
                    </div>
                <? endforeach; ?>
            </div>
        </div>
        <div class="Custom-nav Media__nav"></div>
    </div>
</section>

