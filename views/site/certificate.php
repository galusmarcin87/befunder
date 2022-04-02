<?
use app\components\mgcms\MgHelpers;

/* @var $model \app\models\mgcms\db\Payment */
$project = $model->project;

?>

<link href="https://fonts.googleapis.com/css?family=Roboto:400,700,900&amp;subset=latin-ext" rel="stylesheet">
<style>
  @media all{
    * {
      -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
      color-adjust: exact !important;  /*Firefox*/
    }
    body {
      transform: scale(.57);
      transform-origin: 0 0;
      margin: 0;
    }
    #main{
      font-family: 'Roboto', sans-serif;
      width: 1920px;
      height: 1370px;
      background: url(<?= $project->certificate && $project->certificate->isImage() ? $project->certificate->imageSrc : '' ?>);
      background-size: cover;
      color: #fff;
      position: relative;
    }
    .logoWrapper{
      text-align: center;
      padding-top: 185px;
      height: 200px;
    }

    .logoWrapper img{
      max-height: 100%;
    }
    .header{
      font-size: 40px;
      margin-bottom: 150px;
    }

    .center{
      text-align: center;
    }


    .user{
      font-size: 100px;
      margin-top: 50px;
      margin-bottom: 50px;

    }

    .user span{
      border-bottom: 3px solid #bd982e;
      padding: 0 50px ;
    }

    .table .row{
      margin-bottom: 10px;
      font-size: 25px;
      overflow: hidden;
    }
    .table .left{
      float: left;
      width: 49%;
      text-align: right;
    }
    .table .right{
      float: right;
      width: 49%;
      text-align: left;
    }

    .date{
      position: absolute;
      bottom: 187px;
      left: 290px;
      text-align: center;
    }

    .date .first{
      font-size: 35px;
    }

    .date .second{
      font-size: 28px;
      color: #cccccb;
      text-transform: uppercase;
      margin-top: 10px;
    }

    .date .first span{
      border-bottom: 3px solid #bd982e;
      padding: 0 60px ;
    }



    .yellow .header span, .yellow .user{
      color:#006635;
    }
    
    .red .header span, .red .user{
      color:#5b3a96;
    }
    
    .red .user span, .red .date .first span{
      border-bottom: 3px solid #9c1c4a;
    }
    
     .green .header span, .green .user{
      color:#c18c19;
    }
    
    .green .user span, .green .date .first span{
      border-bottom: 3px solid #006635;
    }
  }
</style>

<div id="main" class="<?= $project->color ?>">
  <div class="logoWrapper">
    <? if ($project->logo && $project->logo->isImage()): ?>
      <img src="<?= $project->logo->getImageSrc() ?>"/>
    <? endif ?>
  </div>
  <div class="header center">
    <?=
    Yii::t('db', MgHelpers::getSettingTypeText('certificate_header', false, 'Metryka potwierdzająca nabycie tokenów <span>{project}</span> przez'), [
        'project' => (string) $project
    ]);

    ?>:
  </div>
  <div class="user center">
    <span><?= (string) $model->user ?></span>
  </div>

  <div class="table center">
    <div class="row">
      <div class="left">
        <?= MgHelpers::getSettingTranslated('certificate_token_count', 'Liczba nabytych tokenów') ?>:
      </div>
      <div class="right">
        <?= $model->amount ?>
      </div>
    </div>
    <div class="row">
      <div class="left">
        <?= MgHelpers::getSettingTranslated('certificate_wallet_address', 'Numer portfela elektronicznego') ?>:
      </div>
      <div class="right">
        <?= $model->user_token ?>
      </div>
    </div>
    <div class="row">
      <div class="left">
        <?= MgHelpers::getSettingTranslated('certificate_preico_ico', 'Tokeny nabyte w procesie') ?>:
      </div>
      <div class="right">
        <?= $model->is_preico ? 'preICO' : 'ICO' ?>
      </div>
    </div>
    <div class="row">
      <div class="left">
        <?= MgHelpers::getSettingTranslated('certificate_year_percentage', 'Oprocentowanie w skali roku') ?>:
      </div>
      <div class="right">
        <?= $model->percentage ?>
      </div>
    </div>
    <div class="row">
      <div class="left">
        <?= MgHelpers::getSettingTranslated('certificate_bonus', 'Uzyskany bonus w skali roku') ?>:
      </div>
      <div class="right">
        <?= $model->bonusPercentage ?>
      </div>
    </div>
  </div>


  <div class="date">
    <div class="first">
      <span><?= date('d.m.Y', strtotime($model->created_on)) ?></span>
    </div>
    <div class="second">
      <?= MgHelpers::getSettingTranslated('certificate_date', 'Data nabycia tokenów') ?>
    </div>
  </div>
</div>