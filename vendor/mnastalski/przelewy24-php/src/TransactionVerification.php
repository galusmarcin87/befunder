<?php

namespace Przelewy24;

use Przelewy24\Api\Request\ApiRequest;

class TransactionVerification extends ApiRequest
{
    /**
     * @var array
     */
    protected $signatureAttributes = [
        'session_id',
        'order_id',
        'amount',
        'currency',
        'crc',
    ];

    /**
     * @param array $parameters
     */
    public function __construct(array $parameters = [])
    {
        $this->parameters = array_merge([
            'currency' => 'PLN',
        ], $parameters);
    }
}
