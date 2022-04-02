<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */

/* @var $model app\models\RegisterForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use app\components\mgcms\MgHelpers;

$this->title = Yii::t('db', 'Register');
$this->params['breadcrumbs'][] = $this->title;


?>

<?= $this->render('/common/breadcrumps') ?>


<section class="Section Section--white Register animatedParent">
    <div class="container fadeIn animated">
        <h2 class="text-center">
            <?= Yii::t('db', 'Provide Your information to register account'); ?>
        </h2>
        <div class="User-Panel__form User-Panel__form--block">
            <div>
                <?php
                $form = ActiveForm::begin([
                    'id' => 'login-form',
                    'class' => 'fadeInUpShort animated delay-250',
                    'fieldConfig' => \app\components\ProjectHelper::getFormFieldConfig()
                ]);

                //          echo $form->errorSummary($model);
                ?>
                <div class="User-Panel__form-group">
                    <?= $form->field($model, 'firstName')->textInput(['placeholder' => ' ']) ?>
                    <?= $form->field($model, 'surname')->textInput(['placeholder' => ' ']) ?>
                </div>
                <div class="User-Panel__form-group">
                    <?= $form->field($model, 'username')->textInput(['placeholder' => ' ']) ?>
                    <?= $form->field($model, 'phone')->textInput(['placeholder' => ' ']) ?>
                </div>
                <div class="User-Panel__form-group">
                    <?= $form->field($model, 'password')->passwordInput(['placeholder' => ' ']) ?>
                    <?= $form->field($model, 'passwordRepeat')->passwordInput(['placeholder' => ' ']) ?>
                </div>
                <div class="Form__group form-group text-left checkbox">
                    <?= $form->field($model, 'acceptTerms',
                        [
                            'checkboxTemplate' => "{input}\n" . $model->getAttributeLabel('acceptTerms') . "\n{error}",
                        ]
                    )->checkbox() ?>
                </div>


                <div class="text-center">
                    <input
                            style="margin-top: 0;margin-bottom: 35px;"
                            type="submit"
                            class="btn btn-success"
                            value="<?= Yii::t('db', 'REGISTER'); ?>"
                    />
                </div>

                <?php ActiveForm::end(); ?>
            </div>
        </div>
    </div>
</section>
