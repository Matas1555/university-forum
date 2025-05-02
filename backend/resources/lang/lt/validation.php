<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Laukelis :attribute turi būti priimtas.',
    'active_url' => 'Laukelis :attribute nėra galiojantis URL.',
    'after' => 'Laukelis :attribute turi būti data po :date.',
    'after_or_equal' => 'Laukelis :attribute turi būti data po arba lygi :date.',
    'alpha' => 'Laukelis :attribute gali turėti tik raides.',
    'alpha_dash' => 'Laukelis :attribute gali turėti tik raides, skaičius, brūkšnius ir pabraukimus.',
    'alpha_num' => 'Laukelis :attribute gali turėti tik raides ir skaičius.',
    'array' => 'Laukelis :attribute turi būti masyvas.',
    'before' => 'Laukelis :attribute turi būti data prieš :date.',
    'before_or_equal' => 'Laukelis :attribute turi būti data prieš arba lygi :date.',
    'between' => [
        'numeric' => 'Laukelis :attribute turi būti tarp :min ir :max.',
        'file' => 'Laukelis :attribute turi būti tarp :min ir :max kilobaitų.',
        'string' => 'Laukelis :attribute turi būti tarp :min ir :max simbolių.',
        'array' => 'Laukelis :attribute turi turėti nuo :min iki :max elementų.',
    ],
    'boolean' => 'Laukelis :attribute turi būti true arba false.',
    'confirmed' => 'Laukelio :attribute patvirtinimas nesutampa.',
    'date' => 'Laukelis :attribute nėra galiojanti data.',
    'date_equals' => 'Laukelis :attribute turi būti data lygi :date.',
    'date_format' => 'Laukelis :attribute neatitinka formato :format.',
    'different' => 'Laukeliai :attribute ir :other turi skirtis.',
    'digits' => 'Laukelis :attribute turi būti :digits skaitmenų.',
    'digits_between' => 'Laukelis :attribute turi būti tarp :min ir :max skaitmenų.',
    'dimensions' => 'Laukelis :attribute turi neteisingas vaizdo dimensijas.',
    'distinct' => 'Laukelis :attribute turi pasikartojančią reikšmę.',
    'email' => 'Laukelis :attribute turi būti galiojantis el. pašto adresas.',
    'ends_with' => 'Laukelis :attribute turi baigtis vienu iš šių: :values.',
    'exists' => 'Pasirinktas :attribute yra neteisingas.',
    'file' => 'Laukelis :attribute turi būti failas.',
    'filled' => 'Laukelis :attribute turi turėti reikšmę.',
    'gt' => [
        'numeric' => 'Laukelis :attribute turi būti didesnis nei :value.',
        'file' => 'Laukelis :attribute turi būti didesnis nei :value kilobaitų.',
        'string' => 'Laukelis :attribute turi būti didesnis nei :value simbolių.',
        'array' => 'Laukelis :attribute turi turėti daugiau nei :value elementų.',
    ],
    'gte' => [
        'numeric' => 'Laukelis :attribute turi būti didesnis arba lygus :value.',
        'file' => 'Laukelis :attribute turi būti didesnis arba lygus :value kilobaitų.',
        'string' => 'Laukelis :attribute turi būti didesnis arba lygus :value simbolių.',
        'array' => 'Laukelis :attribute turi turėti :value elementų arba daugiau.',
    ],
    'image' => 'Laukelis :attribute turi būti paveikslėlis.',
    'in' => 'Pasirinktas :attribute yra neteisingas.',
    'in_array' => 'Laukelis :attribute neegzistuoja :other.',
    'integer' => 'Laukelis :attribute turi būti sveikasis skaičius.',
    'ip' => 'Laukelis :attribute turi būti galiojantis IP adresas.',
    'ipv4' => 'Laukelis :attribute turi būti galiojantis IPv4 adresas.',
    'ipv6' => 'Laukelis :attribute turi būti galiojantis IPv6 adresas.',
    'json' => 'Laukelis :attribute turi būti galiojanti JSON eilutė.',
    'lt' => [
        'numeric' => 'Laukelis :attribute turi būti mažesnis nei :value.',
        'file' => 'Laukelis :attribute turi būti mažesnis nei :value kilobaitų.',
        'string' => 'Laukelis :attribute turi būti mažesnis nei :value simbolių.',
        'array' => 'Laukelis :attribute turi turėti mažiau nei :value elementų.',
    ],
    'lte' => [
        'numeric' => 'Laukelis :attribute turi būti mažesnis arba lygus :value.',
        'file' => 'Laukelis :attribute turi būti mažesnis arba lygus :value kilobaitų.',
        'string' => 'Laukelis :attribute turi būti mažesnis arba lygus :value simbolių.',
        'array' => 'Laukelis :attribute neturi turėti daugiau nei :value elementų.',
    ],
    'max' => [
        'numeric' => 'Laukelis :attribute negali būti didesnis nei :max.',
        'file' => 'Laukelis :attribute negali būti didesnis nei :max kilobaitų.',
        'string' => 'Laukelis :attribute negali būti didesnis nei :max simbolių.',
        'array' => 'Laukelis :attribute negali turėti daugiau nei :max elementų.',
    ],
    'mimes' => 'Laukelis :attribute turi būti failas, kurio tipas: :values.',
    'mimetypes' => 'Laukelis :attribute turi būti failas, kurio tipas: :values.',
    'min' => [
        'numeric' => 'Laukelis :attribute turi būti bent :min.',
        'file' => 'Laukelis :attribute turi būti bent :min kilobaitų.',
        'string' => 'Laukelis :attribute turi būti bent :min simbolių.',
        'array' => 'Laukelis :attribute turi turėti bent :min elementus.',
    ],
    'not_in' => 'Pasirinktas :attribute yra neteisingas.',
    'not_regex' => 'Laukelio :attribute formatas yra neteisingas.',
    'numeric' => 'Laukelis :attribute turi būti skaičius.',
    'password' => 'Slaptažodis neteisingas.',
    'present' => 'Laukelis :attribute turi būti.',
    'regex' => 'Laukelio :attribute formatas yra neteisingas.',
    'required' => 'Laukelis :attribute yra privalomas.',
    'required_if' => 'Laukelis :attribute yra privalomas, kai :other yra :value.',
    'required_unless' => 'Laukelis :attribute yra privalomas, nebent :other yra :values.',
    'required_with' => 'Laukelis :attribute yra privalomas, kai yra :values.',
    'required_with_all' => 'Laukelis :attribute yra privalomas, kai yra :values.',
    'required_without' => 'Laukelis :attribute yra privalomas, kai nėra :values.',
    'required_without_all' => 'Laukelis :attribute yra privalomas, kai nėra nei vieno iš :values.',
    'same' => 'Laukeliai :attribute ir :other turi sutapti.',
    'size' => [
        'numeric' => 'Laukelis :attribute turi būti :size.',
        'file' => 'Laukelis :attribute turi būti :size kilobaitų.',
        'string' => 'Laukelis :attribute turi būti :size simbolių.',
        'array' => 'Laukelis :attribute turi turėti :size elementus.',
    ],
    'starts_with' => 'Laukelis :attribute turi prasidėti vienu iš: :values.',
    'string' => 'Laukelis :attribute turi būti eilutė.',
    'timezone' => 'Laukelis :attribute turi būti galiojanti laiko zona.',
    'unique' => 'Laukelis :attribute jau užimtas.',
    'uploaded' => 'Nepavyko įkelti :attribute.',
    'url' => 'Laukelio :attribute formatas yra neteisingas.',
    'uuid' => 'Laukelis :attribute turi būti galiojantis UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'email' => [
            'required' => 'El. pašto adresas yra privalomas.',
            'email' => 'Prašome įvesti galiojantį el. pašto adresą.',
            'exists' => 'Toks el. pašto adresas neegzistuoja.',
            'unique' => 'Šis el. pašto adresas jau užregistruotas.',
        ],
        'password' => [
            'required' => 'Slaptažodis yra privalomas.',
            'min' => 'Slaptažodis turi būti bent :min simbolių.',
            'confirmed' => 'Slaptažodžio patvirtinimas nesutampa.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'email' => 'el. pašto adresas',
        'password' => 'slaptažodis',
        'name' => 'vardas',
        'title' => 'pavadinimas',
        'content' => 'turinys',
    ],
]; 