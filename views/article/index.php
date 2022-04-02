<?php
/* @var $this yii\web\View */

/* @var $dataProvider yii\data\ActiveDataProvider */

use yii\helpers\Html;
use kartik\export\ExportMenu;
use yii\widgets\ListView;

$this->title = Yii::t('db', 'News');
if (isset($tag) && $tag) {
    $this->title = Yii::t('db', 'Tag') . ' - ' . $tag;
}


$this->params['breadcrumbs'][] = $this->title;
$search = "$('.search-button').click(function(){ 
    $('.search-form').toggle(1000); 
    return false; 
});";
$this->registerJs($search);

?>

<?= $this->render('/common/breadcrumps') ?>

<section class="Section Section--grey News News--with-pagination">
    <div class="container">
        <?=
        ListView::widget([
            'dataProvider' => $dataProvider,
            'itemOptions' => [
                'class' => 'animatedParent'
            ],
            'options' => [
                'class' => 'News__list',
            ],
            'layout' => '{items}',
            'itemView' => function ($model, $key, $index, $widget) {
                return $this->render('_index', ['model' => $model, 'key' => $key, 'index' => $index, 'widget' => $widget, 'view' => $this]);
            },
        ])

        ?>

        <div class="Pagination text-center">
            <nav aria-label="Page navigation example">
                <?=
                ListView::widget([
                    'dataProvider' => $dataProvider,
                    'layout' => '{pager}',
                    'pager' => [
                        'firstPageLabel' => '&laquo;',
                        'lastPageLabel' => '&raquo;',
                        'prevPageLabel' => '&#8249;',
                        'nextPageLabel' => '&#8250;',


                        // Customzing CSS class for pager link
                        'linkOptions' => [
                            'class' => 'page-link',
                        ],
                        'activePageCssClass' => 'page-link--active',
                        'pageCssClass' => 'page-item',
                        // Customzing CSS class for navigating link
                        'prevPageCssClass' => 'page-item',
                        'nextPageCssClass' => 'page-item',
                        'firstPageCssClass' => 'page-item',
                        'lastPageCssClass' => 'page-item',
                    ],
                ])

                ?>
            </nav>
        </div>

    </div>
</section>

<?= $this->render('/common/newsletterForm') ?>

