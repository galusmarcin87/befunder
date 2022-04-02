<?php
/* @var $this yii\web\View */
/* @var $dataProvider yii\data\ActiveDataProvider */
use yii\helpers\Html;
use kartik\export\ExportMenu;
use yii\widgets\ListView;

$this->title = Yii::t('db', 'Galleries');
$this->params['breadcrumbs'][] = $this->title;
$search = "$('.search-button').click(function(){ 
    $('.search-form').toggle(1000); 
    return false; 
});";
$this->registerJs($search);

?> 
<div class="article-index"> 

    <h1><?= Html::encode($this->title) ?></h1> 

    <div class="row">
        <?=
        ListView::widget([
            'dataProvider' => $dataProvider,
            'itemOptions' => ['class' => 'item'],
            'itemView' => function ($model, $key, $index, $widget) {
              return $this->render('_index', ['model' => $model, 'key' => $key, 'index' => $index, 'widget' => $widget, 'view' => $this]);
            },
        ])

        ?> 
    </div>

</div> 