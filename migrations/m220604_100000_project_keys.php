<?php

use yii\db\Migration;

/**
 * Class m171121_120201_user
 */
class m220604_100000_project_keys extends Migration
{

    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->addColumn('project', 'public_key', $this->string(255));
        $this->addColumn('project', 'private_key', $this->string(255));
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {

    }
}
