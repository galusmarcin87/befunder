<?php
namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\data\ActiveDataProvider;
use yii\helpers\Url;
use app\models\mgcms\db\Project;
use yii\helpers\Json;

class ApiController extends \app\components\mgcms\MgCmsController
{

  const API_KEY = 'KsadasIASUd62378**asdkk';

  public function actionProjects($apiKey)
  {
    \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
    $products = Project::find()->all();
    $arr = [];
    foreach ($products as $product) {
      $item = $product->attributes;
      if ($product->file)
        $item['file'] = Url::home(true) . $product->file->imageSrc;
      $arr[] = $item;
    }
    return $arr;
  }
}
