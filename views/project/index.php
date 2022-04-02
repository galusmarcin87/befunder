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

<?= $this->render('/common/breadcrumps') ?>
<style>
    .Projects__sortable {
        --gap: 30px;
        display: -ms-grid;
        display: grid;
        -ms-grid-columns: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: var(--gap);
        grid-row-gap: 45px;
        margin-top: 25px;
    }
</style>
<section class="Section Section--grey Projects Projects--with-pagination animatedParent">
    <div class="container fadeIn animated">
        <?=
        ListView::widget([
            'dataProvider' => $dataProvider,
            'itemOptions' => [
                'class' => 'Projects__card fadeIn animated'
            ],
            'options' => [
                'class' => 'Projects__sortable animatedParent',
            ],
            'layout' => '{items}',
            'itemView' => function ($model, $key, $index, $widget) {
                return $this->render('_tileItem', ['model' => $model, 'key' => $key, 'index' => $index, 'widget' => $widget, 'view' => $this]);
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
                            'class' => 'page-link'
                        ],
                        'activePageCssClass' => 'page-link--active',
                        'pageCssClass' => 'page-item',
                        // Customzing CSS class for navigating link
                        'prevPageCssClass' => 'page-item Pagination__arrow',
                        'nextPageCssClass' => 'page-item Pagination__arrow',
                        'firstPageCssClass' => 'page-item Pagination__arrow',
                        'lastPageCssClass' => 'page-item Pagination__arrow',
                    ],
                ])

                ?>
            </nav>
        </div>

    </div>
</section>

<?=$this->render('/common/newsletterForm')?>

