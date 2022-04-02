<?php

namespace app\models;

use Yii;
use yii\base\Model;
use app\components\mgcms\MgHelpers;
use app\models\mgcms\db\User;
use kartik\password\StrengthValidator;

class RegisterForm extends Model
{

    public $username;
    public $password;
    public $passwordRepeat;
    public $acceptTerms;
    public $acceptTerms2;
    public $acceptTerms3;
    public $acceptTerms4;
    public $acceptTerms5;
    public $acceptTerms6;
    public $firstName;
    public $surname;
    public $phone;


    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            // username and password are both required
            [['username', 'password', 'passwordRepeat', 'firstName', 'surname'], 'required'],
            [['password'], StrengthValidator::className(),
                'min' => 8,
                'digit' => 1,
                'upper' => 1,
                'lower' => 1,
                'special' => 0,
                'userAttribute' => 'username'],
            ['passwordRepeat', 'compare', 'compareAttribute' => 'password', 'message' => Yii::t('db', "Passwords don't match")],
            [['acceptTerms', 'acceptTerms2', 'acceptTerms3', 'acceptTerms4'], 'required', 'requiredValue' => 1, 'message' => Yii::t('db', 'This field is required')],
            ['username', 'email'],
            [['phone', 'acceptTerms5', 'acceptTerms6'], 'safe'],
//        [['password'], StrengthValidator::className(), 'min' => 8, 'digit' => 1, 'special' => 1, 'upper' => 1, 'lower' => 1, 'userAttribute' => 'username'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'username' => Yii::t('db', 'E-mail address'),
            'password' => Yii::t('db', 'Password'),
            'firstName' => Yii::t('db', 'First name'),
            'surname' => Yii::t('db', 'Surname'),
            'phone' => Yii::t('db', 'Phone'),
            'passwordRepeat' => Yii::t('db', 'Repeat password'),
            'acceptTerms' => MgHelpers::getSettingTranslated('register_terms_label1', 'Akceptuje <a href="#">regulamin</a> serwisu i wyrażamzgode...'),
            'acceptTerms2' => MgHelpers::getSettingTranslated('register_terms_label2', 'Akceptuje <a href="#">regulamin</a> serwisu i wyrażamzgode...'),
            'acceptTerms3' => MgHelpers::getSettingTranslated('register_terms_label3', 'Akceptuje <a href="#">regulamin</a> serwisu i wyrażamzgode...'),
            'acceptTerms4' => MgHelpers::getSettingTranslated('register_terms_label4', 'Akceptuje <a href="#">regulamin</a> serwisu i wyrażamzgode...'),
            'acceptTerms5' => MgHelpers::getSettingTranslated('register_terms_label5', 'Akceptuje <a href="#">regulamin</a> serwisu i wyrażamzgode...'),
            'acceptTerms6' => MgHelpers::getSettingTranslated('register_terms_label6', 'Akceptuje <a href="#">regulamin</a> serwisu i wyrażamzgode...'),
        ];
    }

    public function register()
    {

        if ($this->validate()) {
            $user = new mgcms\db\User;
            $user->username = $this->username;
            $user->password = $this->password;
            $user->role = User::ROLE_CLIENT;
            $user->status = 1;
            $user->language = Yii::$app->language;
            $user->first_name = $this->firstName;
            $user->last_name = $this->surname;
            $user->phone = $this->phone;
            $user->acceptTerms5 = (int)$this->acceptTerms5;
            $user->acceptTerms6 = (int)$this->acceptTerms6;
            $saved = $user->save();
            if (!$saved) {
                MgHelpers::setFlashError(Yii::t('db', 'Error during registration:') . MgHelpers::getErrorsString($user->getErrors()));
                return false;
            }

            /* @var $mailer \yii\swiftmailer\Mailer */
            $mailer = Yii::$app->mailer->compose('activation', [
                'model' => $user
            ])
                ->setTo($user->username)
                ->setFrom([MgHelpers::getSetting('email from') => MgHelpers::getSetting('email from name')])
                ->setSubject(MgHelpers::getSettingTranslated('register_activation_email_subject', 'Noble Platform - activation'));
            $sent = $mailer->send();

            if (!$sent) {
                MgHelpers::setFlashError(Yii::t('db', 'Error during sending activation email'));
            } else {
                MgHelpers::setFlashSuccess(Yii::t('db', 'Account successfully created, check your email for activation link'));
            }

            return true;
        }
        return false;
    }
}
