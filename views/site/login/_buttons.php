<?php

use yii\helpers\Url;
$request = $this->context->request;
?>

<div class="row">
    <div class="col-md-6">
        <a href="<?= Url::to('/site/register') ?>"
           class="button button--big <? if($request->getPathInfo() != 'site/register'):?>button--inactive<?endif?>""><?= Yii::t('db', 'Register') ?></a>
    </div>
    <div class="col-md-6">
        <a href="<?= Url::to('/site/login') ?>"
           class="button button--big <?if($request->getPathInfo() != 'site/login'):?>button--inactive<?endif?>"><?= Yii::t('db', 'Login') ?></a>
    </div>
</div>
