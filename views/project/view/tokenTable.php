<?

use app\models\mgcms\db\Project;
use yii\web\View;

/* @var $this yii\web\View */
/* @var $model Project */

?>

<ul class="List-custom__two">
    <li class="List-custom__two__item">
                  <span>
                    <strong> <span><?= Yii::t('db', 'Token'); ?></span></strong>
                  </span>
        <div></div>
    </li>
    <li class="List-custom__two__item">
        <span> <?= Yii::t('db', 'Value'); ?>: </span>
        <span> <?= $model->token_value ?> </span>
    </li>
    <li class="List-custom__two__item">
        <span> <?= Yii::t('db', 'Blockchain'); ?>: </span>
        <span> <?= $model->token_blockchain ?> </span>
    </li>
    <li class="List-custom__two__item">
        <span> <?= Yii::t('db', 'Intended for sale'); ?>: </span>
        <span> $<?= $model->token_to_sale ?> </span>
    </li>
    <li class="List-custom__two__item">
        <span> <?= Yii::t('db', 'Minimal purchase'); ?>: </span>
        <span> $<?= $model->token_minimal_buy ?> </span>
    </li>
    <li class="List-custom__two__item">
        <span> <?= Yii::t('db', 'Left'); ?> </span>
        <span> $<?= $model->token_left ?> </span>
    </li>
</ul>
