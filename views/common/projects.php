<?

/* @var $this yii\web\View */

use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Project;
use yii\web\View;
use yii\widgets\ListView;

$projectSearch = new \app\models\mgcms\db\ProjectSearch();
$projectSearch->limit = 3;


$tabsStatuses = [Project::STATUS_ACTIVE];
$tabsConfig = [];
foreach ($tabsStatuses as $status) {
    $provider = $projectSearch->search([], $status);
    $provider->pagination = false;
    $provider->sort->defaultOrder = [
        'order' => SORT_ASC,
    ];


    $tabsConfig[] = [
        'name' => Project::STATUSES_EN[$status],
        'provider' => $provider
    ];
}

?>

<?php

$provider = $projectSearch->search([], [Project::STATUS_ACTIVE]);
$provider->pagination = false;
$provider->sort->defaultOrder = [
    'order' => SORT_ASC,
];
$provider->query->limit(3);
echo ListView::widget([
    'dataProvider' => $provider,
    'options' => ['class' => 'row news__container projects'],
    'itemOptions' => ['class' => 'col-sm-4 news__item'],
    'emptyTextOptions' => ['class' => 'col-md-12'],
    'layout' => '{items}',
    'itemView' => function ($model, $key, $index, $widget) {
        return $this->render('/project/_tileItem',
            [
                'model' => $model,
                'key' => $key,
                'index' => $index,
                'widget' => $widget,
                'view' => $this,
            ]);
    },
]);


?>



