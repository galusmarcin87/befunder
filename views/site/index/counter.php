<?

use app\components\mgcms\MgHelpers;
use yii\helpers\Url;

/* @var $project \app\models\mgcms\db\Project */
if(!$project->money_full){
    return false;
}

$formatter = \Yii::$app->formatter;
?>
<section class="Counter">
    <div class="container">
        <div class="Slider-counter">
            <div data-date="<?= $project->date_crowdsale_end ?>" class="Count-down-timer">
                <div class="Slider-counter__heading"><?= Yii::t('db', 'Left'); ?></div>
                <div class="Count-down-timer__day"><span></span> <?= Yii::t('db', 'days'); ?></div>
                <div class="Count-down-timer__hour"><span></span> <?= Yii::t('db', 'hours'); ?></div>
                <div class="Count-down-timer__minute"><span></span> <?= Yii::t('db', 'minutes'); ?></div>
                <div class="Count-down-timer__second"><span></span> <?= Yii::t('db', 'seconds'); ?></div>
            </div>
            <div class="Invest-counter">
                <div class="Invest-counter__header">
                    <div class="Invest-counter__source">
                        <span class="Invest-counter__source__value"><?= $project->money ?> PLN</span>
                        (<span data-to="<?= round(($project->money / $project->money_full) * 100, 3)?>" class="Invest-counter__source__percent"
                        >0</span
                        >%)
                    </div>
                    <div class="Invest-counter__target">CEL: <?= $formatter->asSumberSeparatedWithSpace($project->money_full) ?> PLN</div>
                </div>
                <div class="Invest-counter__value-line-wrapper">
                    <div
                            data-to="<?= $project->money ?>"
                            data-slide-to="<?= round(($project->money / $project->money_full) * 100, 3)?>"
                            class="Invest-counter__value-line"
                            style="width: 0%"
                    ></div>
                </div>
            </div>
            <div class="Slider-counter__buttons">
                <div>
                    <a class="btn btn-primary btn-small" href="#"><?= Yii::t('db', 'WHITEPAPER'); ?></a>
                    <a class="btn btn-primary btn-small" href="<?= $project->linkUrl ?>"
                    ><?= Yii::t('db', 'Details of investition'); ?></a
                    >
                </div>
                <div>
                    <a class="btn btn-primary btn-small" href="<?= Url::to(['project/buy', 'id' => $project->id]) ?>">
                        <?= Yii::t('db', 'Buy tokens'); ?>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
