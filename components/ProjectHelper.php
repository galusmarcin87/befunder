<?php

namespace app\components;

use Yii;
use app\models\mgcms\db\Setting;

/**
 * Helpers class
 * @author marcin
 */
class ProjectHelper extends \yii\base\Component
{

    static function getFormFieldConfig($withPlaceholders = true)
    {
        if ($withPlaceholders) {
            return [
                'options' => [
                    'class' => "Contact-form__label",
                ],
                'template' => "{input}\n{label}\n{error}",
                'inputOptions' => ['class' => 'Form__input Register__input form-control'],
                'labelOptions' => [
                    'class' => "Form__label",
                ],
                'wrapperOptions' => [
                    'class' => "Form__group  form-group",
                ]
            ];
        } else {
            return [


                'options' => [
                    'class' => "Contact-form__label",
                    'tag' => 'label',
                ],
                'template' => "{beginWrapper}{input}\n\n{error}{endWrapper}",
                'inputOptions' => ['class' => 'Contact-form__input form-control'],
                'labelOptions' => [
                    'class' => "Contact-form__label",
                ],
                'wrapperOptions' => [
                    'class' => "Contact-form__label",

                ]
            ];
        }
    }
}
