<?php

use yii\web\View;
use app\components\mgcms\MgHelpers;


/* @var $this yii\web\View */

$this->title = Yii::t('db', 'About project');


$category = \app\models\mgcms\db\Category::findOne(['name' => 'o projekcie']);
if (!$category) {
    return false;
}
$article = \app\models\mgcms\db\Article::findOne(['language' => Yii::$app->language, 'category_id' => $category->id]);

?>

    <section class="Section Section--big-padding-top O-projekcie">
        <div class="container">
            <div class="text-center">
                <h2 class="O-projekcie__header">
                    <?= MgHelpers::getSettingTypeText('O projekcie - nagłowek 1 ' . Yii::$app->language, false, 'Nowa sieć gastronomiczna
                    <span>FAST FOOD</span>') ?>

                </h2>
                <h3 class="O-projekcie__sub-header">
                    <?= MgHelpers::getSettingTypeText('O projekcie - nagłowek 2 ' . Yii::$app->language, false, 'Powstał projekt nowej sieci gastronomicznej.') ?>

                </h3>
                <h6 class="O-projekcie__desc">
                    <?= MgHelpers::getSettingTypeText('O projekcie - nagłowek 3 ' . Yii::$app->language, false, 'Jego pomysłodawcy chcą stworzyć sieć innowacyjnych lokali typu
                    fast-food, pod nazwą NOL Restaurant. <br/>
                    Restauracja będzie swoim wyglądem przypominała "latający spodek".') ?>

                </h6>
            </div>
            <div class="row animatedParent">
                <div class="col-md-6">
                    <h3 class="Section__header-icon">
                        <?= $this->render('/common/svg/comet') ?>
                        <?= MgHelpers::getSettingTypeText('O projekcie - lewy nagłowek ' . Yii::$app->language, false, 'Innowacyjna Restauracja') ?>

                    </h3>
                    <p>
                        <?= MgHelpers::getSettingTypeText('O projekcie - lewy text ' . Yii::$app->language, false, 'Przedmiotem niniejszego przedsięwzięcia jest utworzenie
                        innowacyjnej restauracji typu fast-food, która będzie swoim
                        wyglądem przypominała „latający spodek” (NOL, czyli
                        Niezidentyfikowany Obiekt Latający). Restauracja będzie oferowała
                        dania kuchni północnoamerykańskiej z elementami kuchni greckiej i
                        meksykańskiej (dania będą dostosowane do pory dnia). Restauracja
                        będzie również oferować dania "na wynos".') ?>

                    </p>
                </div>
                <div class="col-md-6">
                    <h3 class="Section__header-icon">
                        <?= $this->render('/common/svg/telescope') ?>
                        <?= MgHelpers::getSettingTypeText('O projekcie - prawy nagłowek ' . Yii::$app->language, false, 'Edukacja - rozrywka') ?>

                    </h3>
                    <p>
                        <?= MgHelpers::getSettingTypeText('O projekcie - prawy text ' . Yii::$app->language, false, 'Uzupełnieniem restauracji NOL Restaurant będzie ścieżka
                        edukacyjno-rozrywkowa o tematyce planetarnej. Po obwodzie spotka
                        na długości 84 metrów zostanie stworzona edukacyjna ścieżka układu
                        słonecznego. Obiekt będzie miał na celu w nowoczesny sposób
                        nauczać astronomii. W tym celu zostaną wykorzystane makiety
                        planet, wizualizacje tworzone przez projektory, światła i lasery,
                        stanowiska do projekcji VR.') ?>

                    </p>
                </div>
            </div>
        </div>
        <? if (count($article->files) > 0): ?>
            <div class="Carousel Image-slider">
                <div class="owl-carousel owl-theme animatedParent">
                    <? foreach ($article->files as $file): if (!$file->isImage()) continue; ?>
                        <a class="Image-slider__card" href="<?= $file->imageSrc ?>">
                            <img
                                    class="Image-slider__image fadeIn animated item"
                                    src="<?= $file->imageSrc ?>"
                                    alt=""
                            />
                        </a>
                    <? endforeach; ?>
                </div>
            </div>
        <? endif ?>
        <div class="Custom-nav Custom-nav--color-black Image-slider__nav"></div>
    </section>

    <div
            style="
        background-image: url(./svg/sygnet_gray.svg);
        background-size: 450px;
      "
            class="Section--bg-fixed Section--dark"
    >
        <section class="Section Section--transparent O-projekcie animatedParent">
            <div class="container fadeIn animated">
                <div class="row">
                    <div class="col-lg-4">
                        <h3 class="text-center">
                            <?= MgHelpers::getSettingTypeText('O projekcie - 1/3 nagłówek ' . Yii::$app->language, false, 'Budowa') ?>

                        </h3>
                        <img class="Section__fit-image"
                             src="<?= MgHelpers::getSettingTypeText('O projekcie - 1/3 zdjęcie ' . Yii::$app->language, false, '/img/_MG_0022.jpg') ?>"/>
                        <p>
                            <?= MgHelpers::getSettingTypeText('O projekcie - 1/3 text ' . Yii::$app->language, false, 'Restauracja zostanie w całości zbudowana ze stali, zaś
                            zewnętrzna obudowa zostanie wykonana z blachy ocynkowanej.
                            Obiekt, o średnicy 27 metrów i wysokości 12 metrów, będzie
                            składał się z dwóch poziomów, a w tym sali głównej oraz
                            antresoli. Po zachodzie słońca cała bryła obiektu będzie
                            oświetlana za pomocą reflektorów umieszczonych na obiekcie, jak
                            i wokół niego. Ze względu na niespotykaną konstrukcję oraz
                            ścieżkę edukacyjno-rozrywkową, obiekt będzie atrakcją
                            turystyczną w danym regionie.') ?>

                        </p>
                    </div>
                    <div class="col-lg-4">
                        <h3 class="text-center">
                            <?= MgHelpers::getSettingTypeText('O projekcie - 2/3 nagłówek ' . Yii::$app->language, false, 'Lokalizacja') ?>
                        </h3>
                        <img
                                class="Section__fit-image Section__fit-image--center"
                                src="<?= MgHelpers::getSettingTypeText('O projekcie - 2/3 zdjęcie ' . Yii::$app->language, false, '/img/n3.jpg') ?>"
                        />
                        <p>
                            <?= MgHelpers::getSettingTypeText('O projekcie - 2/3 text ' . Yii::$app->language, false, 'Ze względu na charakter restauracji idealna lokalizacja to
                            działka umiejscowiona przy drodze szybkiego ruchu na obrzeżach
                            dużego miasta, gdzie występuje duże natężenie ruchu, a kierowcy
                            i podróżni chcą odpocząć i zjeść szybki posiłek. Zapewni to
                            optymalne wykorzystanie zasobów obiektu oraz realizację
                            przyjętych założeń sprzedażowych. Po sfinalizowaniu założonego
                            celu, czyli otwarciu pierwszej restauracji NOL Restaurant,
                            spółka wybuduje kolejne obiekty, przy najbardziej ruchliwych
                            szlakach komunikacyjnych w Polsce (16 obiektów po jednym na
                            każde województwo).') ?>

                        </p>
                    </div>
                    <div class="col-lg-4">
                        <h3 class="text-center">
                            <?= MgHelpers::getSettingTypeText('O projekcie - 3/3 nagłówek ' . Yii::$app->language, false, 'Czas realizacji') ?>

                        </h3>
                        <img
                                class="Section__fit-image Section__fit-image--center"
                                src="<?= MgHelpers::getSettingTypeText('O projekcie - 3/3 zdjęcie ' . Yii::$app->language, false, '/img/n5.jpg') ?>"
                        />
                        <p>
                            <?= MgHelpers::getSettingTypeText('O projekcie - 3/3 text ' . Yii::$app->language, false, 'Planowany okres realizacji projektu do momentu rozpoczęcia
                            działalności operacyjnej wynosi 12 miesięcy, z czego etap budowy
                            i wykończenia nieruchomości wynosi około 6 miesięcy.') ?>

                        </p>
                    </div>
                </div>
                <div class="Owner">
                    <h3 class="Header-icon">
                        <?= Yii::t('db', 'Founder'); ?>
                        <img class="Header-icon__icon" src="/svg/znaczek.svg" alt=""/>
                    </h3>
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="Owner__block">
                                <img class="Image--rounded"
                                     src="<?= MgHelpers::getSetting('home - tworca zdjecie', false, '/img/0.jfif') ?>"
                                     alt=""/>
                                <div>
                                    <div class="Header--big">
                                        <?= MgHelpers::getSetting('home - tworca nazwa', false, 'Maciej<br />Konieczny') ?>
                                    </div>
                                    <p class="Owner_desc">
                                        <?= MgHelpers::getSettingTypeText('Home tworca text ' . Yii::$app->language, false, 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                                odit aut fugit, sed quia consequuntur magni dolores eos qui
                                ratione voluptatem sequi nesciunt. Neque porro.') ?>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-5 text-right">
                            <div class="buttons-list buttons-list--reverse">
                                <a
                                        class="btn btn-small btn-primary--reverse"
                                        href="phone:<?= MgHelpers::getSetting('home - tworca telefon', false, '+48 784 112 895') ?>"
                                >
                                    <svg
                                            class="buttons-list__icon"
                                            enable-background="new 0 0 512.021 512.021"
                                            height="512"
                                            fill="#e63331"
                                            viewBox="0 0 512.021 512.021"
                                            width="512"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g>
                                            <path
                                                    d="m367.988 512.021c-16.528 0-32.916-2.922-48.941-8.744-70.598-25.646-136.128-67.416-189.508-120.795s-95.15-118.91-120.795-189.508c-8.241-22.688-10.673-46.108-7.226-69.612 3.229-22.016 11.757-43.389 24.663-61.809 12.963-18.501 30.245-33.889 49.977-44.5 21.042-11.315 44.009-17.053 68.265-17.053 7.544 0 14.064 5.271 15.645 12.647l25.114 117.199c1.137 5.307-.494 10.829-4.331 14.667l-42.913 42.912c40.482 80.486 106.17 146.174 186.656 186.656l42.912-42.913c3.837-3.837 9.36-5.466 14.667-4.331l117.199 25.114c7.377 1.581 12.647 8.101 12.647 15.645 0 24.256-5.738 47.224-17.054 68.266-10.611 19.732-25.999 37.014-44.5 49.977-18.419 12.906-39.792 21.434-61.809 24.663-6.899 1.013-13.797 1.518-20.668 1.519zm-236.349-479.321c-31.995 3.532-60.393 20.302-79.251 47.217-21.206 30.265-26.151 67.49-13.567 102.132 49.304 135.726 155.425 241.847 291.151 291.151 34.641 12.584 71.867 7.64 102.132-13.567 26.915-18.858 43.685-47.256 47.217-79.251l-95.341-20.43-44.816 44.816c-4.769 4.769-12.015 6.036-18.117 3.168-95.19-44.72-172.242-121.772-216.962-216.962-2.867-6.103-1.601-13.349 3.168-18.117l44.816-44.816z"
                                            />
                                            <path
                                                    d="m496.02 272c-8.836 0-16-7.164-16-16 0-123.514-100.486-224-224-224-8.836 0-16-7.164-16-16s7.164-16 16-16c68.381 0 132.668 26.628 181.02 74.98s74.98 112.639 74.98 181.02c0 8.836-7.163 16-16 16z"
                                            />
                                            <path
                                                    d="m432.02 272c-8.836 0-16-7.164-16-16 0-88.224-71.776-160-160-160-8.836 0-16-7.164-16-16s7.164-16 16-16c105.869 0 192 86.131 192 192 0 8.836-7.163 16-16 16z"
                                            />
                                            <path
                                                    d="m368.02 272c-8.836 0-16-7.164-16-16 0-52.935-43.065-96-96-96-8.836 0-16-7.164-16-16s7.164-16 16-16c70.58 0 128 57.42 128 128 0 8.836-7.163 16-16 16z"
                                            />
                                        </g>
                                    </svg>

                                    +<?= MgHelpers::getSetting('home - tworca telefon', false, '+48 784 112 895') ?></a
                                >
                                <a
                                        class="btn btn-small btn-primary--reverse"
                                        href="mailto:<?= MgHelpers::getSetting('home - tworca email', false, 'm.konieczny@nolgroup.pl') ?>"
                                >
                                    <svg
                                            class="buttons-list__icon"
                                            enable-background="new 0 0 511.998 511.998"
                                            height="512"
                                            viewBox="0 0 511.998 511.998"
                                            width="512"
                                            fill="#e63331"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g>
                                            <path
                                                    d="m431.665 139.258v-122.04h-351.332v122.04l-80.333 57.38v298.142h511.998v-298.142zm-249.673 202.811-151.992 108.564v-217.128zm74.007-15.994 194.191 138.705h-388.382zm74.007 15.994 151.992-108.564v217.127zm141.185-137.712-39.526 28.232v-56.464zm-69.526-157.139v206.8l-97.466 69.618-48.2-34.428-48.2 34.428-97.466-69.618v-206.8zm-321.332 185.372-39.526-28.232 39.526-28.232z"
                                            />
                                            <path d="m152.716 86.074h103.283v30h-103.283z"/>
                                            <path d="m152.716 154.929h206.566v30h-206.566z"/>
                                            <path d="m152.716 223.785h206.566v30h-206.566z"/>
                                        </g>
                                    </svg>

                                    <?= MgHelpers::getSetting('home - tworca email', false, 'm.konieczny@nolgroup.pl') ?></a
                                >
                                <a
                                        class="btn btn-small btn-primary--reverse"
                                        href="<?= MgHelpers::getSetting('home - tworca linkedin', false, 'https://linkedin.pl/nolrestaurant') ?>"
                                >
                                    <svg
                                            class="buttons-list__icon"
                                            height="682pt"
                                            viewBox="-21 -35 682.66669 682"
                                            fill="#e63331"
                                            width="682pt"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                d="m77.613281-.667969c-46.929687 0-77.613281 30.816407-77.613281 71.320313 0 39.609375 29.769531 71.304687 75.8125 71.304687h.890625c47.847656 0 77.625-31.695312 77.625-71.304687-.894531-40.503906-29.777344-71.320313-76.714844-71.320313zm0 0"
                                        />
                                        <path
                                                d="m8.109375 198.3125h137.195313v412.757812h-137.195313zm0 0"
                                        />
                                        <path
                                                d="m482.054688 188.625c-74.011719 0-123.640626 69.546875-123.640626 69.546875v-59.859375h-137.199218v412.757812h137.191406v-230.5c0-12.339843.894531-24.660156 4.519531-33.484374 9.917969-24.640626 32.488281-50.167969 70.390625-50.167969 49.644532 0 69.5 37.851562 69.5 93.339843v220.8125h137.183594v-236.667968c0-126.78125-67.6875-185.777344-157.945312-185.777344zm0 0"
                                        />
                                    </svg>

                                    <?= MgHelpers::getSetting('home - tworca linkedin label', false, 'linkedin.pl/nolrestaurant') ?></a
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>


    <section class="Section Analize animatedParent">
        <div class="container fadeIn animated articleContent">
            <?= $article->content ?>
        </div>
    </section>