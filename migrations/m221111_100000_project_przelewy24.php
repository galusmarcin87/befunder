<?php

use yii\db\Migration;

/**
 * Class m171121_120201_user
 */
class m221111_100000_project_przelewy24 extends Migration
{

    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->addColumn('project', 'przelewy24_merchant_id', $this->integer());
        $this->addColumn('project', 'przelewy24_crc', $this->string(20));
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {

    }
}
