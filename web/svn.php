<?php
echo shell_exec('cd ../ &&  git pull && php yii migrate --interactive=0');


