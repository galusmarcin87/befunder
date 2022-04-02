<?

use app\models\mgcms\db\Project;
use yii\web\View;
use yii\helpers\Url;


/* @var $this yii\web\View */
/* @var $model app\models\mgcms\db\Project */

?>
<div id="Calculator" class="Calculator mfp-hide">
    <form method="POST">
        <div class="Login-box__close mfp-close">&#215;</div>
        <div class="User-Panel__form-group">
            <div>
                <label>
                    <?= Yii::t('db', 'INVESTITION'); ?> ($):
                    <input
                            id="capital"
                            type="text"
                            min="0"
                            class="form-control"
                            name="capital"
                            required=""
                    />
                </label>
            </div>
            <div>
                <label>
                    <?= Yii::t('db', 'PERCENTAGE'); ?>
                    <input
                            type="text"
                            min="0"
                            class="form-control"
                            name="interest"
                            required=""
                            value="<?= $model->percentage ?>"
                            disabled="disabled"
                            id="percentage"
                    />
                </label>
            </div>
        </div>
        <div class="User-Panel__form-group">
            <div>
                <label>
                    <?= Yii::t('db', 'INVESTITION'); ?> (ETH):
                    <input
                            type="text"
                            min="0"
                            class="form-control"
                            name="capital_eth"
                            required=""
                            id="capital_eth"
                    />
                </label>
            </div>
            <div>
                <label>
                    <?= Yii::t('db', 'TOTAL'); ?>
                    ($)
                    <input
                            type="text"
                            min="0"
                            class="form-control"
                            name="capital?total"
                            required=""
                            disabled="disabled"
                            id="income"
                    />
                </label>
            </div>
        </div>
        <div class="User-Panel__form-group">
            <div>
                <label>
                    <?= Yii::t('db', 'INVESTITION'); ?> (BTC):
                    <input
                            type="text"
                            min="0"
                            class="form-control"
                            name="capital_btn"
                            required=""
                            id="capital_btc"
                    />
                </label>
            </div>
            <div class="Calculator__btn-wrapper">
                <label>
                    <a class="btn btn-success btn-block" href="<?= Url::to(['project/buy', 'id' => $model->id]) ?>">
                        <?= Yii::t('db', 'INVEST'); ?>
                    </a>
                </label>
            </div>
        </div>
    </form>
</div>
