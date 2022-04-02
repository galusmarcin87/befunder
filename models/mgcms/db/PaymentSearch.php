<?php

namespace app\models\mgcms\db;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\mgcms\db\Payment;
use app\components\mgcms\MgHelpers;

/**
 * app\models\mgcms\db\PaymentSearch represents the model behind the search form about `app\models\mgcms\db\Payment`.
 */
 class PaymentSearch extends Payment
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'project_id', 'user_id'], 'integer'],
            [['created_on', 'status', 'is_preico', 'user_token', 'user_id'], 'safe'],
            [['amount', 'percentage'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Payment::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'sort'=> ['defaultOrder' => ['created_on'=>SORT_DESC]]
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'created_on' => $this->created_on,
            'project_id' => $this->project_id,
            'user_id' => $this->user_id,
            'amount' => $this->amount,
            'percentage' => $this->percentage,
        ]);

        $query->andFilterWhere(['like', 'status', $this->status])
            ->andFilterWhere(['like', 'is_preico', $this->is_preico])
            ->andFilterWhere(['like', 'user_token', $this->user_token]);

        return $dataProvider;
    }
}
