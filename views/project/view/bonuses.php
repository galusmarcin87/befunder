<?

use app\models\mgcms\db\Project;
use yii\web\View;

/* @var $this yii\web\View */
/* @var $model Project */

?>

<ul class="List-custm__checklist">
    <? foreach ($model->bonuses as $bonus): ?>
    <li class="List-custm__checklist__item">
        <strong><?= $bonus->from ?></strong> <?= $bonus->value ?>
    </li>
    <? endforeach; ?>

</ul>
