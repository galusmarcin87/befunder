<?php

use yii\web\View;
use app\components\mgcms\MgHelpers;


/* @var $this yii\web\View */

$this->title = Yii::t('db', 'About our platform');

?>

<?= $this->render('/common/breadcrumps') ?>
    <section class="Section Section--white">
        <div class="container">
            <div class="row animatedParent">
                <div class="col-sm-6 fadeIn animated">
                    <h2>
                        <?= MgHelpers::getSettingTranslated('About platform - main header', 'About platform <br/> header') ?>
                    </h2>
                    <img
                            style="margin-left: -50px;"
                            class="Section__image"
                            src="/images/image_1.png"
                    />
                </div>
                <div
                        class="col-md-6 Section__text fadeIn animated"
                        style="padding-top: 20px;"
                >

                    <?= MgHelpers::getSettingTypeText('About platform - main text '.Yii::$app->language, true,'<p>
                        <strong>
                            Platforma Riva Finance Crowdsale jest innowacyjnym rozwiązaniem
                        </strong>
                        opartym o nowatorską forme crowdfundingu czyli finansowania
                        społęcznościowego zwana crowdsale.
                    </p>
                    <p>
                        <strong>Umożliwia bezpieczne inwestowanie</strong> w nieruchomości
                        z wykorzystaniem smart kontraktów w technologii blockchain - bez
                        kosztownych pośredników, ukrytych probizji i opłat.
                    </p>
                    <p>
                        <small>
                            Jesteś w miejscu, w którym - dzięki tokenizacji nieruchomości -
                            możesz zainwestować przy użyciu tokenów i kryptowalut w dowolną
                            ilość projektów, wybierając je na podstawie dostęnych
                            parametrów, załżeń inwestycyjnych oraz konspektów czyli
                            Whitepaper.
                        </small>
                    </p>
                    <p>
                        <small>
                            Zastosowane rozwiązania wykorzystujące sieć
                            blockchain zapewniają transparentność, prostotę i bezpieczeństwo
                            transakcji oraz dają możliwość szybkiej inwestycji w
                            nieruchomości na całym świecie. Brzmi interesująco?
                        </small>
                    </p>') ?>

                </div>
            </div>
        </div>
    </section>

    <section class="Section Section--white animatedParent">
        <div class="container fadeIn animated">
            <h4><?= MgHelpers::getSettingTranslated('About platform - header 2', 'About platform - header 2') ?></h4>
            <div class="List-grid">
                <div class="List-grid__item">
                    <h6 class="List-grid__item__header"><?= MgHelpers::getSettingTranslated('About platform - title 1', 'About platform - title 1') ?></h6>
                    <?= MgHelpers::getSettingTypeText('About platform - text 1 '.Yii::$app->language, true,'<p>About platform - text  1 lang</p>')?>
                </div>
                <div class="List-grid__item">
                    <h6 class="List-grid__item__header"><?= MgHelpers::getSettingTranslated('About platform - title 2', 'About platform - title 2') ?></h6>
                    <?= MgHelpers::getSettingTypeText('About platform - text 2 '.Yii::$app->language, true,'<p>About platform - text  2 lang</p>')?>
                </div>
                <div class="List-grid__item">
                    <h6 class="List-grid__item__header"><?= MgHelpers::getSettingTranslated('About platform - title 3', 'About platform - title 3') ?></h6>
                    <?= MgHelpers::getSettingTypeText('About platform - text 3 '.Yii::$app->language, true,'<p>About platform - text  3 lang</p>')?>
                </div>

                <div class="List-grid__item">
                    <h6 class="List-grid__item__header"><?= MgHelpers::getSettingTranslated('About platform - title 4', 'About platform - title 4') ?></h6>
                    <?= MgHelpers::getSettingTypeText('About platform - text 4 '.Yii::$app->language, true,'<p>About platform - text  4 lang</p>')?>
                </div>
                <div class="List-grid__item">
                    <h6 class="List-grid__item__header"><?= MgHelpers::getSettingTranslated('About platform - title 5', 'About platform - title 5') ?></h6>
                    <?= MgHelpers::getSettingTypeText('About platform - text 5 '.Yii::$app->language, true,'<p>About platform - text  5 lang</p>')?>
                </div>
                <div class="List-grid__item">
                    <h6 class="List-grid__item__header"><?= MgHelpers::getSettingTranslated('About platform - title 6', 'About platform - title 6' ) ?></h6>
                    <?= MgHelpers::getSettingTypeText('About platform - text 6 '.Yii::$app->language, true,'<p>About platform - text  6 lang</p>')?>
                </div>
            </div>
        </div>
    </section>
    <section class="Section Section--white animatedParent">


<?=$this->render('/common/faq')?>

<?= $this->render('/common/newsletterForm') ?>