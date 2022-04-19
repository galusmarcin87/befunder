<?php
/* @var $this yii\web\View */

/* @var $model \app\models\ContactForm */

use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use app\components\mgcms\MgHelpers;

$this->title = MgHelpers::getSettingTranslated('contact_header', 'Contact');


?>

<section class="contact">
    <div class="container">
        <div id="MAP" class="contact__map"></div>
        <?php
        $form = ActiveForm::begin([
            'id' => 'contact-form',
            'fieldConfig' => \app\components\ProjectHelper::getFormFieldConfig(false),
            'options' => [
                'class' => 'contact__form'
            ]
        ]);

        //                    echo $form->errorSummary($model);
        ?>
        <h4><?= Yii::t('db', 'Contact form') ?></h4>

        <?= $form->field($model, 'name')->textInput(['placeholder' => $model->getAttributeLabel('name')]) ?>

        <?= $form->field($model, 'email')->textInput(['placeholder' => $model->getAttributeLabel('email')]) ?>


        <?= $form->field($model, 'body')->textarea(['placeholder' => $model->getAttributeLabel('body'), 'rows' => 4]) ?>


        <input class="button" type="submit" value="<?= Yii::t('db', 'Send') ?>"/>
        <?php ActiveForm::end(); ?>
    </div>
    <?= $this->render('contact/script') ?>
</section>




