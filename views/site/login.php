<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */

/* @var $model app\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use app\components\mgcms\MgHelpers;
use yii\authclient\widgets\AuthChoice;
use yii\helpers\Url;


$this->title = Yii::t('db', 'Log in');
$this->params['breadcrumbs'][] = $this->title;
$fieldConfig = \app\components\ProjectHelper::getFormFieldConfig(true);

//https://yii2-framework.readthedocs.io/en/stable/guide/security-auth-clients/
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

                <?= $this->render('login/_buttons')?>
                <?= $form->field($model, 'username')->textInput(['type' => 'text', 'required' => true]) ?>
                <?= $form->field($model, 'password')->textInput(['type' => 'password', 'required' => true]) ?>

                <div class="row">
                    <div class="col-md-6">
                        <input class="button" type="submit" value="<?= Yii::t('db', 'Log in') ?>"/>
                    </div>
                </div>
                <?php ActiveForm::end(); ?>
            </div>
            <?= $this->render('login/_rightColumn')?>
        </div>
    </div>
</section>

