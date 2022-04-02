<?php

namespace app\models\mgcms\db;

use Yii;
use app\components\mgcms\MgHelpers;

/**
 * This is the base model class for table "payment".
 *
 * @property integer $id
 * @property string $created_on
 * @property integer $project_id
 * @property integer $user_id
 * @property double $amount
 * @property string $status
 * @property double $percentage
 * @property integer $is_preico
 * @property string $user_token
 * @property string $statusStr
 * @property double $bonusPercentage
 * @property string $ethereum_buy_date
 * @property string $market
 *
 * @property \app\models\mgcms\db\Project $project
 * @property \app\models\mgcms\db\User $user
 */
class Payment extends \app\models\mgcms\db\AbstractRecord
{

    const STATUS_NEW = 4;
    const STATUS_SUSPENDED = 0;
    const STATUS_AFTER_PAYMENT = 1;
    const STATUS_PAYMENT_CONFIRMED = 2;
    const STATUS_PAYMENT_REALISATION = 3;
    const STATUS_UNKNOWN = 5;
    const STATUSES = [
        self::STATUS_NEW => 'Nowy',
        self::STATUS_SUSPENDED => 'Zawieszono',
        self::STATUS_AFTER_PAYMENT => 'Deklaracja inwestycji',
        self::STATUS_PAYMENT_CONFIRMED => 'Potwierdzone',
        self::STATUS_PAYMENT_REALISATION => 'Realizacja zysku',
        self::STATUS_UNKNOWN => 'Nieznany',
    ];

    public $amountInDollars;
    public $terms;
    public $type;
    public $modelAttributes = ['comments'];

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['created_on', 'amountInDollars', 'ethereum_buy_date', 'market', 'comments'], 'safe'],
            [['project_id', 'user_id', 'user_token'], 'required'],
            [['project_id', 'user_id', 'status'], 'integer'],
            [['is_preico'], 'integer', 'max' => 1],
            [['user_token'], 'string', 'max' => 245],
            [['amount'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'payment';
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'created_on' => Yii::t('app', 'Created On'),
            'project_id' => Yii::t('app', 'Project'),
            'user_id' => Yii::t('app', 'User'),
            'project' => Yii::t('app', 'Project'),
            'user' => Yii::t('app', 'User'),
            'amount' => Yii::t('db', 'Payment value'),
            'status' => Yii::t('app', 'Status'),
            'statusStr' => Yii::t('app', 'Status'),
            'percentage' => Yii::t('app', 'Percentage'),
            'is_preico' => Yii::t('app', 'Is Preico'),
            'user_token' => Yii::t('db', 'ELECTRONIC WALLET NUMBER OF WHICH I SHIP TO ETHEREUM'),
            'amountInDollars' => Yii::t('db', 'AMOUNT IN DOLLARS'),
            'ethereum_buy_date' => Yii::t('db', 'DATE OF ETHEREUM I WILL BUY'),
            'market' => Yii::t('db', 'NAME OF MARKET WHERE I WIIL BUY ETHEREUM'),
            'comments' => 'Komentarz',
            'statusToDisplay' => Yii::t('db', 'Payment status'),
            'benefitWithAmount' => Yii::t('db', 'Expected return with profit'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getProject()
    {
        return $this->hasOne(\app\models\mgcms\db\Project::className(), ['id' => 'project_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(\app\models\mgcms\db\User::className(), ['id' => 'user_id']);
    }

    /**
     * @inheritdoc
     * @return \app\models\mgcms\db\PaymentQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new \app\models\mgcms\db\PaymentQuery(get_called_class());
    }

    public function getStatusStr()
    {
        return array_key_exists($this->status, self::STATUSES) ? self::STATUSES[$this->status] : '';
    }

    public function getBonusPercentage()
    {
        if ($this->amount <= 10 && $this->amount >= 5) {
            return $this->project->bonus_5_10;
        }

        if ($this->amount <= 100 && $this->amount >= 11) {
            return $this->project->bonus_11_100;
        }

        if ($this->amount <= 1000 && $this->amount >= 101) {
            return $this->project->bonus_101_1000;
        }

        if ($this->amount > 1000) {
            return $this->project->bonus_1001;
        }

        return false;
    }

    public function save($runValidaton = true, $attributes = null)
    {
        $currentLanguage = Yii::$app->language;
        if ($this->user->language) {
            Yii::$app->language = $this->user->language;
        }
        if ($this->getOldAttribute('status') == self::STATUS_AFTER_PAYMENT && $this->getAttribute('status') == self::STATUS_PAYMENT_CONFIRMED) {
            $project = Project::findOne($this->project_id);
            $project->money_gathered = $project->money_gathered + ($this->amount * $project->token_value);
            $saved = $project->save();

            Yii::$app->mailer->compose('paymentChangedConfirmed', ['model' => $this])
                ->setTo($this->user->username)
                ->setFrom([MgHelpers::getSetting('register_email') => MgHelpers::getSetting('register_email_name')])
                ->setSubject(MgHelpers::getSettingTranslated('payment_status_changed_confirmed_subject', 'Your payment has been confirmed') . ' ' . $this->project->title)
                ->send();
        }

        if ($this->getOldAttribute('status') == self::STATUS_PAYMENT_CONFIRMED && $this->getAttribute('status') == self::STATUS_PAYMENT_REALISATION) {
            Yii::$app->mailer->compose('paymentChangedRealisation', ['model' => $this])
                ->setTo($this->user->username)
                ->setFrom([MgHelpers::getSetting('register_email') => MgHelpers::getSetting('register_email_name')])
                ->setSubject(MgHelpers::getSettingTranslated('payment_status_changed_realisation_subject', 'Your payment has been set to realisation') . ' ' . $this->project->title)
                ->send();
        }

        Yii::$app->language = $currentLanguage;

        return parent::save($runValidaton, $attributes);
    }


    public function getBenefit()
    {
        return ($this->project->percentage / 100) * $this->amount * (int)$this->project->investition_time;
    }

    public function getBenefitWithAmount()
    {
        return ($this->project->percentage / 100) * $this->amount * (int)$this->project->investition_time + $this->amount;
    }

    public function getStatusToDisplay()
    {

        $class = 'red';
        $label = Yii::t('db', 'Pay');
        switch ($this->status) {
            case Payment::STATUS_PAYMENT_CONFIRMED:
                $class = 'green';
                $label = Yii::t('db', 'Confirmed');
                break;
        }

        return '<span class="'.$class.'">'.$label.'</span>';
    }
}
