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
<div class="container navigation">
    <div class="top-pane">
        <div class="row">
            <div class="col-sm-8">
                <div class="social-icons">
                    <? if (MgHelpers::getSetting('facebook url')): ?>
                        <a href="<?= MgHelpers::getSetting('facebook url') ?>" target="_blank">
                            F
                        </a>
                    <? endif ?>
                    <? if (MgHelpers::getSetting('twitter url')): ?>
                        <a href="<?= MgHelpers::getSetting('twitter url') ?>" target="_blank">
                            t
                        </a>
                    <? endif ?>

                    <? if (MgHelpers::getSetting('google plus url')): ?>
                        <a href="<?= MgHelpers::getSetting('google plus url') ?>" target="_blank">
                            G+
                        </a>
                    <? endif ?>
                </div>
            </div>
            <div class="col-sm-4 text-start">
                <div class="action-links">
                    <div>
                        <i class="fa fa-user-o" aria-hidden="true"></i>
                        <? if (Yii::$app->user->isGuest): ?>
                            <a href="<?= yii\helpers\Url::to(['/site/login']) ?>"
                               > <?= Yii::t('db', 'Login'); ?> </a>
                        <? else: ?>
                            <a href="<?= yii\helpers\Url::to(['/site/account']) ?>"
                              > <?= Yii::t('db', 'My account'); ?> </a>
                            <a href="javascript:submitLogoutForm()"
                               "> <?= Yii::t('db', 'Log out'); ?> </a>
                        <? endif; ?>

                        <div class="nav-item dropdown inlineBlock languageSwitcher">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <?= strtoupper(Yii::$app->language) ?>
                            </a>
                            <ul class="dropdown-menu minWidthAuto" aria-labelledby="navbarDropdown">
                                <? foreach (Yii::$app->params['languagesDisplay'] as $language) : ?>
                                    <a class="dropdown-item" href="<?= yii\helpers\Url::to(['/', 'language' => $language]) ?>"><?= strtoupper($language) ?></a>
                                <? endforeach ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <nav class="menu">
        <a href="/">
            <img src="/svg/logo.svg" class="logo" alt=""/>
        </a>
        <ul>
            <? foreach ($menu->getItems() as $item): ?>
                <li>
                    <? if (isset($item['url'])): ?>
                        <a href="<?= \yii\helpers\Url::to($item['url']) ?>"
                           ><?= $item['label'] ?></a>
                    <? endif ?>
                </li>
            <? endforeach ?>

        </ul>
    </nav>
</div>



<?= Html::beginForm(['/site/logout'], 'post', ['id' => 'logoutForm']) ?>
<?= Html::endForm() ?>
<script type="text/javascript">
  function submitLogoutForm () {
    $('#logoutForm').submit();
  }
</script>




