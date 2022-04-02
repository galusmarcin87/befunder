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
            <h3><?= Yii::t('db', 'Company') ?></h3>

            <div class="row">
                <?= $this->render('_field', ['width' => 6, 'form' => $form, 'model' => $model, 'attribute' => 'company_name', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 6, 'form' => $form, 'model' => $model, 'attribute' => 'company_nip', 'required' => true]) ?>

                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_regon', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_country', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_voivodeship', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_postcode', 'required' => true]) ?>

                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_city', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_street', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_house_no', 'required' => true]) ?>
                <?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'company_flat_no', 'required' => true]) ?>
            </div>

            <h3><?= Yii::t('db', 'Contact person') ?></h3>
            <div class="row">
                <?= $this->render('_personForm', ['form' => $form, 'model' => $model]) ?>
            </div>

            <div class="row top10">
                <div class="Form__group form-group text-left col-md-12">
                    <input type="hidden" name="User[is_corespondence]" value="0">
                    <input
                            name="User[is_corespondence]"
                            class="Form__checkbox"
                            type="checkbox"
                            id="is_corespondence"
                            value="1"
                        <?= $model->is_corespondence ? 'checked' : '' ?>
                    />
                    <label for="is_corespondence"> <?= Yii::t('db', 'Another address for correspondence'); ?> </label>
                </div>
            </div>

            <div class="row isCorrespondenceWrapper <?= $model->is_corespondence ? '' : 'hidden' ?>">
                <?= $this->render('_corespondenceForm', ['form' => $form, 'model' => $model]) ?>
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
                            <?= Yii::t('db', 'NEXT') ?>
                        </button>
                    </div>
                </div>
            </div>

            <?php ActiveForm::end(); ?>
        </div>
    </div>
</section>


<script>

  $('#is_corespondence').change(function (e) {
    if ($(this).is(':checked')) {
      $('.isCorrespondenceWrapper').removeClass('hidden');
      $('.isCorrespondenceWrapper input').each(function () {
        $(this).attr('required', 1);
      });
    }
    else {
      $('.isCorrespondenceWrapper').addClass('hidden');
      $('.isCorrespondenceWrapper input').each(function () {
        $(this).attr('required', false);
      });
    }
  });
</script>
