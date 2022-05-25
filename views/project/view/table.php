<?

use app\models\mgcms\db\Project;
use yii\web\View;

/* @var $this yii\web\View */
/* @var $model Project */

?>
<div class="col-md-4">
    <div class="project__description">
        <div class="project__description__space"></div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Pre-sale start') ?>:
            </div>
            <div><?= $model->date_presale_start ?></div>
        </div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Pre-sale end') ?>:
            </div>
            <div><?= $model->date_presale_end ?></div>
        </div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Crowdsale start') ?>:
            </div>
            <div><?= $model->date_crowdsale_start ?></div>
        </div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Crowdsale end') ?>:
            </div>
            <div><?= $model->date_crowdsale_end ?></div>
        </div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Crowdsale profit') ?>:
            </div>
            <div><?= $model->percentage * (int)$model->investition_time ?>%</div>
        </div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Investition time') ?>:
            </div>
            <div><?= $model->investition_time ?></div>
        </div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Date of profit realization') ?>:
            </div>
            <div><?= $model->date_realization_profit ?></div>
        </div>
        <div class="project__description__item">
            <div class="project__description__item__header">
                <?= Yii::t('db', 'Yearly profit') ?>:
            </div>
            <div><?= $model->percentage ?>%</div>
        </div>
    </div>
</div>
