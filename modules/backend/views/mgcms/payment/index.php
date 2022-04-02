<?php
/* @var $this yii\web\View */
/* @var $searchModel app\models\mgcms\db\PaymentSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */
use yii\helpers\Html;
use kartik\export\ExportMenu;
use kartik\grid\GridView;
use app\components\mgcms\MgHelpers;

$this->title = Yii::t('app', 'Payments');
$this->params['breadcrumbs'][] = $this->title;
$search = "$('.search-button').click(function(){
	$('.search-form').toggle(1000);
	return false;
});";
$this->registerJs($search);

?>
<div class="payment-index">

  <h1><?= Html::encode($this->title) ?></h1>
  <p>
    <?
    $controller = Yii::$app->controller->id;
    if (\app\components\mgcms\MgHelpers::getUserModel()->checkAccess($controller, 'create')):

      ?>
      <?= Html::a(Yii::t('app', 'Create Payment'), ['create'], ['class' => 'btn btn-success']) ?>
  <? endif ?>
  </p>
  <?php
  $gridColumn = [
      ['class' => 'yii\grid\SerialColumn'],
//        [
//            'class' => 'kartik\grid\ExpandRowColumn',
//            'width' => '50px',
//            'value' => function ($model, $key, $index, $column) {
//                return GridView::ROW_COLLAPSED;
//            },
//            'detail' => function ($model, $key, $index, $column) {
//                return Yii::$app->controller->renderPartial('_expand', ['model' => $model]);
//            },
//            'headerOptions' => ['class' => 'kartik-sheet-style'],
//            'expandOneOnly' => true
//        ],
      ['attribute' => 'id', 'visible' => false],
      'created_on',
      [
          'attribute' => 'project_id',
          'label' => Yii::t('app', 'Project'),
          'value' => function($model) {
            return $model->project->name;
          },
          'filterType' => GridView::FILTER_SELECT2,
          'filter' => \yii\helpers\ArrayHelper::map(\app\models\mgcms\db\Project::find()->asArray()->all(), 'id', 'name'),
          'filterWidgetOptions' => [
              'pluginOptions' => ['allowClear' => true],
          ],
          'filterInputOptions' => ['placeholder' => Yii::t('app', 'Project'), 'id' => 'grid-payment-search-project_id']
      ],
      [
          'attribute' => 'user_id',
          'label' => Yii::t('app', 'User'),
          'value' => function($model) {
            return $model->user->username;
          },
          'filterType' => GridView::FILTER_SELECT2,
          'filter' => \yii\helpers\ArrayHelper::map(\app\models\mgcms\db\User::find()->asArray()->all(), 'id', 'username'),
          'filterWidgetOptions' => [
              'pluginOptions' => ['allowClear' => true],
          ],
          'filterInputOptions' => ['placeholder' => Yii::t('app', 'User'), 'id' => 'grid-payment-search-user_id']
      ],
      'user.first_name',
      'user.last_name',
      'amount',
      [
          'attribute' => 'status',
          'filterType' => GridView::FILTER_SELECT2,
          'value' => function($model) {
            return $model->statusStr;
          },
          'filter' => \app\models\mgcms\db\Payment::STATUSES,
          'filterWidgetOptions' => [
              'pluginOptions' => ['allowClear' => true],
          ],
          'filterInputOptions' => ['placeholder' => Yii::t('app', 'Status')]
      ],
//      'percentage',
//      'is_preico',
//      'user_token',
      [
          'class' => app\components\mgcms\yii\ActionColumn::className(),
          'template' => '{save-as-new} {view} {update} {delete}',
          'buttons' => [
              'save-as-new' => function ($url) {
                return Html::a('<span class="glyphicon glyphicon-copy"></span>', $url, ['title' => 'Save As New']);
              },
          ],
      ],
  ];

  ?>
  <?=
  GridView::widget([
      'dataProvider' => $dataProvider,
      'filterModel' => $searchModel,
      'columns' => $gridColumn,
      'pjax' => true,
      'pjaxSettings' => ['options' => ['id' => 'kv-pjax-container-payment']],
      'panel' => [
          'type' => GridView::TYPE_PRIMARY,
          'heading' => '<span class="glyphicon glyphicon-book"></span>  ' . Html::encode($this->title),
      ],
      // your toolbar can include the additional full export menu
      'toolbar' => [
          '{export}',
          ExportMenu::widget([
              'dataProvider' => $dataProvider,
              'columns' => $gridColumn,
              'target' => ExportMenu::TARGET_BLANK,
              'fontAwesome' => true,
              'dropdownOptions' => [
                  'label' => 'Full',
                  'class' => 'btn btn-default',
                  'itemsBefore' => [
                      '<li class="dropdown-header">Export All Data</li>',
                  ],
              ],
          ]),
      ],
  ]);

  ?>

</div>
