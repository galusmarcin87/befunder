<?

use app\widgets\NobleMenu;
use yii\helpers\Html;
use app\components\mgcms\MgHelpers;
use yii\bootstrap\ActiveForm;

$menu = new NobleMenu(['name' => 'footer_' . Yii::$app->language, 'loginLink' => false]);
$menu2 = new NobleMenu(['name' => 'footer2_' . Yii::$app->language, 'loginLink' => false]);

?>

<div class="Scroll-up">
    <i class="fa fa-chevron-up" aria-hidden="true"></i>
</div>
<footer>
    <div class="Footer animatedParent">
        <div class="container fadeIn animated">
            <div class="Footer__header"><?= Yii::t('db', 'Contact with us'); ?></div>
            <div class="Footer__top">
                <div class="row">
                    <div class="col-md-3">
                        <?= Yii::t('db', 'Phone'); ?>
                        <? $phone = MgHelpers::getSetting('footer phone', false, '+22 900 121 212') ?>
                        <a class="Footer__top__desc" href="tel:<?= str_replace(' ', '', $phone) ?>">
                            <?= $phone ?>
                        </a>
                    </div>
                    <div class="col-md-3">
                        <?= Yii::t('db', 'Email'); ?>
                        <? $email = MgHelpers::getSetting('footer email', false, 'biuro@piesto.io') ?>
                        <a class="Footer__top__desc" href="mailto:<?= $email ?>">
                            <?= $email ?>
                        </a>
                    </div>
                    <div class="col-md-3">
                        <?= Yii::t('db', 'Address'); ?>
                        <div class="Footer__top__desc">
                            <?= MgHelpers::getSetting('footer address', false, 'Marszałkowska 126/134 <br/>
                            00-008 Warszawa') ?>

                        </div>
                    </div>
                    <div class="col-md-3">
                        <?= Yii::t('db', 'Social media'); ?>
                        <div class="Footer__top__desc">
                            <div class="Social-icons">
                                <? if (MgHelpers::getSetting('facebook url')): ?>
                                    <a href="<?= MgHelpers::getSetting('facebook url') ?>" target="_blank"
                                       class="Social-icons__icon">
                                        <i class="Menu-top__icon fa fa-facebook" aria-hidden="true"></i>
                                    </a>
                                <? endif ?>
                                <? if (MgHelpers::getSetting('youtube url')): ?>
                                    <a href="<?= MgHelpers::getSetting('youtube url') ?>" target="_blank"
                                       class="Social-icons__icon">
                                        <i class="Menu-top__icon fa fa-youtube" aria-hidden="true"></i>
                                    </a>
                                <? endif ?>
                                <? if (MgHelpers::getSetting('twitter url')): ?>
                                    <a href="<?= MgHelpers::getSetting('twitter url') ?>" target="_blank"
                                       class="Social-icons__icon">
                                        <i class="Menu-top__icon fa fa-twitter" aria-hidden="true"></i>
                                    </a>
                                <? endif ?>
                                <? if (MgHelpers::getSetting('linkedin url')): ?>
                                    <a href="<?= MgHelpers::getSetting('linkedin url') ?>" target="_blank"
                                       class="Social-icons__icon">
                                        <i class="Menu-top__icon fa fa-linkedin" aria-hidden="true"></i>
                                    </a>
                                <? endif ?>
                                <? if (MgHelpers::getSetting('instagram url')): ?>
                                    <a href="<?= MgHelpers::getSetting('instagram url') ?>" target="_blank"
                                       class="Social-icons__icon">
                                        <img
                                                class="Social-icons__icon__img"
                                                src="/svg/instagram.svg"
                                                alt=""
                                        />
                                    </a>
                                <? endif ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="animatedParent">
                <div class="row">
                    <div class="col-md-3">
                        <div class="Footer__item"><?= Yii::t('db', 'About us'); ?></div>
                        <div class="Footer__desc">
                            <?= MgHelpers::getSetting('footer about us text' . Yii::$app->language, false, 'footer about us text') ?>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="Footer__item"><?= MgHelpers::getSetting('footer menu 1 header ' . Yii::$app->language, false, 'Menu') ?></div>
                        <ul class="Footer__menu fadeIn animated">
                            <? foreach ($menu->getItems() as $item): ?>
                                <li class="Footer__menu__item">
                                    <? if (isset($item['url'])): ?>
                                        <a href="<?= \yii\helpers\Url::to($item['url']) ?>"
                                           class="Footer__menu__link <? if (isset($item['active']) && $item['active']): ?>Footer__menu__link--active<? endif ?>"><?= $item['label'] ?></a>
                                    <? endif ?>
                                </li>
                            <? endforeach ?>
                        </ul>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="Footer__item">
                            <?= MgHelpers::getSetting('footer menu 2 header ' . Yii::$app->language, false, 'Menu') ?>
                            <ul class="Footer__menu fadeIn animated">
                                <? foreach ($menu2->getItems() as $item): ?>
                                    <li class="Footer__menu__item">
                                        <? if (isset($item['url'])): ?>
                                            <a href="<?= \yii\helpers\Url::to($item['url']) ?>"
                                               class="Footer__menu__link <? if (isset($item['active']) && $item['active']): ?>Footer__menu__link--active<? endif ?>"><?= $item['label'] ?></a>
                                        <? endif ?>
                                    </li>
                                <? endforeach ?>

                            </ul>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="Footer__item">
                            <?= MgHelpers::getSettingTranslated('footer newsletter header',  'Sygnalizator inwestora') ?>

                            <div class="Newsletter animatedParent">
                                <br/>
                                <?= MgHelpers::getSettingTranslated('footer newsletter text',  'Zapisz się i bądź na bieżąco') ?>

                                <?php $form = ActiveForm::begin(['id' => 'newsletter-form', 'class' => 'fadeIn animated']); ?>
                                    <div class="Newsletter__inner">
                                        <div class="Form__group form-group">
                                            <input
                                                    class="Form__input form-control"
                                                    placeholder="&nbsp;"
                                                    id="phone"
                                                    name="newsletterEmail"
                                                    type="phone"
                                                    required
                                            />
                                            <label class="Form__label"><?= Yii::t('db', 'Your email'); ?></label>
                                        </div>
                                    </div>
                                    <input
                                            class="btn btn-success lowercase Newsletter__button"
                                            type="submit"
                                            value="<?= Yii::t('db', 'Subscribe'); ?>"
                                    />
                                <?php ActiveForm::end(); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="animatedParent Footer__bottom">
                <div class="fadeIn animated">
                    <div class="row">
                        <div class="col-md-6">

                            <p><?= MgHelpers::getSettingTranslated('footer copyright',  '&#169; 2020 Wszelkie prawa zastrzeżone - Piesto.io Sp. z o.o.') ?></p>
                        </div>
                        <div class="col-md-6 text-right">
                            <p>

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>

