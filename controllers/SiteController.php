<?php

namespace app\controllers;

use FiberPay\FiberIdClient;
use app\models\mgcms\db\File;
use app\models\ReportRealEstateForm;
use FiberPay\FiberPayClient;
use Yii;
use yii\base\BaseObject;
use yii\filters\AccessControl;
use yii\helpers\Json;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;
use app\models\RegisterForm;
use \app\models\mgcms\db\User;
use \app\components\mgcms\MgHelpers;
use \app\models\mgcms\db\Payment;
use app\components\GetResponse\GetResponse;
use app\components\GetResponse\jsonRPCClient;
use yii\web\UploadedFile;
use app\models\mgcms\db\Article;

class SiteController extends \app\components\mgcms\MgCmsController
{

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
            'auth' => [
                'class' => 'yii\authclient\AuthAction',
                'successCallback' => [$this, 'onAuthSuccess'],
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {

        $contactForm = new ContactForm();

        if ($contactForm->load(Yii::$app->request->post()) && $contactForm->contact(Yii::$app->params['adminEmail'])) {
            MgHelpers::setFlashSuccess(Yii::t('db', 'Mail has been sent'));
            return $this->refresh();
        }


        /* -----------  SEO  ------------ */
        Yii::$app->view->title = MgHelpers::getSettingTranslated('SEO_title_home_page_' . Yii::$app->language, Yii::$app->name);
        Yii::$app->view->registerMetaTag([
            'name' => 'description',
            'content' => MgHelpers::getSettingTranslated('SEO_description_home_page_' . Yii::$app->language)
        ]);
        Yii::$app->view->registerMetaTag([
            'name' => 'keywords',
            'content' => MgHelpers::getSettingTranslated('SEO_keywords_home_page_' . Yii::$app->language)
        ]);
        /* -----------  SEO  ------------ */


        return $this->render('index', [
            'contactForm' => $contactForm
        ]);
    }

    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionRegister()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new RegisterForm();
        if ($model->load(Yii::$app->request->post()) && $model->register()) {
            MgHelpers::setFlashSuccess(MgHelpers::getSettingTranslated('register_after_message',
                'Thank you for registration, email with activation of account has been sent.'));
            return $this->refresh();
        }
        return $this->render('register', [
            'model' => $model,
        ]);
    }

    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionFillAccount($back = 0)
    {

        $model = $this->getUserModel();
        $type = $model->type;
        $step = $model->step ? $model->step : 0;

        if ($step == 3) {
            return $this->redirect(['site/verify-fiber-id']);
        }

        if ($back) {
            $model->step--;
            $model->save();
            return $this->redirect(['site/fill-account']);
        }
        // $model->scenario = 'step' . $step;
        if ($model->load(Yii::$app->request->post())) {
            $model->validateSteps();
            if (!$model->hasErrors()) {
                $model->step++;
                $saved = $model->save();
                if (!$saved) {
                    \app\components\mgcms\MgHelpers::setFlashError(Yii::t('db', $model->getErrorSummary()));
                }
                return $this->refresh();
            }

        }
        return $this->render('fillAccount/step_' . $type . '_' . $step, [
            'model' => $model,
            'type' => $type,
            'step' => $step
        ]);
    }

    public function actionForgotPassword()
    {
        $model = new \app\models\ForgotPasswordForm();
        if ($model->load(Yii::$app->request->post()) && $model->sendMail()) {
            \app\components\mgcms\MgHelpers::setFlashSuccess(Yii::t('db', 'Forgot Password email has been sent'));
            return $this->goBack();
        }
        return $this->render('forgotPassword', [
            'model' => $model
        ]);
    }

