<?php

namespace app\controllers;

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

class ProjectController extends \app\components\mgcms\MgCmsController
{

    public function actionIndex()
    {

        $dataProvider = new ActiveDataProvider([
            'query' => Project::find()->where(['status' => [Project::STATUS_ACTIVE, Project::STATUS_PLANNED]]),
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
    public function actionView($name)
    {
        $model = Project::find()->where(['name' => $name])->one();
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
        if ($user->status != User::STATUS_VERIFIED) {
            MgHelpers::setFlash(MgHelpers::FLASH_TYPE_WARNING, Yii::t('db', 'You need to verify by Fiber ID, to do so go to <a href="' . Url::to('site/verify-fiber-id')) . '">Verify</a>');
            return $this->redirect(['site/account']);
        }




        $project = Project::find()
            ->where(['status' => Project::STATUS_ACTIVE, 'id' => $id])
            ->one();

        if (!$project->fiber_collect_id) {
            MgHelpers::setFlashError(Yii::t('db', 'Project does not have fiber collect id'));
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
            $payment->percentage = rand(1000, 10000); //sessionId
            $payment->user_token = 'aaa';
            $saved = $payment->save();
            $hash = MgHelpers::encrypt(JSON::encode(['userId' => $payment->user_id, 'paymentId' => $payment->id]));
            $payment->user_token = $hash;
            $payment->save();

            $fiberPayConfig = MgHelpers::getConfigParam('fiberPay');
            $fiberClient = new FiberPayClient($fiberPayConfig['apikey'], $fiberPayConfig['secretkey'], $fiberPayConfig['testServer']);

            $item = $fiberClient->addCollectItem(
                $project->fiber_collect_id,
                $project->pay_description . ' od '. ($user->first_name . ' ' . $user->last_name),
                $payment->amount,
                'PLN',
                Url::to(['project/notify', 'hash' => $hash], true),
                $hash, null,
                Url::to(['site/account'], true)
            );
            $itemObj = Json::decode($item);



            $this->redirect($itemObj['data']['redirect']);
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

//        $headers = JSON::decode('{"user-agent":["Apache-HttpClient/4.1.1 (java 1.5)"],"content-type":["application/json"],"accept":["application/json"],"api-key":["dNlZtEJrvaJDJ5EX"],"content-length":["1484"],"connection":["close"],"host":["piesto.vertesprojekty.pl"]}');
//        $body = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7Im9yZGVySXRlbSI6eyJkYXRhIjp7ImNvZGUiOiJhM3h2NnpnOSIsInN0YXR1cyI6InJlY2VpdmVkIiwidHlwZSI6ImNvbGxlY3RfaXRlbSIsImN1cnJlbmN5IjoiUExOIiwiYW1vdW50IjoiOC4wMCIsImZlZXMiOltdLCJ0b05hbWUiOiJhc2RzYSIsInBhcmVudENvZGUiOiJheWsyZ3FqczZoZDUiLCJkZXNjcmlwdGlvbiI6IlBpZXN0byIsIm1ldGFkYXRhIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIxLTA2LTMwIDIxOjUyOjA3IiwidXBkYXRlZEF0IjoiMjAyMS0wNi0zMCAyMTo1MjoyMCIsInJlZGlyZWN0IjoiaHR0cHM6XC9cL3Rlc3QuZmliZXJwYXkucGxcL29yZGVyXC9hM3h2NnpnOSJ9LCJpbnZvaWNlIjp7ImFtb3VudCI6IjguMDAiLCJjdXJyZW5jeSI6IlBMTiIsImliYW4iOiJQTDE5MTk0MDEwNzYzMjAyODAxMDAwMDJURVNUIiwiYmJhbiI6IjE5MTk0MDEwNzYzMjAyODAxMDAwMDJURVNUIiwiZGVzY3JpcHRpb24iOiJhM3h2NnpnOSJ9LCJsaW5rcyI6eyJyZWwiOiJzZWxmIiwiaHJlZiI6Imh0dHBzOlwvXC9hcGl0ZXN0LmZpYmVycGF5LnBsXC8xLjBcL29yZGVyc1wvY29sbGVjdFwvaXRlbVwvYTN4djZ6ZzkifX0sInRyYW5zYWN0aW9uIjp7ImRhdGEiOnsiY29udHJhY3Rvck5hbWUiOiJGaWJlclBheSAtIHphcFx1MDE0MmFjb25vIHByemV6IHRlc3RlciIsImNvbnRyYWN0b3JJYmFuIjoiRmliZXJQYXkiLCJhbW91bnQiOiI4LjAwIiwiY3VycmVuY3kiOiJQTE4iLCJkZXNjcmlwdGlvbiI6ImEzeHY2emc5IiwiYmFua1JlZmVyZW5jZUNvZGUiOiJURVNUX2FrNGJobmVjIiwib3BlcmF0aW9uQ29kZSI6bnVsbCwiYWNjb3VudEliYW4iOiIiLCJib29rZWRBdCI6IjIwMjEtMDYtMzAgMjE6NTI6MjAiLCJjcmVhdGVkQXQiOiIyMDIxLTA2LTMwIDIxOjUyOjIwIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0zMCAyMTo1MjoyMCJ9LCJ0eXBlIjoiYmFua1RyYW5zYWN0aW9uIn0sInR5cGUiOiJjb2xsZWN0X29yZGVyX2l0ZW1fcmVjZWl2ZWQiLCJjdXN0b21QYXJhbXMiOm51bGx9LCJpc3MiOiJGaWJlcnBheSIsImlhdCI6MTYyNTA4Mjc4NH0.5UqfPL-CF-58Si1wAEQ1fiZjwknxPxLu08cWgfJMm80';
        \Yii::info(JSON::encode($this->request->headers), 'own');
        \Yii::info(JSON::encode($this->request->rawBody), 'own');

        $body = $this->request->rawBody;
        $headers = $this->request->headers;
        $jwtDecoded = JWT::decode($body);
        $status = $jwtDecoded->payload->orderItem->data->status;
        \Yii::info($status, 'own');
        $fiberPayConfig = MgHelpers::getConfigParam('fiberPay');
        $apiKey = $headers['api-key'];
        \Yii::info($apiKey, 'own');
        if ($apiKey != $fiberPayConfig['apikey']) {
            $this->throw404();
        }
        $hashDecoded = JSON::decode(MgHelpers::decrypt($hash));
        \Yii::info($hashDecoded, 'own');
        $paymentId = $hashDecoded['paymentId'];
        $userId = $hashDecoded['userId'];
        $payment = Payment::find()->where(['id' => $paymentId, 'user_id' => $userId])->one();
        if (!$payment) {
            $this->throw404();
        }

        switch ($status) {
            case 'received':
                $payment->status = Payment::STATUS_PAYMENT_CONFIRMED;
                $project = $payment->project;
                $project->money += $payment->amount;
                $saved = $project->save();
                break;
            case 'Canceled':
                $payment->status = Payment::STATUS_SUSPENDED;
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

        return 'OK';
    }

    public function actionBuyThankYou($hash)
    {
        $hashDecrypt = MgHelpers::decrypt($hash);
        if (!$hashDecrypt) {
            throw new \yii\web\HttpException(404, Yii::t('app', 'Not found'));
        }
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

        return $this->render('buyTest');
    }
}
