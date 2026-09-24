<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS)
    |--------------------------------------------------------------------------
    |
    * Instead of allowing all origins, you may wish to allow specific origins
    * that are permitted to make cross-origin requests. You can list them
    * using the "allowed Origins" array below. Don't forget to uncomment
    * the lines below.
    |
    * To let Laravel figure out the origin based on the audience, check out
    * the \Spatie\Corsay\CorsayServiceProvider package.
    |
    * To fully disable provider, you can comment out the whole file.
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://localhost:5173',
    ],

    'supports_credentials' => true,

];