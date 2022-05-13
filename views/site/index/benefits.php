<?

use app\components\mgcms\MgHelpers;


?>
<section class="benefits">
    <div class="container">
        <div class="row">
            <div class="col-md-3 col-sm-6 col-xs-6 benefits__item">
                <div class="benefits__icon">
                    <i class="fa fa-bolt" aria-hidden="true"></i>
                </div>
                <h6><?= MgHelpers::getSetting('HP - benefits - 1 header ' . Yii::$app->language,false, 'HP - benefits - 1 header')?></h6>
                <p>
                    <?= MgHelpers::getSetting('HP - benefits - 1 text ' . Yii::$app->language, false, 'HP - benefits - 1 text')?>
                </p>
            </div>
            <div class="col-md-3 col-sm-6 benefits__item">
                <div class="benefits__icon">
                    <i class="fa fa-link" aria-hidden="true"></i>
                </div>
                <h6><?= MgHelpers::getSetting('HP - benefits - 2 header ' . Yii::$app->language,false, 'HP - benefits - 2 header')?></h6>
                <p>
                    <?= MgHelpers::getSetting('HP - benefits - 2 text ' . Yii::$app->language, false, 'HP - benefits - 2 text')?>
                </p>
            </div>
            <div class="col-md-3 col-sm-6 benefits__item">
                <div class="benefits__icon">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </div>
                <h6><?= MgHelpers::getSetting('HP - benefits - 3 header ' . Yii::$app->language,false, 'HP - benefits - 3 header')?></h6>
                <p>
                    <?= MgHelpers::getSetting('HP - benefits - 3 text ' . Yii::$app->language, false, 'HP - benefits - 3 text')?>
                </p>
            </div>
            <div class="col-md-3 col-sm-6 benefits__item">
                <div class="benefits__icon">
                    <i class="fa fa-calendar-o" aria-hidden="true"></i>
                </div>
                <h6><?= MgHelpers::getSetting('HP - benefits - 4 header ' . Yii::$app->language,false, 'HP - benefits - 4 header')?></h6>
                <p>
                    <?= MgHelpers::getSetting('HP - benefits - 4 text ' . Yii::$app->language, false, 'HP - benefits - 4 text')?>
                </p>
            </div>
        </div>
    </div>
</section>
