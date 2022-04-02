<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \app\models\mgcms\db\User*/


?>
<?= $this->render('_field', ['width' => 6, 'form' => $form, 'model' => $model, 'attribute' => 'cor_first_name', 'required' => $model->is_corespondence]) ?>
<?= $this->render('_field', ['width' => 6, 'form' => $form, 'model' => $model, 'attribute' => 'cor_last_name', 'required' => $model->is_corespondence]) ?>

<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'cor_country', 'required' => $model->is_corespondence]) ?>
<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'cor_postcode', 'required' => $model->is_corespondence]) ?>
<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'cor_city', 'required' => $model->is_corespondence]) ?>

<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'cor_street', 'required' => $model->is_corespondence]) ?>
<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'cor_house_no', 'required' => $model->is_corespondence]) ?>
<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'cor_flat_no', 'required' => $model->is_corespondence]) ?>
