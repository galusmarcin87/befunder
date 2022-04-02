<?

use app\models\mgcms\db\Project;
use yii\web\View;
use app\components\mgcms\MgHelpers;

/* @var $this yii\web\View */


?>

<div class="White-text-block">
    <div>
        <h5 class="White-text-block__header">
            <strong><?= MgHelpers::getSettingTranslated('projekt belka dolna nagłowek', 'Masz pytania?') ?></strong><br/>
            <?= MgHelpers::getSettingTranslated('projekt belka dolna text', 'Chętnie odpowiemy.<br/>
                Skontaktuj się z nami.') ?>

        </h5>
    </div>
    <div>
        <div class="White-text-block__subheader"><?= MgHelpers::getSetting('projekt belka dolna imie i nazwisko 1', false, 'Adam Kowalski') ?></div>
        <div class="White-text-block__role">
            <?= MgHelpers::getSetting('projekt belka dolna nazwa 1 ' . Yii::$app->language, false, 'Specjalista ds. inwestycji') ?>
        </div>
        <div class="White-text-block__desc">
            <? $tel = MgHelpers::getSetting('projekt belka dolna tel 1', false, '+48 502 502 502') ?>
            <a href="tel<?= $tel ?>"><?= $tel ?></a>
            <br/>
            <? $email = MgHelpers::getSetting('projekt belka dolna email 1' , false, 'adam.kowalski@piesto.io') ?>
            <a href="mailto:<?=$email?>"
            ><?=$email?></a>
        </div>
    </div>
    <div>
        <div class="White-text-block__subheader"><?= MgHelpers::getSetting('projekt belka dolna imie i nazwisko 2', false, 'Jan Kowalski') ?></div>
        <div class="White-text-block__role">
            <?= MgHelpers::getSetting('projekt belka dolna nazwa 2 ' . Yii::$app->language, false, 'Specjalista ds. inwestycji') ?>
        </div>
        <div class="White-text-block__desc">
            <? $tel = MgHelpers::getSetting('projekt belka dolna tel 2', false, '+48 502 502 502') ?>
            <a href="tel<?= $tel ?>"><?= $tel ?></a>
            <br/>
            <? $email = MgHelpers::getSetting('projekt belka dolna email 2', false, 'jan.kowalski@piesto.io') ?>
            <a href="mailto:<?=$email?>"
            ><?=$email?></a>
        </div>
    </div>
</div>
