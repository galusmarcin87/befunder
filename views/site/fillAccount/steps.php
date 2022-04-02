<?php
/* @var $this yii\web\View */
?>
<ul id="progressbar">
    <li class="active"><?= Yii::t('db', 'step')?> 1</li>
    <li class="<?= $step >=1? 'active' : ''?>"><?= Yii::t('db', 'step')?> 2</li>
    <li class="<?= $step == 2 ? 'active' : ''?>"><?= Yii::t('db', 'step')?> 3</li>
</ul>
