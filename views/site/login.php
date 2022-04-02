<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */

/* @var $model app\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use app\components\mgcms\MgHelpers;
use yii\authclient\widgets\AuthChoice;


$this->title = Yii::t('db', 'Log in');
$this->params['breadcrumbs'][] = $this->title;
$fieldConfig = \app\components\ProjectHelper::getFormFieldConfig(false)

//https://yii2-framework.readthedocs.io/en/stable/guide/security-auth-clients/
?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--big-padding-top Contact">
    <div class="container">
        <h1 class="text-center"><?= Yii::t('db', 'Log in / register'); ?></h1>
        <div class="Contact__grid">
            <div class="Contact-form">
                <?php
                $form = ActiveForm::begin([
                    'id' => 'login-form',
                    'fieldConfig' => $fieldConfig
                ]);

                echo $form->errorSummary($model);
                ?>
                <div class="Contact-form__header">
                    <?= Yii::t('db', 'Login'); ?>
                </div>
                <div class="Contact-form__form-group form-group">
                    <?= $form->field($model, 'username')->textInput(['type' => 'text', 'required' => true, 'placeholder' => $model->getAttributeLabel('username')]) ?>
                </div>

                <div class="Contact-form__form-group form-group">
                    <?= $form->field($model, 'password')->passwordInput(['required' => true, 'placeholder' => $model->getAttributeLabel('password')]) ?>
                </div>

                <div class="Form__group form-group text-left">
                    <input type="hidden" name="LoginForm[rememberMe]" value="0">
                    <input
                            name="LoginForm[rememberMe]"
                            class="Form__checkbox"
                            type="checkbox"
                            id="rememberMe"
                            value="1"
                            checked
                            required
                    />
                    <label for="rememberMe"> <?= Yii::t('db', 'Remember me'); ?> </label>
                    <?= Html::a(Yii::t('db', 'Forgotten password?'), ['site/forgot-password'], ['class' => 'Contact__remember-password pull-right']) ?>

                </div>


                <div class="text-center">
                    <input
                            style="margin-top: 117px !important"
                            type="submit"
                            class="Contact-form__submit btn btn-success btn-block"
                            value="<?= Yii::t('db', 'Log in'); ?>"
                    />
                </div>

                <?php ActiveForm::end(); ?>
            </div>
            <div class="Contact-form">
                <?php
                $form = ActiveForm::begin([
                    'id' => 'login-form',
                    'fieldConfig' => $fieldConfig
                ]);


                ?>
                    <div class="Contact-form__header">
                        <?= Yii::t('db', 'Register of account'); ?>
                    </div>
                <? //echo $form->errorSummary($modelRegister);?>
                <div class="Contact-form__form-group form-group">
                    <?= $form->field($modelRegister, 'firstName')->textInput(['required' => true, 'placeholder' => $modelRegister->getAttributeLabel('firstName')]) ?>
                </div>
                <div class="Contact-form__form-group form-group">
                    <?= $form->field($modelRegister, 'surname')->textInput(['required' => true, 'placeholder' => $modelRegister->getAttributeLabel('surname')]) ?>
                </div>
                <div class="Contact-form__form-group form-group">
                    <?= $form->field($modelRegister, 'username')->textInput(['type' => 'email', 'required' => true, 'placeholder' => $modelRegister->getAttributeLabel('username')]) ?>
                </div>
                <div class="Contact-form__form-group form-group">
                    <?= $form->field($modelRegister, 'password')->passwordInput(['required' => true, 'placeholder' => $modelRegister->getAttributeLabel('password')]) ?>

                </div>
                <div class="Contact-form__form-group form-group">
                    <?= $form->field($modelRegister, 'passwordRepeat')->passwordInput(['required' => true, 'placeholder' => $modelRegister->getAttributeLabel('passwordRepeat')]) ?>
                </div>
                <?= $this->render('login/acceptCheckbox',['number' => '','form'=> $form, 'modelRegister' => $modelRegister])?>
                <?= $this->render('login/acceptCheckbox',['number' => 2,'form'=> $form, 'modelRegister' => $modelRegister])?>
                <?= $this->render('login/acceptCheckbox',['number' => 3,'form'=> $form, 'modelRegister' => $modelRegister])?>
                <?= $this->render('login/acceptCheckbox',['number' => 4,'form'=> $form, 'modelRegister' => $modelRegister])?>
                <?= $this->render('login/acceptCheckbox',['number' => 5,'form'=> $form, 'modelRegister' => $modelRegister, 'required' => false])?>
                <?= $this->render('login/acceptCheckbox',['number' => 6,'form'=> $form, 'modelRegister' => $modelRegister, 'required' => false])?>



                    <div class="text-center">
                        <input
                                type="submit"
                                onclick="return checkTerms()"
                                class="Contact-form__submit btn btn-success btn-block"
                                value="<?= Yii::t('db', 'Register'); ?>"
                        />
                    </div>

                <?php ActiveForm::end(); ?>
            </div>
        </div>
    </div>
</section>

<script>
    function checkTerms(){
      const reqTerms = ['acceptTerms','acceptTerms2', 'acceptTerms3', 'acceptTerms4'];
      let alertSent = false;
      for(var i = 0; i < reqTerms.length; i++){
        if(!$('.Form__checkbox[name="RegisterForm['+reqTerms[i]+']"]').is(':checked') && !alertSent){
          alertSent = true;
          alert('Zaznacz wymagane zgody');
        }
      }
    }
</script>
