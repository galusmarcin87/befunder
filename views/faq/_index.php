<?
/* @var $model app\models\mgcms\db\FaqItem */

?>

<div class="Accordion__card fadeIn animated">
    <a
            class="Accordion__card__header collapsed"
            role="tab"
            id="heading-<?= $model->id ?>"
            data-toggle="collapse"
            href="#collapse-<?= $model->id ?>"
            aria-expanded="true"
            aria-controls="collapseOne"
    >
        <div><?= $model->question ?></div>
    </a>

    <div
            id="collapse-<?= $model->id ?>"
            class="Accordion__card__collapse collapse"
            role="tabpanel"
            aria-labelledby="heading-<?= $model->id ?>"
            data-parent="#accordion"
    >
        <div class="Accordion__card__body" style="display: none">
            <?= $model->answer ?>
        </div>
    </div>
</div>
