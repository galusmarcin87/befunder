<?php

use yii\db\Migration;

/**
 * Class m171121_120201_user
 */
class m220622_100000_project_order extends Migration
{

    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->addColumn('project', 'order', $this->integer());
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {

    }
}
