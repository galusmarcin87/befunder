<?

use app\widgets\NobleMenu;
use yii\helpers\Html;
use app\components\mgcms\MgHelpers;
use yii\bootstrap\ActiveForm;

$menu = new NobleMenu(['name' => 'footer_' . Yii::$app->language, 'loginLink' => false]);
$menu2 = new NobleMenu(['name' => 'footer2_' . Yii::$app->language, 'loginLink' => false]);

?>
<footer>
    <div class="container">
        <div class="footer">
            <div class="social-links">
                <? if (MgHelpers::getSetting('facebook url')): ?>
                    <a href="<?= MgHelpers::getSetting('facebook url') ?>">
                        <i class="fa fa-facebook" aria-hidden="true"></i>
                    </a>
                <? endif ?>
                <? if (MgHelpers::getSetting('google plus url')): ?>
                    <a href="<?= MgHelpers::getSetting('google plus url') ?>">
                        <i class="fa fa-google-plus" aria-hidden="true"></i>
                    </a>
                <? endif ?>
                <? if (MgHelpers::getSetting('tumblr url')): ?>
                    <a href="<?= MgHelpers::getSetting('tumblr url') ?>">
                        <i class="fa fa-tumblr" aria-hidden="true"></i>
                    </a>
                <? endif ?>
                <? if (MgHelpers::getSetting('twitter url')): ?>
                    <a href="<?= MgHelpers::getSetting('twitter url') ?>">
                        <i class="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                <? endif ?>
            </div>
            <div class="row">
                <div class="col-md-6">
            <div class="newsletter">
                <h4><?= Yii::t('db', 'newsletter') ?></h4>
                <?php $form = ActiveForm::begin(['id' => 'newsletter-form', 'class' => 'fadeIn animated']); ?>
                <input
                        placeholder="&nbsp;"
                        id="phone"
                        name="newsletterEmail"
                        type="phone"
                        required
                />
                    <button class="button" type="submit"><?= Yii::t('db', 'Subscribe') ?></button>
                <?php ActiveForm::end(); ?>
            </div><br>
				<p class="footer__description">
                <?= MgHelpers::getSetting('footer - left text ' . Yii::$app->language, false, 'footer - left text') ?>
                </p>
                </div>
                <div class="col-md-6">
                    <h4><?= Yii::t('db', 'Contact') ?></h4>
                    <div class="row">
                        <div class="col-sm-6">
                            <p>
                                <?= MgHelpers::getSetting('footer - contact', false, 'footer - contact') ?>
                            </p>
                        </div>
                        <div class="col-sm-6">
							<p>
                            <?= MgHelpers::getSetting('footer - email', false, 'footer - email') ?>
							</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer__menu">
                <div class="row">
                    <div class="col">
                        <h4><?= Yii::t('db', 'MENU') ?></h4>
                    </div>
                    <div class="col">
                        <ul>
                            <? foreach ($menu2->getItems() as $item): ?>
                                <li>
                                    <? if (isset($item['url'])): ?>
                                        <a href="<?= \yii\helpers\Url::to($item['url']) ?>"><?= $item['label'] ?></a>
                                    <? endif ?>
                                </li>
                            <? endforeach ?>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>

