<?

use app\components\mgcms\MgHelpers;

$category = \app\models\mgcms\db\Category::findOne(['name' => 'aktualności ' . Yii::$app->language]);
if (!$category) {
    return false;
}


?>
<section class="news">
    <div class="container">
        <h2><?= Yii::t('db', 'News') ?></h2>
        <div class="row news__container">
            <? foreach ($category->articles as $index => $article): ?>
                <? if ($index > 3) {
                    break;
                } ?>
                <div class="col-md-3 col-sm-6 news__item">
                    <div class="news__header"><?= $article->title ?></div>
                    <? if ($article->file && $article->file->isImage()): ?>
                        <img src="<?= $article->file->getImageSrc(301, 163) ?>" alt="<?= $article->title ?>"/>
                    <? endif; ?>
                    <?= $article->excerpt ?>
                    <div class="news__footer">
                        <a href="<?= $article->linkUrl ?>"><?= Yii::t('db', 'read more') ?> ..</a>
                        <?= $article->created_on ?>
                    </div>
                </div>
            <? endforeach ?>


        </div>
    </div>
</section>
