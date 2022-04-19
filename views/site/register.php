<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */

/* @var $model app\models\RegisterForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use app\components\mgcms\MgHelpers;

$this->title = Yii::t('db', 'Register');
$this->params['breadcrumbs'][] = $this->title;
$fieldConfig = \app\components\ProjectHelper::getFormFieldConfig(true);

?>
<section class="login-register">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <?php
                $form = ActiveForm::begin([
                    'id' => 'contact__form',
                    'fieldConfig' => $fieldConfig,
                    'options' => ['class' => 'contact__form']
                ]);

                echo $form->errorSummary($model);
                ?>

                <?= $this->render('login/_buttons') ?>
                <?= $form->field($model, 'username')->textInput(['type' => 'text', 'required' => true]) ?>

                <div class="row">
                    <div class="col-md-6">
                        <?= $form->field($model, 'firstName')->textInput(['type' => 'text', 'required' => true]) ?>
                    </div>
                    <div class="col-md-6">
                        <?= $form->field($model, 'surname')->textInput(['type' => 'text', 'required' => true]) ?>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <?= $form->field($model, 'password')->textInput(['type' => 'password', 'required' => true]) ?>
                    </div>
                    <div class="col-md-6">
                        <?= $form->field($model, 'passwordRepeat')->textInput(['type' => 'password', 'required' => true]) ?>
                    </div>
                </div>
                <div class="row">
                    <label class="check">
                        <input type="hidden" name="RegisterForm[acceptTerms]" value="0">
                        <input type="checkbox" name="RegisterForm[acceptTerms]" value="1"/>
                        <?= $model->getAttributeLabel('acceptTerms') ?>
                    </label>
                    <div class="col-md-6">
                        <input class="button" type="submit" onclick="return checkTerms()" value="<?= Yii::t('db', 'Register') ?>"/>
                    </div>
                </div>
                <?php ActiveForm::end(); ?>
            </div>
            <?= $this->render('login/_rightColumn') ?>
        </div>
    </div>
</section>


<script>
    function checkTerms(){
        const reqTerms = ['acceptTerms'];
        let alertSent = false;
        for(var i = 0; i < reqTerms.length; i++){
            if(!$('[name="RegisterForm['+reqTerms[i]+']"]').is(':checked') && !alertSent){
                alertSent = true;
                alert('<?= Yii::t('db', 'Check required terms') ?>');
            }
        }
    }
</script>
