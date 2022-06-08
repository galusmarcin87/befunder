<?php
/* @var $this yii\web\View */

/* @var $user \app\models\mgcms\db\User */


use yii\base\BaseObject;
use yii\helpers\Html;
use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Payment;
use kartik\grid\GridView;

$searchModel = new \app\models\mgcms\db\PaymentSearch();
$searchParams = ['PaymentSearch' => ['user_id' => $user->id,'status' => Payment::STATUS_PAYMENT_CONFIRMED]];
$dataProvider = $searchModel->search($searchParams);



?>


<div class="desc">
    <?= count($user->paymentsApproved) ?> <?= Yii::t('db', count($user->paymentsApproved) === 1 ? 'investition' : 'investitions') ?>
    <span class="pull-right">
              <?= Yii::t('db', 'Total amount of funds invested ') ?>: <?= number_format(array_sum(array_column($user->paymentsApproved, 'amount')), 2, '.', ' '); ?> PLN
            </span>
</div>

<div class="payment-grid">
    <?php
    $gridColumn = [
        ['class' => 'yii\grid\SerialColumn'],
        'project.name',
       // 'project.link:raw',
        [
            'attribute' => 'amount',
            'label' => Yii::t('db', 'My investition'),
            'format' => 'numberSeparatedWithSpace'
        ],
        'percentage',
       //'statusToDisplay:raw',
        [
            'attribute' => 'created_on',
            'label' => Yii::t('db', 'Payment date')
        ],
        'project.date_realization_profit',
        //'project.daysLeft',
        //'benefitWithAmount:numberSeparatedWithSpace',
//        [
//            'label' => Yii::t('db', 'Increse investition'),
//            'value' => function ($model, $key, $index, $column) {
//                return Html::a(Yii::t('db', 'invest'), ['project/buy', 'id' => $model->project->id]);
//            },
//            'format' => 'raw'
//        ],
        [
            'class' => 'kartik\grid\ExpandRowColumn',
            'value' => function ($model, $key, $index, $column) {
                return GridView::ROW_COLLAPSED;
            },
            'detail' => function ($model, $key, $index, $column) {
                return Yii::$app->controller->renderPartial('account/_detail', ['model' => $model]);
            },
            'headerOptions' => ['class' => 'kartik-sheet-style'],
            'expandOneOnly' => true,
            'expandIcon' => '<span class="arrowDown"></span>',
            'collapseIcon' => '<span class="arrowUp"></span>',
        ],


    ];

    ?>
    <?=
    GridView::widget([
        'dataProvider' => $dataProvider,
        'columns' => $gridColumn,
        'pjax' => true,
        'pjaxSettings' => ['options' => ['id' => 'kv-pjax-container-payment']],
        'summary' => false,
        'bordered' => false,
        'options' => ['class' => 'mainTable'],
        'striped' => false,
        // your toolbar can include the additional full export menu
    ]);

    ?>

</div>

