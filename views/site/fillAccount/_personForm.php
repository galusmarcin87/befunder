<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \app\models\mgcms\db\User*/


?>
<?= $this->render('_field', ['width' => 6, 'form' => $form, 'model' => $model, 'attribute' => 'first_name', 'required' => true, 'addOpts' => ['disabled' => true]]) ?>
<?= $this->render('_field', ['width' => 6, 'form' => $form, 'model' => $model, 'attribute' => 'last_name', 'required' => true, 'addOpts' => ['disabled' => true]]) ?>

<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'country', 'required' => true, 'addOpts' => ['disabled' => true]]) ?>
<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'postcode', 'required' => true, 'addOpts' => ['disabled' => true]]) ?>
<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'city', 'required' => true, 'addOpts' => ['disabled' => true]]) ?>

<?= $this->render('_field', ['width' => 3, 'form' => $form, 'model' => $model, 'attribute' => 'address', 'required' => true, 'addOpts' => ['disabled' => true]]) ?>



