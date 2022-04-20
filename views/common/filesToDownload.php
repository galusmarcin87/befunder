<?

use app\components\mgcms\MgHelpers;
use \app\models\mgcms\db\User;

$slider = \app\models\mgcms\db\Slider::find()->where(['name' => 'pliki do pobrania', 'language' => Yii::$app->language])->one();
if (!$slider) {
    return false;
}

?>

<section class="files-wrapper">
    <div class="container text-center">
        <h2><?= Yii::t('db', 'Files to download') ?></h2>
        <?= MgHelpers::getSetting('about us files to download text header ' . Yii::$app->language, true, 'about us files to download text header'); ?>
        <div class="text-center files">
            <?= MgHelpers::getSetting('about us files to download text ' . Yii::$app->language, true, 'about us files to download text'); ?>

            <div class="text-center files">
                <? foreach ($slider->slides as $index => $slide): ?>
                    <a href="<?= $slide->file->getLinkUrl()?>">
                        <img src="/img/file.png" alt="" />
                        <?= $slide->name?>
                    </a>
                <? endforeach ?>

            </div>


        </div>
    </div>
</section>
