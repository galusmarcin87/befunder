<?
use app\components\mgcms\MgHelpers;


?>


<section
        style="background-image: url(/images/bg_06.jpg)"
        class="Section Section--dark Section--fixed-bg animatedParent"
>
    <div class="container fadeIn animated">
        <div class="row">
            <div class="col-md-6 col-sm-8">
                <h2>
                    <?=MgHelpers::getSettingTranslated('Home - paralax title')?>
                </h2>
                <h6>
                    <?=MgHelpers::getSettingTranslated('Home - paralax text')?>
                </h6>
                <a
                        href="<?=MgHelpers::getSettingTranslated('Home - paralax link')?>"
                        class="btn btn-success btn-success--outline btn-success--reverse-colors"
                ><?= Yii::t('db', 'Find out more'); ?></a
                >
            </div>
            </difv>
        </div>
</section>

