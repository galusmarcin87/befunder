<?php
/* @var $model app\models\mgcms\db\Project */

/* @var $this yii\web\View */

use app\components\mgcms\MgHelpers;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use yii\web\View;

/* @var $project app\models\mgcms\db\Project */
/* @var $form app\components\mgcms\yii\ActiveForm */
$this->title = Yii::t('db', 'Invest');
$model = $project;
?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--big-padding-top Contact fillAccount">
    <div class="container">
        <h1 class="text-center">
            <?= Yii::t('db', 'Invest') ?>
        </h1>
        <div class="Contact__grid">

            <h3>
                <?= Yii::t('db', 'You invest in project'); ?> <?= $project ?>&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="<?= $project->linkUrl ?>" target="_blank"
                   class="btn btn-success"><?= Yii::t('db', 'Link to investition') ?></a>
            </h3>

            <?php
            $form = ActiveForm::begin([
                'id' => 'login-form',
            ]);

            ?>
            <div class="row">
                <div class="col-md-6">
                    <ul class="List-custom__two">
                        <li class="List-custom__two__item">
                            <span>
                              <?= Yii::t('db', 'Investition'); ?>:
                            </span>
                            <span>
                              <strong> <?= $model->investition_time ?> </strong>
                            </span>
                        </li>

                        <li class="List-custom__two__item">
                            <span>
                              <?= Yii::t('db', 'Crowdsale profit'); ?>:
                            </span>
                            <span>
                              <strong>
                                <?= $model->date_realization_profit ?>
                              </strong>
                            </span>
                        </li>

                        <li class="List-custom__two__item">
                            <span>
                              <?= Yii::t('db', 'Invested amount (PLN)'); ?>:
                            </span>
                            <span>
                              <strong>
                                <?= number_format($amount,2,'.',' ') ?> PLN 
                              </strong>
                            </span>
                        </li>

                        <li class="List-custom__two__item">
                            <span>
                              <?= Yii::t('db', 'Offered'); ?>:
                            </span>
                            <span>
                              <strong> <?= $model->percentage ?>% </strong>
                            </span>
                        </li>

                        <li class="List-custom__two__item">
                            <span>
                              <?= Yii::t('db', 'Expected profit'); ?>:
                            </span>
                            <span>
                              <strong> <?=  number_format($amount * ($model->percentage / 100 * $model->investition_time),2,'.',' ') ?> PLN </strong>
                            </span>
                        </li>

                        <li class="List-custom__two__item">
                            <span>
                              <?= Yii::t('db', 'Expected return with profit'); ?>:
                            </span>
                            <span>
                              <strong> <?= number_format($amount * ($model->percentage / 100 * $model->investition_time) + $amount,2,'.',' ') ?> PLN </strong>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>


            <div class="row top10">
                <div class="col-md-12 top10">
                    <div class="form-group text-left">
                        <input type="hidden" name="acceptTerms0" value="0">
                        <input
                                name="acceptTerms0"
                                class="Form__checkbox"
                                type="checkbox"
                                id="agree0"
                                value="1"
                        />
                        <label for="agree0">
                            <?= \app\components\mgcms\MgHelpers::getSettingTranslated('buy_accept_term_1', ' buy_accept_term_1') ?>
                        </label>
                    </div>

                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <div class="form-group text-left">
                        <input type="hidden" name="acceptTerms1" value="0">
                        <input
                                name="acceptTerms1"
                                class="Form__checkbox"
                                type="checkbox"
                                id="agree1"
                                value="1"
                        />
                        <label for="agree1">
                            <?= \app\components\mgcms\MgHelpers::getSettingTranslated('buy_accept_term_2', ' buy_accept_term_2') ?>
                        </label>
                    </div>

                </div>
            </div>

            <div class="row">
                <div class="col-md-3">
                    <input hidden name="plnToInvest2" value="<?= $amount ?>"/>
                    <a href="javascript:history.back()" class="btn btn-primary btn-block">
                        <?= Yii::t('db', 'Back') ?>
                    </a>

                </div>
                <div class="col-md-3">
                    <input
                            type="submit"
                            class="btn btn-primary btn-block"
                            value="<?= Yii::t('db', 'Invest'); ?>"
                    />
                </div>
            </div>


            <?php ActiveForm::end(); ?>
        </div>
    </div>
</section>


<script>
  $(document).ready(function () {
    var tokenRate = <?=MgHelpers::getSetting('token rate', false, 2)?>;
    $('#tokensToInvest').on('input', function () {
      $('#plnToInvest').val($(this).val() * tokenRate);
    });
  });
</script>
