<?
/* @var $this yii\web\View */


use app\components\mgcms\MgHelpers;
use yii\web\View;


?>


<div class="Owner">
    <h3 class="Header-icon">
        <?= Yii::t('db', 'Founder'); ?>
        <img class="Header-icon__icon" src="/svg/znaczek.svg" alt=""/>
    </h3>
    <div class="row">
        <div class="col-lg-7">
            <div class="Owner__block">
                <img class="Image--rounded"
                     src="<?= MgHelpers::getSetting('home - tworca zdjecie', false, '/img/0.jfif') ?>" alt=""/>
                <div>
                    <div class="Header--big">
                        <?= MgHelpers::getSetting('home - tworca nazwa', false, 'Maciej<br />Konieczny') ?>

                    </div>
                    <p class="Owner__desc">
                        <?= MgHelpers::getSettingTypeText('Home tworca text ' . Yii::$app->language, false, 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                                odit aut fugit, sed quia consequuntur magni dolores eos qui
                                ratione voluptatem sequi nesciunt. Neque porro.') ?>

                    </p>
                </div>
            </div>
        </div>
        <div class="col-lg-5 text-right">
            <div class="buttons-list">
                <a
                        class="btn btn-small btn-primary--reverse"
                        href="phone:<?= MgHelpers::getSetting('home - tworca telefon', false, '+48 784 112 895') ?>"
                >
                    <img
                            class="buttons-list__icon"
                            src="/svg/telefon.svg"
                            alt=""
                    />
                    <?= MgHelpers::getSetting('home - tworca telefon', false, '+48 784 112 895') ?></a
                >
                <a
                        class="btn btn-small btn-primary--reverse"
                        href="mailto:<?= MgHelpers::getSetting('home - tworca email', false, 'm.konieczny@nolgroup.pl') ?>"
                >
                    <img
                            class="buttons-list__icon"
                            src="/svg/email.svg"
                            alt=""
                    />
                    <?= MgHelpers::getSetting('home - tworca email', false, 'm.konieczny@nolgroup.pl') ?></a
                >
                <a
                        class="btn btn-small btn-primary--reverse"
                        href="<?= MgHelpers::getSetting('home - tworca linkedin', false, 'https://linkedin.pl/nolrestaurant') ?>"
                >
                    <img
                            class="buttons-list__icon"
                            src="/svg/linkedin.svg"
                            alt=""
                    />
                    <?= MgHelpers::getSetting('home - tworca linkedin label', false, 'linkedin.pl/nolrestaurant') ?></a
                >
            </div>
        </div>
    </div>
</div>