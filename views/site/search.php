<?php
/* @var $this yii\web\View */
use yii\helpers\Html;
use yii\widgets\ListView;

$this->title = Yii::t('app', 'Search results');

?>
<?= $this->render('/common/breadcrumps') ?>


<section class="Section">
    <div class="container">
        <?=
        ListView::widget([
            'dataProvider' => $dataProvider,
            'itemOptions' => [
                'class' => 'simplesearch-result'
            ],
            'options' => [
                'class' => 'simplesearch-results-list',
            ],
            'layout' => '{items}',
            'itemView' => function ($model, $key, $index, $widget) {
              return $this->render('_searchItem', ['model' => $model, 'key' => $key, 'index' => $index, 'widget' => $widget, 'view' => $this]);
            },
        ])

        ?>
    </div>
</section>