    public function actionForgotPasswordChange($hash)
    {
        $email = \app\components\mgcms\MgHelpers::decrypt($hash);
        if (!$email) {
            $this->throw404();
        }
        $user = User::find()->where(['username' => $email])->one();
        if (!$user) {
            $this->throw404();
        }

        $model = new \app\models\ResetPasswordForm($user);
        if ($model->load(Yii::$app->request->post()) && $model->changePassword()) {
            \app\components\mgcms\MgHelpers::setFlashSuccess(Yii::t('db', 'Password has been changed'));
            return $this->goBack();
        }
        return $this->render('resetPassword', [
            'model' => $model
        ]);
    }

    /**
     * Logout action.
     *
     * @return Response
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return Response|string
     */
    public function actionContact()
    {
        $model = new ContactForm();

        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            MgHelpers::setFlashSuccess(Yii::t('db', 'Mail has been sent'));

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays contact page.
     *
     * @return Response|string
     */
    public function actionRealEstateReport()
    {
        $model = new ReportRealEstateForm();

        if ($model->load(Yii::$app->request->post()) && $model->sendMail()) {
            MgHelpers::setFlashSuccess(Yii::t('db', 'Mail has been sent'));

            return $this->refresh();
        }
        return $this->render('realEstateReport', [
            'model' => $model,
        ]);
    }

    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }


