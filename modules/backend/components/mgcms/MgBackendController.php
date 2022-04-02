<?php
namespace app\modules\backend\components\mgcms;

use app\components\mgcms\MgCmsController;
use yii\filters\AccessControl;
use Yii;

/**
 * Default controller for the `backend` module
 */
class MgBackendController extends MgCmsController
{

  public function init()
  {
    parent::init();
    Yii::$app->user->loginUrl = '/backend/default/login';
    Yii::$app->homeUrl = '/admin';
  }

  public function behaviors()
  {
    return [
        'access' => [
            'class' => AccessControl::className(),
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['login', 'signup'],
                ],
                [
                    'allow' => true,
//                    'actions' => ['login', 'signup'],
                    'roles' => ['@'],
                ],
                [
                    'allow' => true,
//                    'actions' => ['*'],
                    'roles' => ['*'],
                ],
            ]
        ],
    ];
  }

  public function beforeAction($action)
  {

    if ($this->getUserModel()) {
      if (!$this->getUserModel()->checkAccess(str_replace(['mgcms/'], '', Yii::$app->controller->id), Yii::$app->controller->action->id)) {
        throw new \yii\web\HttpException(403);
      }
    }
    $actionController = Yii::$app->controller->id . '/' . Yii::$app->controller->action->id;
    if (!$this->getUserModel() && !in_array($actionController, [
            'default/login',
            'default/index'
        ])) {
      $this->redirect(['/backend/default']);
      return;
    }


    return parent::beforeAction($action);
  }

  public function initEditableBehavior($className)
  {
    if (Yii::$app->request->post('hasEditable')) {
      $model = new $className;
      $reflectionModel = new \ReflectionClass($model);
      $modelFullClass = $reflectionModel->getName();
      $modelClass = $reflectionModel->getShortName();
      $model = $modelFullClass::findOne(Yii::$app->request->post('editableKey'));
      $post = [];
      $posted = current($_POST[$modelClass]);
      $post[$modelClass] = $posted;
      if ($model->load($post)) {
        if ($model->save()) {
          $out = \yii\helpers\Json::encode(['output' => $model->{Yii::$app->request->post('editableAttribute')}, 'message' => '']);
        }
      }
      echo $out;
      die;
    }
  }

    public function actionRemoveImage($id)
    {
        $model = $this->findModel($id);

        $model->file_id = null;
        $model->save();
        $this->back();
    }

}
