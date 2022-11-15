<?php

namespace app\controllers;

//use \app\components\ZondaPayAPI;
use app\models\mgcms\db\User;
use app\models\SubscribeForm;
use Yii;
use yii\base\BaseObject;
use yii\console\widgets\Table;
use yii\helpers\Json;
use yii\log\Logger;
use yii\web\Controller;
use app\models\mgcms\db\Project;
use yii\data\ActiveDataProvider;
use yii\helpers\Url;
use \app\components\mgcms\MgHelpers;
use app\models\mgcms\db\Payment;
use __;
use yii\web\Link;
use yii\web\Session;
use FiberPay\FiberPayClient;
use JWT;
use yii\validators\EmailValidator;
use Przelewy24\Przelewy24;
use Przelewy24\Exceptions\Przelewy24Exception;

class ProjectController extends \app\components\mgcms\MgCmsController
{

    public function actionIndex()
    {

        $dataProvider = new ActiveDataProvider([
            'query' => Project::find()->where(['status' => [Project::STATUS_ACTIVE, Project::STATUS_PLANNED]]),
            'pagination' => [
                'pageSize' => 3,
            ],
            'sort' => [
                'defaultOrder' => [
                    'order' => SORT_ASC,
                ]
            ],
        ]);

        return $this->render('index', [
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionView($id)
    {
        $model = Project::find()->where(['id' => $id])->one();
        if (!$model) {
            throw new \yii\web\HttpException(404, Yii::t('app', 'Not found'));
        }


        $subscribeForm = new SubscribeForm();
        if ($subscribeForm->load(Yii::$app->request->post()) && $subscribeForm->subscribe($model)) {
            MgHelpers::setFlashSuccess(MgHelpers::getSettingTranslated('email project subscription', 'Thank you for subscribing'));
            return $this->refresh();
        }

        return $this->render('view', ['model' => $model, 'subscribeForm' => $subscribeForm]);
    }

    public function actionBuy($id)
    {

        if (!MgHelpers::getUserModel()) {
            MgHelpers::setFlashError(Yii::t('db', 'You must to be logged in'));
            return $this->redirect(['site/login']);
        }

        $user = MgHelpers::getUserModel();
//        if (!$user->first_name || !$user->last_name || !$user->street || !$user->flat_no || !$user->postcode || !$user->city) {
//            MgHelpers::setFlash(MgHelpers::FLASH_TYPE_WARNING, Yii::t('db', 'Fill your account data please first'));
//            return $this->redirect(['site/account']);
//        }
//        if ($user->status != User::STATUS_VERIFIED) {
//            MgHelpers::setFlash(MgHelpers::FLASH_TYPE_WARNING, Yii::t('db', 'You need to verify by Fiber ID, to do so go to <a href="' . Url::to('site/verify-fiber-id')) . '">Verify</a>');
//            return $this->redirect(['site/account']);
//        }


        $project = Project::find()
            ->where(['status' => Project::STATUS_ACTIVE, 'id' => $id])
            ->one();

        if (!$project->public_key || !$project->private_key || !$project->przelewy24_crc || !$project->przelewy24_merchant_id) {
            MgHelpers::setFlashError(Yii::t('db', 'Project does not have payment configured'));
            return $this->back();
        }

        if (Yii::$app->request->post('plnToInvest')) {
            if (Yii::$app->request->post('plnToInvest') < $project->token_minimal_buy) {
                MgHelpers::setFlashError(Yii::t('db', 'Amount is too low, minimal investition amount is ') . $project->token_minimal_buy);
                return $this->refresh();
            }
            return $this->render('buy2', ['project' => $project, 'amount' => Yii::$app->request->post('plnToInvest')]);
        }

        if (Yii::$app->request->post('plnToInvest2')) {
            if (!Yii::$app->request->post('acceptTerms0') || !Yii::$app->request->post('acceptTerms1')) {
                MgHelpers::setFlashError(Yii::t('db', 'You must accept terms'));
                return $this->render('buy2', ['project' => $project, 'amount' => Yii::$app->request->post('plnToInvest2')]);
            }
            return $this->render('buy3', ['project' => $project, 'amount' => Yii::$app->request->post('plnToInvest2')]);
        }

        if (Yii::$app->request->post('plnToInvest3')) {
            $plnToInvest = str_replace(',', '.', Yii::$app->request->post('plnToInvest3'));
            if (!is_numeric($plnToInvest)) {
                MgHelpers::setFlashError(Yii::t('db', 'Invalid value'));
                return $this->render('buy', []);
            }

            $payment = new Payment();
            //$payment->amount = $tokensToInvest * MgHelpers::getSetting('token rate', false, 2);
            $payment->amount = $plnToInvest;

            $payment->user_id = $this->getUserModel()->id;
            $payment->status = Payment::STATUS_NEW;
            $payment->project_id = $project->id;
            $payment->percentage = $project->percentage; //sessionId
            $payment->user_token = 'aaa';
            $saved = $payment->save();
            $hash = MgHelpers::encrypt(JSON::encode(['userId' => $payment->user_id, 'paymentId' => $payment->id]));
            $payment->user_token = $hash;
            $payment->save();

            if (Yii::$app->request->post('przelewy24')) {
                $przelewy24ConfigParams = MgHelpers::getConfigParam('przelewy24');
                $przelewy24Config = [
                    'live' => $przelewy24ConfigParams['live'],
                    'merchant_id' => $project->przelewy24_merchant_id,
                    'crc' => $project->przelewy24_crc
                ];
                $przelewy24 = new Przelewy24($przelewy24Config);

                $transaction = $przelewy24->transaction([
                    'session_id' => $payment->id,
                    'url_return' => Url::to(['project/buy-thank-you', 'hash' => $hash], true),
                    'url_status' => Url::to(['project/notify-przelewy24', 'hash' => $hash], true),
                    'amount' => $payment->amount * 100,
                    'description' => $project->name,
                    'email' => $this->getUserModel()->username,
                ]);

                $transaction->token();

                return $this->redirect($transaction->redirectUrl());
            }

            if (Yii::$app->request->post('zonda')) {
                $pubkey = $project->public_key;
                $privkey = $project->private_key;

                $zondaApi = new \app\components\ZondaPayAPI($pubkey, $privkey);

                $response = $zondaApi->callApi('/payments', [
                    'destinationCurrency' => 'PLN',
                    'orderId' => $payment->id,
                    'price' => (double)$plnToInvest,
                    'notificationsUrl' => Url::to(['project/notify', 'hash' => $hash], true),
                ], 'POST');


                $res = Json::decode($response);
                if ($res['status'] == 'Ok' && $res['data']['url']) {
                    return $this->redirect($res['data']['url']);
                } else {
                    echo '<pre>';
                    echo var_dump($res);
                    echo '</pre>';
                    exit;
                    MgHelpers::setFlashError(Yii::t('db', 'Problem with initialize Zonda Pay'));
                    return $this->render('buy', []);
                }
            }

        }


        return $this->render('buy', []);
    }

    public function beforeAction($action)
    {
        if ($action->id == 'notify') {
            $this->enableCsrfValidation = false;
        }
        return true;
    }

    public function actionNotify($hash)
    {
        \Yii::info("notify", 'own');
        \Yii::info($hash, 'own');

//        $headers = JSON::decode('{"user-agent":["Apache-HttpClient/4.1.1 (java 1.5)"],"content-type":["application/json"],"accept":["application/json"],"api-key":["dNlZtEJrvaJDJ5EX"],"content-length":["1484"],"connection":["close"],"host":["piesto.vertesprojekty.pl"]}');
//        $body = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7Im9yZGVySXRlbSI6eyJkYXRhIjp7ImNvZGUiOiJhM3h2NnpnOSIsInN0YXR1cyI6InJlY2VpdmVkIiwidHlwZSI6ImNvbGxlY3RfaXRlbSIsImN1cnJlbmN5IjoiUExOIiwiYW1vdW50IjoiOC4wMCIsImZlZXMiOltdLCJ0b05hbWUiOiJhc2RzYSIsInBhcmVudENvZGUiOiJheWsyZ3FqczZoZDUiLCJkZXNjcmlwdGlvbiI6IlBpZXN0byIsIm1ldGFkYXRhIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIxLTA2LTMwIDIxOjUyOjA3IiwidXBkYXRlZEF0IjoiMjAyMS0wNi0zMCAyMTo1MjoyMCIsInJlZGlyZWN0IjoiaHR0cHM6XC9cL3Rlc3QuZmliZXJwYXkucGxcL29yZGVyXC9hM3h2NnpnOSJ9LCJpbnZvaWNlIjp7ImFtb3VudCI6IjguMDAiLCJjdXJyZW5jeSI6IlBMTiIsImliYW4iOiJQTDE5MTk0MDEwNzYzMjAyODAxMDAwMDJURVNUIiwiYmJhbiI6IjE5MTk0MDEwNzYzMjAyODAxMDAwMDJURVNUIiwiZGVzY3JpcHRpb24iOiJhM3h2NnpnOSJ9LCJsaW5rcyI6eyJyZWwiOiJzZWxmIiwiaHJlZiI6Imh0dHBzOlwvXC9hcGl0ZXN0LmZpYmVycGF5LnBsXC8xLjBcL29yZGVyc1wvY29sbGVjdFwvaXRlbVwvYTN4djZ6ZzkifX0sInRyYW5zYWN0aW9uIjp7ImRhdGEiOnsiY29udHJhY3Rvck5hbWUiOiJGaWJlclBheSAtIHphcFx1MDE0MmFjb25vIHByemV6IHRlc3RlciIsImNvbnRyYWN0b3JJYmFuIjoiRmliZXJQYXkiLCJhbW91bnQiOiI4LjAwIiwiY3VycmVuY3kiOiJQTE4iLCJkZXNjcmlwdGlvbiI6ImEzeHY2emc5IiwiYmFua1JlZmVyZW5jZUNvZGUiOiJURVNUX2FrNGJobmVjIiwib3BlcmF0aW9uQ29kZSI6bnVsbCwiYWNjb3VudEliYW4iOiIiLCJib29rZWRBdCI6IjIwMjEtMDYtMzAgMjE6NTI6MjAiLCJjcmVhdGVkQXQiOiIyMDIxLTA2LTMwIDIxOjUyOjIwIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0zMCAyMTo1MjoyMCJ9LCJ0eXBlIjoiYmFua1RyYW5zYWN0aW9uIn0sInR5cGUiOiJjb2xsZWN0X29yZGVyX2l0ZW1fcmVjZWl2ZWQiLCJjdXN0b21QYXJhbXMiOm51bGx9LCJpc3MiOiJGaWJlcnBheSIsImlhdCI6MTYyNTA4Mjc4NH0.5UqfPL-CF-58Si1wAEQ1fiZjwknxPxLu08cWgfJMm80';
        \Yii::info(JSON::encode($this->request->headers), 'own');
        \Yii::info(JSON::encode($this->request->rawBody), 'own');

        try {
            $body = JSON::decode($this->request->rawBody);


            $status = $body['status'];
            \Yii::info($status, 'own');

            $hashDecoded = JSON::decode(MgHelpers::decrypt($hash));
            \Yii::info($hashDecoded, 'own');
            $paymentId = $hashDecoded['paymentId'];
            $userId = $hashDecoded['userId'];
            $payment = Payment::find()->where(['id' => $paymentId, 'user_id' => $userId])->one();
            if (!$payment) {
                $this->throw404();
            }

            if ($payment->status == Payment::STATUS_PAYMENT_CONFIRMED) {
                \Yii::info('already confirmed ' . $payment->id, 'own');
                return 'ok';
            }

            switch ($status) {
                case 'PAID':
                    $payment->status = Payment::STATUS_PAYMENT_CONFIRMED;
                    $project = $payment->project;
                    $project->money += $payment->amount;
                    $saved = $project->save();
                    break;
                default:
                    $payment->status = Payment::STATUS_UNKNOWN;
                    break;
            }
            $saved = $payment->save();


            \Yii::info('saved ' . $saved, 'own');

            Yii::$app->mailer->compose('afterBuy', ['model' => $payment])
                ->setTo($payment->user->email)
                ->setFrom([MgHelpers::getSetting('email from') => MgHelpers::getSetting('email from name')])
                ->setSubject(Yii::t('db', 'Thank you for purchase'))
                ->send();

            \Yii::info('mail ', 'own');
        } catch (Exception $e) {
            \Yii::info('error: ' . $e->getMessage(), 'own');
        }
        return 'OK';
    }

    public function actionNotifyPrzelewy24($hash)
    {
        \Yii::info("notifyp24", 'own');
        \Yii::info($hash, 'own');

        \Yii::info("post", 'own');
        \Yii::info(Yii::$app->request->post(), 'own');




        $hashDecoded = JSON::decode(MgHelpers::decrypt($hash));
        \Yii::info($hashDecoded, 'own');
        $paymentId = $hashDecoded['paymentId'];
        $userId = $hashDecoded['userId'];
        $payment = Payment::find()->where(['id' => $paymentId, 'user_id' => $userId])->one();
        if (!$payment) {
            $this->throw404();
        }

        $przelewy24ConfigParams = MgHelpers::getConfigParam('przelewy24');
        $przelewy24Config = [
            'live' => $przelewy24ConfigParams['live'],
            'merchant_id' => $payment->project->przelewy24_merchant_id,
            'crc' => $payment->project->przelewy24_crc
        ];
        $przelewy24 = new Przelewy24($przelewy24Config);

        $webhook = $przelewy24->handleWebhook();

        \Yii::info("webhook", 'own');
        \Yii::info($webhook, 'own');


        try {

            $verifyData = [
                'session_id' => $payment->id,
                'order_id' => $webhook->orderId(),
                'amount' => (int)($payment->amount * 100),
            ];
            \Yii::info('verifyData:', 'own');
            \Yii::info($verifyData, 'own');
            $verificationRes = $przelewy24->verify($verifyData);

            $payment->status = Payment::STATUS_PAYMENT_CONFIRMED;
            $project = $payment->project;
            $project->money += $payment->amount;
            $saved = $project->save();

        } catch (Przelewy24Exception $e) {
            \Yii::info('error:', 'own');
            \Yii::info($e, 'own');
        }


        return 'OK';
    }

    public function actionBuyThankYou($hash)
    {
        $hashDecrypt = MgHelpers::decrypt($hash);
        if (!$hashDecrypt) {
            throw new \yii\web\HttpException(404, Yii::t('app', 'Not found'));
        }

        MgHelpers::setFlashSuccess(Yii::t('db', 'Thank you for investment'));
        return $this->redirect('/');
        $hashExploded = explode(':', $hashDecrypt);
        $userId = $hashExploded[0];
        $projectId = $hashExploded[1];
        $userModel = MgHelpers::getUserModel();
        if ($userId != $userModel->id) {
            throw new \yii\web\HttpException(404, Yii::t('app', 'Not found'));
        }
        $model = Project::findOne($projectId);
        if (!$model) {
            throw new \yii\web\HttpException(404, Yii::t('app', 'Not found'));
        }
        $model->language = Yii::$app->language;

        return $this->render('buyThanks', [
            'model' => $model,
        ]);
    }

    private function getCryptocurrency($currency)
    {
        $url = "https://api.alternative.me/v2/ticker/" . $currency . "/";
        $response = Json::decode(file_get_contents($url));
        return $response;
    }

    public function actionCalculator()
    {

        $btc = $this->getCryptocurrency('bitcoin');
        $eth = $this->getCryptocurrency('ethereum');

        $output = [];
        $btc_value = $btc['data']['1']['quotes']['USD']['price'];
        $eth_value = $eth['data']['1027']['quotes']['USD']['price'];

        if (isset($_POST['capital'])) {
            $capital = $_POST['capital'];
            $output['capital'] = $capital;
            $output['capital_btc'] = $capital / $btc_value;
            $output['capital_eth'] = $capital / $eth_value;

        } elseif (isset($_POST['capital_eth'])) {


            $capital_eth = $_POST['capital_eth'];
            $capital = $capital_eth * $eth_value;

            $output['capital'] = $capital;
            $output['capital_btc'] = $capital / $btc_value;
            $output['capital_eth'] = $capital_eth;

        } elseif (isset($_POST['capital_btc'])) {

            $capital_btc = $_POST['capital_btc'];
            $capital = $capital_btc * $btc_value;

            $output['capital'] = $capital;
            $output['capital_btc'] = $capital_btc;
            $output['capital_eth'] = $capital / $eth_value;

        }

        $output['income'] = $capital + ($capital * (intval(($_POST['percentage'])) / 100 * $_POST['investition_time']));

        return json_encode($output);
    }

    public function actionTokenomia()
    {
        $project = Project::find()
            ->where(['status' => Project::STATUS_ACTIVE])
            ->one();

        return $this->render('view', ['model' => $project]);
    }

    public function actionBuyTest()
    {

        $pubkey = 'ddcb401f-0ae6-46c7-9b62-81f9d6a01889';
        $privkey = 'a8d4075a-3903-4444-beb9-28833aa9be1e';

        $zondaApi = new \app\components\ZondaPayAPI($pubkey, $privkey);

        $response = $zondaApi->callApi('/payments', [
            'destinationCurrency' => 'PLN',
            'orderId' => 'e5rh45uq34udomAEADFGqaddd',
            'price' => 100,
            'sourceCurrency' => 'BTC',
            'keepSourceCurrency' => true

        ], 'POST');


        $res = Json::decode($response);
        if ($res['status'] == 'Ok' && $res['data']['url']) {
            return $this->redirect($res['data']['url']);
        }


        return $this->render('buyTest');
    }


}
