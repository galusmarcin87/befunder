<?php
/* @var $this yii\web\View */

/* @var $dataProvider yii\data\ActiveDataProvider */

use yii\helpers\Html;
use kartik\export\ExportMenu;
use yii\widgets\ListView;
use app\models\mgcms\db\Project;

$this->title = Yii::t('db', 'Current projects');
$this->params['breadcrumbs'][] = $this->title;


?>


<section class="news projects-wrapper">
    <div class="container">
        <?=
        ListView::widget([
            'dataProvider' => $dataProvider,
            'itemOptions' => [
                'class' => 'col-sm-4 news__item'
            ],
            'options' => [
                'class' => 'row news__container projects',
            ],
            'layout' => '{items}',
            'itemView' => function ($model, $key, $index, $widget) {
                return $this->render('_tileItem', ['model' => $model, 'key' => $key, 'index' => $index, 'widget' => $widget, 'view' => $this]);
            },
        ])

        ?>

        <div class="text-center">
            <?=
            ListView::widget([
                'dataProvider' => $dataProvider,
                'layout' => '{pager}',
                'pager' => [
                    'firstPageLabel' => '&laquo;',
                    'lastPageLabel' => '&raquo;',
                    'prevPageLabel' => Yii::t('db', 'previous'),
                    'nextPageLabel' => Yii::t('db', 'next'),


                    // Customzing CSS class for pager link
                    'linkOptions' => [
                        'class' => 'page-link'
                    ],
                    'activePageCssClass' => 'active',
                    'pageCssClass' => 'page-item',
                    // Customzing CSS class for navigating link
                    'prevPageCssClass' => 'page-item Pagination__arrow',
                    'nextPageCssClass' => 'page-item Pagination__arrow',
                    'firstPageCssClass' => 'page-item Pagination__arrow',
                    'lastPageCssClass' => 'page-item Pagination__arrow',
                ],
            ])

            ?>
        </div>

    </div>
</section>
