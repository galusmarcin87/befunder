<?

use app\widgets\NobleMenu;
use yii\helpers\Html;
use \app\components\mgcms\MgHelpers;
use yii\helpers\Url;
use yii\bootstrap\ActiveForm;

/* @var $this yii\web\View */

$isHomePage = $this->context->id == 'site' && $this->context->action->id == 'index';

$menu = new NobleMenu(['name' => 'header_' . Yii::$app->language, 'loginLink' => false]);

?>

<div class="Menu-top-wrapper">
    <style>
        .Menu-top__search-btn{
            width: var(--size);
            height: var(--size);
            line-height: var(--size);
        }
    </style>
    <div id="nav-container" class="Menu-top">
        <div class="container">
            <div class="Menu-top__inner">
                <div>
                    <a href="/">
                        <img src="/svg/logo_piesto.svg" alt="" />
                    </a>
                </div>
                <div class="Menu-top__elements">
                    <ul class="Menu-top__list">
                        <? foreach ($menu->getItems() as $item): ?>
                            <li class="<? if (isset($item['active']) && $item['active']): ?>menu__item--current<? endif ?>">
                                <? if (isset($item['url'])): ?>
                                    <a href="<?= \yii\helpers\Url::to($item['url']) ?>"
                                       class="
                                   Menu-top__link
                                   <? if (!$isHomePage || !preg_match('/.*#.*/', $item['url'])): ?>external<? endif ?>
                                   <? if (isset($item['active']) && $item['active']): ?>Menu-top__link--active<? endif ?>
                                "><?= $item['label'] ?></a>
                                <? endif ?>
                            </li>
                        <? endforeach ?>

                    </ul>

                    <? if (Yii::$app->user->isGuest): ?>
                        <a href="<?= yii\helpers\Url::to(['/site/login']) ?>" class="btn btn-default"> <?= Yii::t('db', 'Login'); ?> </a>
                    <? else: ?>
                        <a href="<?= yii\helpers\Url::to(['/site/account']) ?>" class="btn btn-default"> <?= Yii::t('db', 'My account'); ?> </a>
                        <a href="javascript:submitLogoutForm()" class="btn btn-default"> <?= Yii::t('db', 'Log out'); ?> </a>
                    <? endif; ?>

                    <a href="#" class="Menu-top__search-btn d-noned">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </a>
                    <div class="Social-icons">
                        <? if (MgHelpers::getSetting('facebook url')): ?>
                            <a  href="<?= MgHelpers::getSetting('facebook url') ?>" target="_blank" class="Social-icons__icon">
                                <i class="Menu-top__icon fa fa-facebook" aria-hidden="true"></i>
                            </a>
                        <? endif ?>
                        <? if (MgHelpers::getSetting('youtube url')): ?>
                            <a  href="<?= MgHelpers::getSetting('youtube url') ?>" target="_blank" class="Social-icons__icon">
                                <i class="Menu-top__icon fa fa-youtube" aria-hidden="true"></i>
                            </a>
                        <? endif ?>
                        <? if (MgHelpers::getSetting('twitter url')): ?>
                            <a href="<?= MgHelpers::getSetting('twitter url') ?>" target="_blank" class="Social-icons__icon">
                                <i class="Menu-top__icon fa fa-twitter" aria-hidden="true"></i>
                            </a>
                        <? endif ?>
                        <? if (MgHelpers::getSetting('linkedin url')): ?>
                            <a href="<?= MgHelpers::getSetting('linkedin url') ?>" target="_blank" class="Social-icons__icon">
                                <i class="Menu-top__icon fa fa-linkedin" aria-hidden="true"></i>
                            </a>
                        <? endif ?>
                        <? if (MgHelpers::getSetting('instagram url')): ?>
                            <a href="<?= MgHelpers::getSetting('instagram url') ?>" target="_blank" class="Social-icons__icon">
                                <img
                                        class="Social-icons__icon__img"
                                        src="/svg/instagram.svg"
                                        alt=""
                                />
                            </a>
                        <? endif ?>

                    </div>
                    <a href="#" class="Menu-top__toggle-btn">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="Search-box">
            <div class="container">
                <?= Html::beginForm(['/site/search'], 'get') ?>
                    <div class="Search-box__form-wrpper">
                        <input
                                class="Search-box__input Form__input"
                                placeholder="&nbsp;"
                                name="q"
                        />
                        <label class="Form__label" for="phone"
                        ><?= Yii::t('db', 'Enter phrase'); ?></label
                        >
                        <button class="Search-box__submit" type="submit">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </button>
                        <a href="#" class="Search-box__close"> &#215; </a>
                    </div>
                <?= Html::endForm() ?>
            </div>
        </div>
    </div>
    <?= Html::beginForm(['/site/logout'], 'post', ['id' => 'logoutForm']) ?>
    <?= Html::endForm() ?>
    <script type="text/javascript">
      function submitLogoutForm() {
        $('#logoutForm').submit();
      }
    </script>

</div>




