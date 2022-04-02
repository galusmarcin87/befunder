<?php
/* @var $this yii\web\View */

/* @var $dataProvider yii\data\ActiveDataProvider */

use yii\helpers\Html;
use kartik\export\ExportMenu;
use yii\widgets\ListView;

$this->title = 'FAQ';

$this->params['breadcrumbs'][] = $this->title;
$search = "$('.search-button').click(function(){ 
    $('.search-form').toggle(1000); 
    return false; 
});";
$this->registerJs($search);

?>

<section class="Section animatedParent">
    <div class="container fadeIn animated">
        <h1 class="text-center"><?= Yii::t('db', 'Questions and answers'); ?></h1>
        <?=
        ListView::widget([
            'dataProvider' => $dataProvider,
            'itemOptions' => ['class' => 'item'],
            'layout' => '{items}',
            'itemView' => function ($model, $key, $index, $widget) {
                return $this->render('_index', ['model' => $model, 'key' => $key, 'index' => $index, 'widget' => $widget, 'view' => $this]);
            },
        ])

        ?>
    </div>
</section>