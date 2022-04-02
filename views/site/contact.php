<?php
/* @var $this yii\web\View */

/* @var $model \app\models\ContactForm */

use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use app\components\mgcms\MgHelpers;

$this->title = MgHelpers::getSettingTranslated('contact_header', 'Contact');


?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--big-padding-top Contact animatedParent">
    <div class="container fadeIn animated">
        <div class="text-center"><b><?= Yii::t('db', 'CONTACT'); ?></b></div>
        <h1 class="text-center"><?= Yii::t('db', 'Write or call us'); ?></h1>
        <div class="row">
            <div class="col-lg-6">
                <strong><?= Yii::t('db', 'ADDRESS'); ?></strong>
                <div class="Contact__desc">
                    <?= MgHelpers::getSetting('contact_address', false, 'Marszałkowska 126/134, 00-008 Warszawa') ?>
                </div>
            </div>
            <div class="col-lg-3">
                <strong><?= Yii::t('db', 'PHONE'); ?></strong>
                <div class="Contact__desc">
                    <? $phone = MgHelpers::getSetting('contact_phone', false, '+48 502 502 502') ?>
                    <a href="phone:<?= $phone ?>"> <?= $phone ?></a>
                </div>
            </div>
            <div class="col-lg-3">
                <strong><?= Yii::t('db', 'EMAIL'); ?></strong>
                <? $email = MgHelpers::getSetting('contact_email', false, '+48 502 502 502') ?>
                <div class="Contact__desc">
                    <a href="mailto:<?= $email ?>"><?= $email ?></a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6 Contact__map-wrapper">
                <div id="map" class="Contact__map fadeIn animated"></div>
            </div>
            <div class="col-lg-6" style="padding-left: 0">
                <div class="Contact-form">
                    <h6><?= Yii::t('db', 'WRITE TO US'); ?></h6>
                    <?php
                    $form = ActiveForm::begin([
                        'id' => 'contact-form',
                        'fieldConfig' => \app\components\ProjectHelper::getFormFieldConfig(false)
                    ]);

                    //                    echo $form->errorSummary($model);
                    ?>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'name')->textInput(['placeholder' => $model->getAttributeLabel('name')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'email')->textInput(['placeholder' => $model->getAttributeLabel('email')]) ?>
                    </div>

                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'phone')->textInput(['placeholder' => $model->getAttributeLabel('phone')]) ?>
                    </div>


                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'body')->textarea(['placeholder' => ' ','rows'=>4]) ?>
                    </div>


                    <div class="Form__group form-group checkbox-container">
                        <?= $form->field($model, 'acceptTerms',
                            [
                                'options' => [
                                    'class' => "Form__group form-group",
                                ],
                                'checkboxTemplate' => "{input}\n{label}\n{error}",
                            ]
                        )->checkbox(['class' => 'Form__checkbox']) ?>

                        <?= $form->field($model, 'acceptTerms2',
                            [
                                'options' => [
                                    'class' => "Form__group form-group",
                                ],
                                'checkboxTemplate' => "{input}\n{label}\n{error}",
                            ]
                        )->checkbox(['class' => 'Form__checkbox']) ?>
                        <?= $form->field($model, 'acceptTerms3',
                            [
                                'options' => [
                                    'class' => "Form__group form-group",
                                ],
                                'checkboxTemplate' => "{input}\n{label}\n{error}",
                            ]
                        )->checkbox(['class' => 'Form__checkbox']) ?>
                        <?= $form->field($model, 'acceptTerms4',
                            [
                                'options' => [
                                    'class' => "Form__group form-group",
                                ],
                                'checkboxTemplate' => "{input}\n{label}\n{error}",
                            ]
                        )->checkbox(['class' => 'Form__checkbox']) ?>
                    </div>

                    <?= $form->field($model, 'reCaptcha')->widget(
                        \himiklab\yii2\recaptcha\ReCaptcha::className(),
                        ['siteKey' => MgHelpers::getConfigParam('recaptcha')['siteKey']]
                    ) ?>


                    <div class="text-right">
                        <button
                                type="submit"
                                class="Contact-form__submit btn btn-success btn-block"
                        >
                            <?= Yii::t('db', 'Send message'); ?>
                        </button>
                    </div>
                    <?php ActiveForm::end(); ?>
                </div>
            </div>
        </div>
    </div>
</section>


<?= $this->render('contact/script') ?>

<?= $this->render('/common/team')?>
