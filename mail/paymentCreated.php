<?
use app\components\mgcms\MgHelpers;

/* @var $model app\models\mgcms\db\Payment */

?>

<h1>Nowa płatność</h1>

<p>DATA DEKLARACJI: <?= date('Y-m-d') ?></p>
<p>KTO NABYWA: <?= $model->user ?></p>
<p>JAKI PROJEKT: <?= $model->project ?></p>
<p>ILOŚĆ TOKENÓW: <?= $model->amount ?></p> 