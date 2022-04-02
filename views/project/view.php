<?php
/* @var $model app\models\mgcms\db\Project */
/* @var $form app\components\mgcms\yii\ActiveForm */

/* @var $this yii\web\View */
/* @var $subscribeForm \app\models\SubscribeForm */

use app\components\mgcms\MgHelpers;
use yii\web\View;
use yii\helpers\Url;
use yii\bootstrap\ActiveForm;


$this->title = $model->name;
$model->language = Yii::$app->language;
if (!$model->money_full) {
    return false;
}

$index = 0;
?>
<style>
    .Project__content {
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: var(--grid);
        grid-template-columns: var(--grid);
        grid-column-gap: var(--gap);
        margin-bottom: 30px;
    }

    .Project__info {
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: 1fr 300px;
        grid-template-columns: 1fr 300px;
        grid-column-gap: var(--gap);
        grid-row-gap: var(--gap);
    }

    .List-custm__checklist__item:before {
        content: '';
        width: var(--size);
        height: var(--size);
        background: #dbe3e9;
        border-radius: 3px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .List-custm__checklist__item:after {
        content: '\2713';
        width: var(--size);
        height: var(--size);
        color: #35a1d9;
        position: absolute;
        font-size: 30px;
        left: 0%;
        font-weight: bold;
        top: 0%;
        display: -ms-grid;
        display: grid;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
    }

    .Section strong {
        color: inherit;
    }
</style
>
<?= $this->render('/common/breadcrumps') ?>

<section class="Section Project">
    <div class="container">
        <h1 class="text-center"><?= $model->name ?></h1>
        <div class="Project__content">
            <div class="Project__info__content">
                <?= $this->render('view/table', ['model' => $model]) ?>

                <div class="Invest-counter">
                    <div class="Invest-counter__header">
                        <div class="Invest-counter__source">
                        <span class="Invest-counter__source__value"
                        ><?= $model->money ?> PLN</span
                        >
                            (<span
                                    data-to="<?= round(($model->money / $model->money_full) * 100, 3) ?>"
                                    class="Invest-counter__source__percent"
                            >0</span
                            >%)
                        </div>
                        <div class="Invest-counter__target">
                            cel: <?= MgHelpers::convertNumberToNiceString((int)($model->money_full)) ?> PLN
                        </div>
                    </div>
                    <div class="Invest-counter__value-line-wrapper">
                        <div
                                data-to="<?= $model->money ?>"
                                data-slide-to="<?= round(($model->money / $model->money_full) * 100, 3) ?>"
                                class="Invest-counter__value-line"
                                style="width: 0%"
                        ></div>
                    </div>

                    <div class="Invest-counter__body">
                        <div class="Invest-counter__body__heading">
                            <?= Yii::t('db', 'Time left'); ?>:
                        </div>
                        <div
                                data-date="<?= $model->date_crowdsale_end ?>"
                                class="Count-down-timer"
                        >
                            <div class="Count-down-timer__day">
                                <span></span> <?= Yii::t('db', 'days'); ?>
                            </div>
                            <div class="Count-down-timer__hour">
                                <span></span> <?= Yii::t('db', 'hours'); ?>
                            </div>
                            <div class="Count-down-timer__minute">
                                <span></span> <?= Yii::t('db', 'minutes'); ?>
                            </div>
                            <div class="Count-down-timer__second">
                                <span></span> <?= Yii::t('db', 'seconds'); ?>
                            </div>
                        </div>
                    </div>
                </div>
 <div>
<center><a class="btn btn-success btn--medium"
                       href="<?= Url::to(['project/buy', 'id' => $model->id]) ?>"><?= Yii::t('db', 'INVEST'); ?></a></center>
</div><br>
                <center><b><?= Yii::t('db', 'Files to download'); ?></b></center>
                <div>
                    <? foreach ($model->fileRelations as $fileRelation): ?>
                        <? if ($fileRelation->json != '1' || !$fileRelation->file) continue ?>
                        <a class="Project__file" href="<?= $fileRelation->file->linkUrl ?>" target="_blank">
                            <?= $fileRelation->file->origin_name ?>
                            <div class="Project__file__ico">
                                <img src="/svg/pdf.svg" alt=""/>
                            </div>
                        </a>
                    <? endforeach; ?>

                </div>
            </div>
            <div class="Project__info">
                <div class="Project__gallery__photo">
                    <? if ($model->file && $model->file->isImage()): ?>
                        <a href="<?= $model->file->getImageSrc() ?>">
                            <img src="<?= $model->file->getImageSrc(560, 410) ?>" class="Project__photo"/>
                        </a>
                    <? endif ?>

                </div>
                <div class="Project__slider">
                    <div class="owl-carousel Gallery__wrapper">
                        <? foreach ($model->files as $file): ?>
                            <? if ($file->isImage()): $index++; ?>
                                <a
                                        class="item"
                                        href="<?= $file->getImageSrc() ?>"
                                        style="background-image: url(<?= $file->getImageSrc(560, 410) ?>)">
                                </a>
                            <? endif; ?>
                        <? endforeach; ?>

                    </div>
                </div>
                <div class="Project__map" id="map"></div>
            </div>
        </div>

        <?= $model->text ?>

        <?= $this->render('view/bonuses', ['model' => $model]) ?>

        <div class="container">
            <div class="text-center">


                <? if ($model->status == \app\models\mgcms\db\Project::STATUS_ACTIVE): ?>
                    <a class="btn btn-success btn--medium"
                       href="<?= Url::to(['project/buy', 'id' => $model->id]) ?>"><?= Yii::t('db', 'INVEST'); ?></a>
                <? endif; ?>
                <? if ($model->status == \app\models\mgcms\db\Project::STATUS_PLANNED): ?>

                    <?php
                    $form = ActiveForm::begin([
                        'id' => 'login-form',
                    ]);

                    ?>


                    <div class="User-Panel__form-group offset-3 col-md-6" style="display: block">
                        <?= $form->field($subscribeForm, 'email')->textInput(['placeholder' => $model->getAttributeLabel('email')])->label(false) ?>
                    </div>
                    <div class="User-Panel__form-group offset-3 col-md-6" style="display: block">
                        <?= $form->field($subscribeForm, 'acceptTerms',
                            [
                                'options' => [
                                    'class' => "Form__group form-group",
                                ],
                                'checkboxTemplate' => "{input}\n{label}\n{error}",
                            ]
                        )->checkbox(['class' => 'Form__checkbox' , 'label'=> '<label for="subscribeform-acceptterms">'.$subscribeForm->getAttributeLabel('acceptTerms').'</label>']) ?>
                        <?= $form->field($subscribeForm, 'reCaptcha')->widget(
                            \himiklab\yii2\recaptcha\ReCaptcha::className(),
                            ['siteKey' => MgHelpers::getConfigParam('recaptcha')['siteKey']]
                        )->label(false) ?>
                    </div>


                <div class="User-Panel__form-group">
                    <label class="Contact-form__label field-user-first_name">
                    </label>
                    <div class="text-center">
                        <input
                                type="submit"
                                class="Contact-form__submit btn btn-primary btn-block"
                                value="<?= Yii::t('db', 'Subscribe'); ?>"
                        />
                    </div>
                </div>


                    <?php ActiveForm::end(); ?>
                <? endif; ?>
            </div>
            <?= $this->render('view/bottomInfoBar') ?>
        </div>


    </div>
</section>

<section
        class="Section Projects animatedParent Projects--disabledBg"
        style="padding-bottom: 65px"
>
    <div class="container fadeIn animated">
        <h1 class="text-center"><?= Yii::t('db', 'See also'); ?></h1>

        <?= $this->render('/common/projects') ?>
</section>
<?= $this->render('view/script', ['model' => $model]) ?>
