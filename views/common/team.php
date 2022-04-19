<?

use app\components\mgcms\MgHelpers;
use \app\models\mgcms\db\User;

$teamUsers = User::find()->where(['status' => User::STATUS_INACTIVE, 'role' => 'team'])->all();
if (sizeof($teamUsers) == 0) {
    return false;
}

?>
<section class="team-list-wrapper">
    <div class="container">
        <div class="team text-center">
            <h2><?= Yii::t('db', 'Our team') ?></h2>
            <?= MgHelpers::getSetting('about us team text ' . Yii::$app->language, true, 'about us team text'); ?>
            <div class="team-list">
                <? foreach ($teamUsers as $teamUser): ?>
                    <div class="team-list__item">
                        <? if ($teamUser->file && $teamUser->file->isImage()): ?>
                            <img class="team-list__image" src="<?= $teamUser->file->getImageSrc(185, 204) ?>"/>
                        <? endif ?>

                        <div class="team-list__header"><?= $teamUser->first_name ?> <?= $teamUser->last_name ?>
                        </div>
                        <div class="team-list__sub-header"><?= $teamUser->getModelAttribute('position') ?></div>
                        <div class="social-links">
                            <? if ($teamUser->getModelAttribute('facebook')): ?>
                                <a class="Social-icons__icon" href="<?= $teamUser->getModelAttribute('facebook') ?>">
                                    <i class="fa fa-facebook" aria-hidden="true"></i>
                                </a>
                            <? endif ?>

                            <? if ($teamUser->getModelAttribute('twitter')): ?>
                                <a class="Social-icons__icon" href="<?= $teamUser->getModelAttribute('twitter') ?>">
                                    <i class="fa fa-twitter" aria-hidden="true"></i>
                                </a>
                            <? endif ?>
                            <? if ($teamUser->getModelAttribute('googleplus')): ?>
                                <a class="Social-icons__icon" href="<?= $teamUser->getModelAttribute('googleplus') ?>">
                                    <i class="fa fa-google-plus" aria-hidden="true"></i>
                                </a>
                            <? endif ?>
                            <? if ($teamUser->getModelAttribute('tumblr')): ?>
                                <a class="Social-icons__icon" href="<?= $teamUser->getModelAttribute('tumblr') ?>">
                                    <i class="fa fa-tumblr" aria-hidden="true"></i>
                                </a>
                            <? endif ?>
                        </div>
                    </div>
                <? endforeach; ?>

            </div>
        </div>
    </div>
</section>

