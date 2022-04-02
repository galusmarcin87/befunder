<?php
$knowledgeBaseLeft = app\models\mgcms\db\Faq::find()->where(['lang' => Yii::$app->language, 'type' => app\models\mgcms\db\Faq::TYPE_JEVERERY_AND_DIAMONDS])->one();
$knowledgeBaseRight = app\models\mgcms\db\Faq::find()->where(['lang' => Yii::$app->language, 'type' => app\models\mgcms\db\Faq::TYPE_TOKENS])->one();

?>

<main>
  <? if ($knowledgeBaseLeft || $knowledgeBaseRight): ?>
    <section id="blog" class="blog">
      <div class="container">
        <h2><span><span><span></span></span> <?= Yii::t('db', 'Knowledge base'); ?><span><span></span> </span></span></h2>
        <div class="row animatedParent">
          <? if ($knowledgeBaseLeft): ?>
            <div class="col-lg-6 animated fadeInLeftShort">
              <h3><?= $knowledgeBaseLeft->name ?></h3>
              <? foreach ($knowledgeBaseLeft->getTopFaqItems() as $faqItem): ?>
                <?= $this->render('/faq/_index', ['model' => $faqItem]) ?>
              <? endforeach ?>
              <div class="blog-footer"><a class="btn btn-black" href="<?= $knowledgeBaseLeft->linkUrl ?>"><?= Yii::t('db', 'SEE ALL'); ?><span></span></a></div>
            </div>
          <? endif ?>
          <? if ($knowledgeBaseRight): ?>
            <div class="col-lg-6 animated fadeInRightShort">
              <h3><?= $knowledgeBaseRight->name ?></h3>
              <? foreach ($knowledgeBaseRight->getTopFaqItems() as $faqItem): ?>
                <?= $this->render('/faq/_index', ['model' => $faqItem]) ?>
              <? endforeach ?>
              <div class="blog-footer"><a class="btn btn-black" href="<?= $knowledgeBaseRight->linkUrl ?>"><?= Yii::t('db', 'SEE ALL'); ?><span></span></a></div>
            </div>
          <? endif ?>
        </div>
      </div>
    </section>
  <? endif ?>
</main>
