<?php
/* @var $this yii\web\View */

/* @var $model \app\models\ReportRealEstateForm */

use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use app\components\mgcms\MgHelpers;

$this->title = MgHelpers::getSettingTranslated('real_estate_report_header', 'Real estate report');


?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--big-padding-top Contact animatedParent">
    <div class="container fadeIn animated">
        <div class="text-center"><b><?= Yii::t('db', 'Real estate report'); ?></b></div>

        <div class="row">
            <div class="col-lg-12" style="padding-left: 0">
                <div class="Contact-form">


                    <?php
                    $form = ActiveForm::begin([
                        'id' => 'contact-form',
                        'fieldConfig' => \app\components\ProjectHelper::getFormFieldConfig(false)
                    ]);

                    echo $form->errorSummary($model);
                    ?>
                    <h3><?= Yii::t('db', 'Borrower\'s details'); ?></h3>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'name')->textInput(['placeholder' => $model->getAttributeLabel('name')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'nip')->textInput(['placeholder' => $model->getAttributeLabel('nip')]) ?>
                    </div>

                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'pesel')->textInput(['placeholder' => $model->getAttributeLabel('pesel')]) ?>
                    </div>

                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'phone')->textInput(['placeholder' => $model->getAttributeLabel('phone')]) ?>
                    </div>

                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'email')->textInput(['placeholder' => $model->getAttributeLabel('email'), 'type' => 'email']) ?>
                    </div>


                    <h3><?= Yii::t('db', 'Investition details'); ?></h3>

                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'localization')->textInput(['placeholder' => $model->getAttributeLabel('localization')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'estateType')->textInput(['placeholder' => $model->getAttributeLabel('estateType')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'financePlan')->textInput(['placeholder' => $model->getAttributeLabel('financePlan')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'campaignTime')->textInput(['placeholder' => $model->getAttributeLabel('campaignTime')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'minimalLoanAmount')->textInput(['placeholder' => $model->getAttributeLabel('minimalLoanAmount')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'maximalLoanAmount')->textInput(['placeholder' => $model->getAttributeLabel('maximalLoanAmount')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'intrestRate')->textInput(['placeholder' => $model->getAttributeLabel('intrestRate')]) ?>
                    </div>
                    <div class="Contact-form__form-group form-group">
                        <?= $form->field($model, 'description')->textarea(['placeholder' => $model->getAttributeLabel('description')]) ?>
                    </div>

                    <h3><?= Yii::t('db', 'Required documents'); ?></h3>

                    <div class="Contact-form__form-group form-group">
                        <?= MgHelpers::getSettingTranslated('zglos nieruchomosc tekst przed plikami', 'zglos nieruchomosc tekst przed plikami') ?>
                    </div>
                    <div class="Contact-form__form-group form-group" id="filesUploader">

                        <?= $form
                            ->field($model, 'uploadedFiles[]', ['inputOptions' => ['class' => '']])
                            ->fileInput(['multiple' => true, 'accept' => 'image/*,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document']); ?>
                    </div>


                    <div id="uploaderPlaceholder"></div>
                    <button type="button" class="btn btn-success" style="margin-top: 10px;" onclick="addUploader()"><?= Yii::t('db', 'Add another file'); ?></button>

                    <br/> <br/>

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


<script>
function addUploader(){
  $('#filesUploader').clone().appendTo('#uploaderPlaceholder');
}

</script>
