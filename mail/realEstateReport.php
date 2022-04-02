<?
/* @var $model \app\models\ReportRealEstateForm */
/* @var $files \app\models\mgcms\db\File[] */

?>

<h1><?= Yii::t('db', 'Real estate report'); ?></h1>

<h5>DANE POŻYCZKOBIORCY</h5>
<p>NAZWA FIRMY / IMIĘ I NAZWISKO: <?= $model->name ?></p>
<p>NIP : <?= $model->nip ?></p>
<p>PESEL / KRS: <?= $model->pesel ?></p>
<p>TELEFON : <?= $model->phone ?></p>
<p>MAIL : <?= $model->email ?></p>


<h5>OPIS INWESTYCJI</h5>
<p>LOKALIZACJA  : <?= $model->localization ?></p>
<p>RODZAJ NIERUCHOMOŚCI : <?= $model->estateType ?></p>
<p>HARMONOGRAM FINANSOWANIA : <?= $model->financePlan ?></p>
<p>CZAS TRWANIA KAMPANII: <?= $model->campaignTime ?></p>
<p>MINIMALNA KWOTA POŻYCZKI : <?= $model->minimalLoanAmount ?></p>
<p>MAKSYMALNA KWOTA POŻYCZKI : <?= $model->maximalLoanAmount ?></p>
<p>OPROCENTOWANIE POŻYCZKI WG UMOWY  : <?= $model->intrestRate ?></p>
<p>OPIS  : <?= $model->description ?></p>

<?if($files):?>
<h6>Załaczniki:</h6>
<ul>
    <? foreach ($files as $file): ?>
        <li><a href="<?= \yii\helpers\Url::base(true) . $file->getWebPath() ?>"><?= $file->origin_name ?></a></li>
    <? endforeach; ?>
</ul>
<?endif?>

