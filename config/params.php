<?php
return [
    'adminEmail' => 'formularz@piesto.io',
    'roles' => ['admin', 'front', 'team', 'project owner'],
    'languages' => ['pl', 'en', 'de', 'fr'],
    'languagesDisplay' => ['pl', 'en', 'de', 'fr'],
    'icon-framework' => 'bsg',
    'containerComponents' => require __DIR__ . '/containerComponents.php',
    'secretKey' => 'IASD77asdj**dkdl%*',
    'getResponseApiKEy' => 'x6jm830hxgpgi1l0v7ls4o8wvi3ry2gj',
    'tokeneoToken' => '26f1d3a6d3ef42962e8f565d5ddefd5c3fb4f502e64c5ea4c694df45012641eb',
    'tokeneoShopId' => 22,
    'tokeneoEndpointUrl' => 'https://sandbox.pay.tokeneo.com/v1/order',
    'tokeneoIp' => '18.158.21.113',
    'tokeneoIp2' => '18.158.184.206',
    'recaptcha' => [
        'siteKey' => '6LeTfKsbAAAAAKHoxDeBQeyOxgKMkwP15azy0Itf',
        'secretKey' => '6LeTfKsbAAAAAMNBg3YtKf4F258qChEW-4I2ZwUp'
    ],
    'recaptcha2' => [
        'siteKey' => '6LeA-CUbAAAAACVgBPUjUY2PfRo3HOaK3gVzVyPj',
        'secretKey' => '6LeA-CUbAAAAAErEaliKQa3oKkP7uVxJCP6x7mg2'
    ],
    'fiberPay' => [
        'apikey' => 'dNlZtEJrvaJDJ5EX',
        'secretkey' => 'TyetgwXIepglIbLqWjBk8C5McaU6MVhmsI5oPLAL3R0fHT8uj1uJ8XSVLZgkQurvx5UVfRQrkAkCiy7d5SqsxIdscAu8UQWqFTYs8lKzRLNRih8bMlei0vJ91B0QXAk7',
        'iban' =>'PL28114020040000380243908586',
        'toName' => 'Piesto',
        'description' => 'Piesto',
        'testServer' => true,
        'fiberIdApiKey' => 'RvPxZiLGfFVQ3nTx',
        'fiberIdSecret' => 'eafb0ee4ae45a56ec9fc093f4f8a63d3ccba7995557b704d7cf93b3451624d22'
    ],
    'przelewy24' => [
        'live' => false
    ]
];
