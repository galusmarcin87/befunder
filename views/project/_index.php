<?
/* @var $model app\models\mgcms\db\Project */

use yii\web\View;

/* @var $this yii\web\View */
$model->language = Yii::$app->language;
if ($this->beginCache('project'.$model->id . Yii::$app->language)) {

if(!function_exists('nice_number')) {
function nice_number($n) {
        // first strip any formatting;
        $n = (0+str_replace(",", "", $n));

        // is this a number?
        if (!is_numeric($n)) return false;

        // now filter it;
        if ($n > 1000000000000) return round(($n/1000000000000), 2).' trn';
        elseif ($n > 1000000000) return round(($n/1000000000), 2).' bln';
        elseif ($n >= 1000000) return round(($n/1000000), 2).' mln';
        elseif ($n > 1000) return round(($n/1000), 2).' k';

        return number_format($n);
    }
  }
  
?>

<div class="col-lg-4 animatedParent">
  <a href="<?= $model->linkUrl ?>" class="noUnderline">
    <div class="investment-countdown fadeIn animated">
      <div class="btn-wrapper">
        <span class="btn btn-green">
          <?= Yii::t('db', 'DETAILS'); ?><span></span>
        </span>
      </div>
      <? if ($model->picture && $model->picture->isImage()): ?>
        <div class="img-wrapper">
          <img src="<?= $model->picture->getImageSrc(520, 280) ?>" alt="Obraz" style="width:520px;">
        </div>
      <? endif ?>
      <div class="investment-body">
        <h3><?= $model->title ?></h3>
        <?= $model->lead ?>
        <? if ($model->money_full): ?>
          <div class="investment-line">
            <div data-to="<?= $model->money_gathered ?>" data-slide-to="<?= floatval($model->money_gathered) / floatval($model->money_full) * 100 ?>" data-value="" style="width: 0" class="investment-line-inside"></div>
			<div class="progress-line line1"></div>
            <div class="progress-line line2"></div>
            <div class="progress-line line3"></div>
            <div class="progress-line line4"></div>
          </div>
          <div class="investment-value text-right"><?= nice_number($model->money_full); ?> $</div>
        <? endif ?>
        <? if ($model->status == app\models\mgcms\db\Project::STATUS_1): ?>
          <div class="count-down-timer-wrapper">
            <div class="row">
              <div class="col-md-3 text-center">
                <div class="grid v-center"><b><?= Yii::t('db', 'Time left'); ?>:</b></div>
              </div>
              <div class="col-md-9">
                  <?= $dateCounter = false;
                   if (strtotime($model->presale_date_from) < strtotime('now') && strtotime($model->presale_date_to) > strtotime('now')){
                    $dateCounter = $model->presale_date_to;
                  } 
                  if (strtotime($model->sale_date_from) < strtotime('now') && strtotime($model->sale_date_to) > strtotime('now')){
                    $dateCounter = $model->sale_date_to;
                  } ?>
                <div class="ount-down-timer row" data-date="<?= strtolower(date('M d, Y H:i:s', strtotime($dateCounter))) ?>">
                  <div class="day col"><span></span> <?= Yii::t('db', 'days'); ?></div>
                  <div class="hour col"><span></span> <?= Yii::t('db', 'hours'); ?></div>
                  <div class="minute col"><span></span> <?= Yii::t('db', 'minutes'); ?></div>
                  <div class="second col"><span></span> <?= Yii::t('db', 'seconds'); ?></div>
                </div>
              </div>
            </div>
          </div>
          <? if ($model->pre_ico_percentage || $model->ico_percentage): ?>
            <div class="guaranted-wrapper <?= $model->color ?>">
              <div class="guaranted">
                <div><?= Yii::t('db', 'GUARANTED')?></div>
                <div class="guaranted-big-text"><?= (strtotime($model->presale_date_to) > strtotime('now')) ? (int)$model->years * $model->pre_ico_percentage : (int)$model->years * $model->ico_percentage ?>%<br>
                  <? if (strtotime($model->presale_date_from) < strtotime('now') && strtotime($model->presale_date_to) > strtotime('now')): ?>PRE-ICO<? endif ?>
                  <? if (strtotime($model->sale_date_from) < strtotime('now') && strtotime($model->sale_date_to) > strtotime('now')): ?>ICO<? endif ?>
                  
                </div>
                <div><?= Yii::t('db', 'GUARANTED')?></div>
              </div>
            </div>
          <? endif ?>
        <? endif ?>
      </div>
    </div>
  </a>
</div>
<?php  $this->endCache();} ?>