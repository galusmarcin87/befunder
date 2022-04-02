<?

use app\models\mgcms\db\Project;
use app\components\mgcms\MgHelpers;

$category = \app\models\mgcms\db\Category::findOne(['name'=>'roadmap '.  Yii::$app->language]);
if(!$category){
    return false;
}


?>


<section class="Section Section--transparent Projects animatedParent">
    <div class="container fadeIn animated">
        <div class="row">
            <div class="col-lg-4 col-md-6 grid">
                <svg
                        version="1.1"
                        class="Section__icon-two"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style="enable-background: new 0 0 512 512"
                        xml:space="preserve"
                >
                <linearGradient id="gradient-horizontal-two">
                    <stop offset="0%" stop-color="var(--color-stop-1)"/>
                    <stop offset="50%" stop-color="var(--color-stop-2)"/>
                    <stop offset="100%" stop-color="var(--color-stop-3)"/>
                </linearGradient>
                    <g>
                        <g>
                            <path
                                    d="M401,401c-20.671,0-38.255,13.42-44.531,32H79c-27.019,0-49-21.981-49-49c0-27.019,21.981-49,49-49h96
                  c43.561,0,79-35.439,79-79c0-43.561-35.439-79-79-79H91.531C86.848,163.134,75.866,152.152,62,147.469V111h81
                  c8.284,0,15-6.716,15-15V32c0-8.284-6.716-15-15-15H47c-8.284,0-15,6.716-15,15v64v51.469C13.42,153.745,0,171.329,0,192
                  c0,25.916,21.084,47,47,47c20.671,0,38.255-13.42,44.531-32H175c27.019,0,49,21.981,49,49s-21.981,49-49,49H79
                  c-43.561,0-79,35.439-79,79c0,43.561,35.439,79,79,79h277.469c6.276,18.58,23.86,32,44.531,32c25.916,0,47-21.084,47-47
                  S426.916,401,401,401z M62,47h66v34H62V47z M47,209c-9.374,0-17-7.626-17-17c0-9.374,7.626-17,17-17s17,7.626,17,17
                  C64,201.374,56.374,209,47,209z M401,465c-9.374,0-17-7.626-17-17c0-9.374,7.626-17,17-17c9.374,0,17,7.626,17,17
                  C418,457.374,410.374,465,401,465z"
                            />
                        </g>
                    </g>
                    <g>
                        <g>
                            <path
                                    d="M401,113c-25.916,0-47,21.084-47,47s21.084,47,47,47s47-21.084,47-47S426.916,113,401,113z M401,177
                  c-9.374,0-17-7.626-17-17c0-9.374,7.626-17,17-17c9.374,0,17,7.626,17,17C418,169.374,410.374,177,401,177z"
                            />
                        </g>
                    </g>
                    <g>
                        <g>
                            <path
                                    d="M401,49c-61.206,0-111,49.794-111,111c0,33.051,14.399,63.844,39.626,85.015l58.01,113.797
                  C390.197,363.837,395.36,367,401,367s10.803-3.163,13.364-8.188l58.01-113.797C497.601,223.844,512,193.051,512,160
                  C512,98.794,462.206,49,401,49z M451.15,223.613c-1.698,1.341-3.085,3.032-4.068,4.96L401,318.972l-46.082-90.399
                  c-0.982-1.927-2.37-3.619-4.068-4.96C331.244,208.132,320,184.946,320,160c0-44.664,36.336-81,81-81s81,36.336,81,81
                  C482,184.946,470.756,208.132,451.15,223.613z"
                            />
                        </g>
                    </g>
              </svg>
                <h2 class="Projects__header"><?= Yii::t('db', 'Road map'); ?></h2>

                <p>
                    <?= MgHelpers::getSettingTranslated('home - roadmap - text', 'Sprawdź kolejność wydarzeń jakie mają miejsce przy NOL
                        restaurant. Informujemy o wszystkich kluczowych wydarzeniach
                        abyście Państwo byli na bieżąco.') ?>

                </p>
                <div class="Custom-nav" id="projects-nav"></div>
            </div>
            <div class="col-lg-8 col-md-6">
                <div class="Carousel">
                    <div class="owl-carousel owl-theme animatedParent">
                        <?foreach($category->articles as $article):?>
                            <div class="Projects__card fadeIn animated item">
                                <div class="Projects__card__header">
                                    <div class="Projects__card__heading"><?=$article->custom?></div>
                                </div>
                                <div class="Projects__card__body">
                                    <h4><?=$article->title?></h4>
                                    <p class="Projects__card__text">
                                        <?=$article->excerpt?>
                                    </p>
                                </div>
                            </div>
                        <?endforeach;?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