        $model = new LoginForm();
        $modelRegister = new RegisterForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        if ($modelRegister->load(Yii::$app->request->post()) && $modelRegister->register()) {
            MgHelpers::setFlashSuccess(MgHelpers::getSettingTranslated('register_after_message', 'Thank you for registration, email with activation of account has been sent.'));

            return $this->refresh();
        }
        return $this->render('login', [
            'model' => $model,
            'modelRegister' => $modelRegister
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    public function actionKnowledgeBase()
    {
        return $this->render('knowledgeBase');
    }

    public function actionActivate($hash)
    {

        $id = MgHelpers::decrypt($hash);
        if (!$id) {
            $this->throw404();
        }

        $user = User::findOne($id);
        if (!$user) {
            $this->throw404();
        }

        $user->status = User::STATUS_ACTIVE;
        $saved = $user->save();
        if ($saved) {
            MgHelpers::setFlashSuccess(Yii::t('db', 'Successfull activation'));
            $this->redirect('/');
        }
    }

    public function actionMetrics($hash)
    {
        $id = MgHelpers::decrypt($hash);
        if (!$id) {
            $this->throw404();
        }

        $payment = Payment::findOne($id);

        if (!$payment || !$this->getUserModel()) {
            $this->throw404();
        }
        if ($payment->user_id !== $this->getUserModel()->id) {
            $this->throw404();
        }
        if (!in_array($payment->status, [Payment::STATUS_PAYMENT_CONFIRMED, Payment::STATUS_PAYMENT_CONFIRMED])) {
            $this->throw404();
        }


        return $this->renderPartial('certificate', [
                'model' => $payment
            ]
        );
    }

    public function actionAccount($backUrl = false)
    {


        $model = $this->getUserModel();

        if (!$model) {
            $this->throw404();
        }

//        if ($this->getUserModel()->status != User::STATUS_VERIFIED) {
//            return $this->redirect(['site/fill-account']);
//        }


        $model->scenario = 'account';
        if ($backUrl) {
            $model->scenario = 'kyc';
        }


        if (Yii::$app->request->post('User')) {
            if (Yii::$app->request->post('passwordChanging')) {
                $model->scenario = 'passwordChanging';
            }

            if ($model->load(Yii::$app->request->post()) && $model->save()) {
                if ($backUrl) {
                    $model->is_kyc_filled = 1;
                    $saved = $model->save();
                    if ($saved) {
                        return $this->redirect([$backUrl]);
                    }
                } else {
                    MgHelpers::setFlashSuccess(Yii::t('db', 'Saved succesfully'));
                }
            }
        }

        if (Yii::$app->request->post('imageSave') === '') {
            $upladedFiles = UploadedFile::getInstance($model, 'file_id');
            if ($upladedFiles) {
                $fileModel = new File;
                $file = $fileModel->push(new \rmrevin\yii\module\File\resources\UploadedResource($upladedFiles));
                if ($file) {
                    $model->file_id = $file->id;
                    $saved = $model->save();
                }

            }
        }


        return $this->render('account', [
            'model' => $model,
            'backProject' => $backUrl
        ]);
    }

    public function actionRemovePhoto()
    {
        $model = $this->getUserModel();
        $model->file_id = null;
        $model->save();
        $this->back();
    }

    public function actionSearch($q)
    {

        $query = Article::find();
        $dataProvider = new \yii\data\ActiveDataProvider([
            'query' => $query,
            'sort' => ['defaultOrder' => ['created_on' => SORT_DESC]]
        ]);


        $query->orWhere(['like', 'title', $q]);

        return $this->render('search', [
            'dataProvider' => $dataProvider
        ]);
    }

    public function actionWouldYouLikeToInvest()
    {

        return $this->render('wouldYouLikeToInvest');
    }

    public function actionAboutUs()
    {

        return $this->render('aboutUs');
    }

    public function actionAboutOurPlatform()
    {

        return $this->render('aboutOurPlatform');
    }

    public function actionAboutProject()
    {

        return $this->render('aboutProject');
    }

    public function actionVerifyFiberId()
    {
        $fiberPayConfig = MgHelpers::getConfigParam('fiberPay');
        $fiberClient = new FiberIdClient($fiberPayConfig['fiberIdApiKey'], $fiberPayConfig['fiberIdSecret'], $fiberPayConfig['testServer']);
        $order = $fiberClient->createOrder('individual', MgHelpers::getSetting('fiberId - description'), Url::to(['site/verify-fiber-id-callback', 'hash' => MgHelpers::encrypt(serialize(['userId' => $this->getUserModel()->id]))], true), Url::to('site/account', true));

        if ($order->url) {
            return $this->redirect($order->url);
        } else {
            MgHelpers::setFlashError('error during creating fiber id request');
            return $this->redirect('/');
        }
    }

    public function beforeAction($action)
    {
        if ($action->id == 'verify-fiber-id-callback') {
            $this->enableCsrfValidation = false;
        }
        return true;
    }

    public function actionVerifyFiberIdCallback($hash)
    {
        $data = unserialize(MgHelpers::decrypt($hash));
        $userId = $data['userId'];
        $user = User::findOne($userId);

        if(!$user){
            $this->throw404();
        }

        \Yii::info("actionVerifyFiberIdCallback", 'own');

        //$body = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiSXNPTU15YlNBOTZTbjA0TGxWckJEenhSWHdoU05ZbTUxUlh6Z0l2VU44WGtNZ3JKbGYzNHdSTmJiaHV4UTdHSGQwbE56ZHNIUW9cL3FPTUFsMHhBVzhOWlJUR3QydldzTWQ1S0IxRVA3VnNuYVE5YWdJdk9FNjNzXC82eUh1T0JWVWhwOGhuaEZ3YlVta1hWV3Zka0xyekVabGpCWTVjVTRHUVZmQ0s0b0JxK0JkUlwvSENyeWExVXpcL3ZIRDRaa2RxbGJDMXpcL3A1YVRSTDFhNWxsRnB3dFdNdUJFaU4zbVJpcTUrQUQwckFYQWw0a3Y1YnlpeU1wRFpIS1wvMUphSGJ6bTA0RDNcL2R1b2xNYXkyVTJjc284OFNZRnlGTjFDQWhVN1JKY216VzRXSmVRRDRuMktrSVcyK3pnMUNNTkZySjZhcndudXRFcklVK2gzUnRpWmYwWm9ZTkVoVnZUcTh2b0ZzRFNZeEJna1M1M1wvRlwvSmJpdEhXS0J5cHJqQllCWlpVeHpVbm9QYVdGTFlZNTlFSUhrRE9NQStIMTJBdlA2dnUzakR3N1BKNGxJZU1cL1pucDVOdHRsY3FhRVwvRUlPRlVTSEtHbVA2cnNcL1UrM1hRT2l5ZFM5RFNQaFYwdXg0c0UwVit4R3pmUTdsOE1YS1REbXFJQTFRalwvUERHdWRXUDZHN0kyaFhVUzgwcXlXXC9FSXFSaHh1SUJOUHY1NW0wR1ZXdGVUQVFaWThmQzA2aHZnRDVpdHFkZ1AraUNucjFteUdWUGlFQ1lcLzA1REdlaStJaWYrTm9XZjNxTXNnenVraFRWUG5QSG0zZVFpM2Nadk9md2doVE5sRDcyV0lMdHE4cnliXC83a2VvcHR2ZFhPcmpQQWdPXC8yeWZIRnlKVUJmb0N5NDlkZlB5WThpK2FCZHREaUdaMTZGTUVrRDZ0N05OdGE0SE9EQ1JJK1JCTFRRRTJ6eUdXRVJXZCtycWM5ckYyb21TK0s5ZGtTa3FwMWhMMkVPMjFTbTBhUzh0WDI0Zyt1eEtSb0FOVDNYU2ZMU0Q1XC9pcHpGT0JmZG5FM0xWVU9TQ0x4YXhwOXZzY1I5Tjl4RE9KbE1FeTVXRlh3MG9DbiIsImlzcyI6IlZlcmlmaWNhdGlvbiIsImlhdCI6MTYyOTgyODIyMSwiaXYiOiIzN2ZmNDBkMjIzMzQ2ZWQzZDVlZWUyZjA0ZjAxNTgwNSJ9.7B7NvqYb9hfWKXCZLZXDK63sn8CRNVxAGJ-FwoRN4gU';
        $body =  $this->request->rawBody;
        $headers = $this->request->headers;
        $fiberPayConfig = MgHelpers::getConfigParam('fiberPay');
        $apiKey = $headers['api-key'];
        \Yii::info($apiKey, 'own');
        if($apiKey != $fiberPayConfig['fiberIdApiKey']){
            $this->throw404();
        }
        \Yii::info('fiber decrypt', 'own');
        $fiberClient = new FiberIdClient($fiberPayConfig['fiberIdApiKey'], $fiberPayConfig['fiberIdSecret'], $fiberPayConfig['testServer']);
        $res = $fiberClient->decodeAndDecrypt($body);
        \Yii::info(JSON::encode($res), 'own');
        switch ($res->status) {
            case 'accepted':
                \Yii::info('accepted', 'own');
                $user->status = User::STATUS_VERIFIED;
                $user->bank_no = $res->data->bankAccount;
                $user->first_name = $res->data->firstName;
                $user->last_name = $res->data->lastName;
                $user->country = $res->data->country;
                $user->address = $res->data->address;
                $user->postcode = $res->data->postalCode;
                $user->city = $res->data->city;
                $user->phone = $res->data->phoneNumber;
                $user->id_document_no = $res->data->idNumber;
                $user->citizenship = $res->data->nationality;
                $user->pesel = $res->data->personalIdentityNumber;
                $saved = $user->save();
                \Yii::info($saved, 'own');
                //\Yii::info(JSON::encode($user), 'own');
                \Yii::info(JSON::encode($user->getErrors()), 'own');
                Yii::$app->mailer->compose('accountVerifiedFiber', ['model' => $user])
                    ->setTo($user->email)
                    ->setFrom([MgHelpers::getSetting('email from') => MgHelpers::getSetting('email from name')])
                    ->setSubject(Yii::t('db','Verification successful'))
                    ->send();
                \Yii::info('mail accepted', 'own');
                break;

            case 'rejected':
                Yii::$app->mailer->compose('accountRejectedFiber', ['model' => $user])
                    ->setTo($user->email)
                    ->setFrom([MgHelpers::getSetting('email from') => MgHelpers::getSetting('email from name')])
                    ->setSubject(Yii::t('db','Verification rejected'))
                    ->send();
                \Yii::info('mail rejected', 'own');
                break;

        }
        return 'ok';
    }


}
