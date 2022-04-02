<?
/* @var $this yii\web\View */

use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Project;
use yii\bootstrap\ActiveForm;
use yii\web\View;



$index=0;

?>


<section class="Slider">
    <div class="owl-carousel owl-theme">
        <? foreach ($project->files as $file): ?>
            <? if ($file->isImage()): $index++;?>
                <div class="item" data-dot="<?= $index ?>>">
                    <div
                            class="Slider__item"
                            style="background-image: url('<?= $file->getImageSrc(1360, 768) ?>')"
                    >
                        <div class="container">
                            <div class="Slider__description">
                                <div class="Slider__description__header">
                                    <?= Yii::t('db', 'Investition in'); ?>
                                    <div><?= $project->name ?></div>
                                </div>
                                <div class="Slider__description__content">
                                    <?= $project->lead ?>
                                </div>
                                <a class="btn btn-primary btn-small"
                                   href="<?= \yii\helpers\Url::to(['site/about-project']) ?>"><?= Yii::t('db', 'More about project'); ?>
                                </a>
                                <div class="owl-dots">
                                    <? for ($i = 1; $i <= sizeof($project->files); $i++): ?>
                                        <div class="owl-dot"><?= $i ?></div>
                                    <? endfor; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <? endif; ?>
        <? endforeach; ?>
    </div>
</section>