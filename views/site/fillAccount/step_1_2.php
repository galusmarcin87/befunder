<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */

/* @var $model \app\models\mgcms\db\User */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use app\components\mgcms\MgHelpers;
use yii\authclient\widgets\AuthChoice;


$this->title = Yii::t('db', 'Register');
$this->params['breadcrumbs'][] = $this->title;
$fieldConfig = \app\components\ProjectHelper::getFormFieldConfig(false);

//https://yii2-framework.readthedocs.io/en/stable/guide/security-auth-clients/
?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--big-padding-top Contact fillAccount">
    <div class="container">
        <h1 class="text-center"><?= Yii::t('db', 'Register'); ?></h1>
        <div class="Contact__grid">
            <?= $this->render('steps', ['step' => $step]) ?>
            <?php
            $form = ActiveForm::begin([
                'id' => 'login-form',
                'class' => 'fadeInUpShort animated delay-250',
                'fieldConfig' => $fieldConfig
            ]);

            //          echo $form->errorSummary($model);
            ?>

            <div class="row">
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'citizenship', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'id_document_type', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'id_document_no', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'pesel', 'required' => true]) ?>


                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'phone', 'required' => true]) ?>

            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="text-left">
                        <a href="<?= \yii\helpers\Url::to(['site/fill-account', 'back' => 1]) ?>"
                           class="btn arr-left-blue" name="back">
                            <?= Yii::t('db', 'BACK') ?>
                        </a>
                    </div>
                </div>


                <div class="col-md-6">
                    <div class="text-right">
                        <button type="submit" class="btn arr-right-blue">
                            <?= Yii::t('db', 'VERIFY MY DATA BY FIBER PAY') ?>
                        </button>
                    </div>
                </div>
            </div>

            <?php ActiveForm::end(); ?>
        </div>
    </div>
</section>
