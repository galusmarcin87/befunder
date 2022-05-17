<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */

/* @var $model app\models\mgcms\db\User */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use app\components\mgcms\MgHelpers;
use yii\bootstrap\Tabs;

$this->title = Yii::t('db', 'My account');
$this->params['breadcrumbs'][] = $this->title;


?>

<section class="login-register dashboard">
    <div class="container">
        <h2><?= Yii::t('db', 'Investor account') ?></h2>

        <div class="contact__form">
            <?
            $tabsItems = [
                [
                    'label' => MgHelpers::getSettingTranslated('account_tab1', 'My investitions'),
                    'content' => $this->render('account/tokensGrid', [
                        'user' => $model
                    ]),
                    'options' => ['id' => 'myTokens'],
                ],
                [
                    'label' => MgHelpers::getSettingTranslated('account_tab2', 'My data'),
                    'content' => $this->render('account/data', [
                        'model' => $model
                    ]),
                    'options' => ['id' => 'myAccount'],
                ],
                [
                    'label' => MgHelpers::getSettingTranslated('account_tab3', 'Account settings'),
                    'content' => $this->render('account/settings', [
                        'model' => $model
                    ]),
                    'options' => ['id' => 'settings'],
                ],
            ];

            echo Tabs::widget([
                'items' => $tabsItems,
                'linkOptions' => [
                    'class' => 'button button--big'
                ]
            ]);

            ?>
        </div>

    </div>
</section>
