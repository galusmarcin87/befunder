<?
/* @var $this yii\web\View */

use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Project;
use yii\bootstrap\ActiveForm;
use yii\web\View;

$slider = \app\models\mgcms\db\Slider::find()->where(['name' => 'main', 'language' => Yii::$app->language])->one();
if (!$slider) {
    return false;
}
?>

<section class="slider">
    <div class="container">
        <div
                id="carouselExampleCaptions"
                class="carousel slide"
                data-bs-ride="carousel"
        >
            <div class="carousel-indicators">
                <? foreach ($slider->slides as $index => $slide): ?>
                    <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="<?= $index ?>"
                            class="active"
                            aria-current="true"
                            aria-label="Slide <?= $index + 1 ?>"
                    ></button>
                <? endforeach ?>
            </div>
            <div class="carousel-inner">
                <? foreach ($slider->slides as $index => $slide): ?>
                    <div
                            class="carousel-item <?= !$index ? " active" :""?>"
                            <? if ($slide->file && $slide->file->isImage()): ?>style="background-image: url(<?= $slide->file->getImageSrc() ?>)"<? endif ?>
                    >
                        <div>
                            <img class="slider__logo" src="/svg/logo.svg" alt=""/>
                            <h5 class="slider__header">
                                <?= $slide->header ?>
                            </h5>
                            <p class="slider__content">
                                <?= $slide->subheader ?>
                            </p>
                            <div>
                                <a href="<?= $slide->link ?>" class="button button--big"><?= $slide->name ?></a>
                            </div>
                        </div>
                    </div>
                <? endforeach ?>


            </div>
        </div>
    </div>
</section>
