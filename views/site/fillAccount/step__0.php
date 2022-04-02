<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */

/* @var $model app\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use app\components\mgcms\MgHelpers;
use yii\authclient\widgets\AuthChoice;


$this->title = Yii::t('db', 'Register');
$this->params['breadcrumbs'][] = $this->title;
$fieldConfig = \app\components\ProjectHelper::getFormFieldConfig(false)

//https://yii2-framework.readthedocs.io/en/stable/guide/security-auth-clients/
?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--big-padding-top Contact fillAccount">
    <div class="container">
        <h1 class="text-center"><?= Yii::t('db', 'Register'); ?></h1>
        <div class="Contact__grid">
            <?= $this->render('steps',['step' => $step]) ?>
            <?php
            $form = ActiveForm::begin([
                'id' => 'login-form',
                'class' => 'fadeInUpShort animated delay-250',
                'fieldConfig' => \app\components\ProjectHelper::getFormFieldConfig()
            ]);

            //          echo $form->errorSummary($model);
            ?>
            <?= $form->field($model, 'type')->hiddenInput()->label(false) ?>
            <div class="buttons">
                <button class="btn btn-default" type="button" data-type="1"> <?= Yii::t('db','A natural person')?> </button>
                <button class="btn btn-default" type="button" data-type="2"> <?= Yii::t('db','Sole proprietorship')?> </button>
                <button class="btn btn-default" type="button" data-type="3"> <?= Yii::t('db','A company')?> </button>
            </div>

            <div class="text-right">
                <button type="submit" class="btn arr-right-blue">
                    <?= Yii::t('db','NEXT')?>
                </button>
            </div>

            <?php ActiveForm::end(); ?>
        </div>
    </div>
</section>


<script>

  $('.buttons .btn').click(function(e){
    $('.buttons .btn').removeClass('btn-success');
    $(this).addClass('btn-success');
    $('#user-type').val($(this).data('type'));
  })
</script>
