### Universitetų forumų sistema

### Sistemos paskirtis
Sukurti universitetų forumų sistemą, kurioje naudotojai galės pasirinkti Lietuvos universitetą ir dalyvauti diskusijose apie jį. Sistema leidžia diskutuoti įvairiais universiteto aspektais, dalintis patirtimis bei įžvalgomis su kitais studentais ir padėti būsimiems studentams priimti informuotą sprendimą dėl studijų. Forumas suteikia galimybę dalyvauti teminėse diskusijose, palikti atsiliepimus apie universitetus, jų studijų programas, kursus ar dėstytojus, taip pat dalintis resursais.

### Funkciniai reikalavimai 
1. Vartotojų valdymas:
   - Sistema turi leisti naudotojams registruotis ir prisijungti naudojantis el.paštą ir slaptažodį
   - Kiekvienas naudotojas turi galimybę redaguoti savo profilio informacija, pvz. kokiam universitete studijuoja, slapyvardi, nuotrauka ir t.t.
    
2. Universitetų ir temų pasirinkimas
   - Naudotojai turi galėti pasirinkti universitetą ir su juo susijas temas
   - Sistema turi leisti filtruoti diskusijas pagal studijų programas ar dalykus
   - Naudotojai turi galėti ieškoti temų, pranešimų pagal raktažodžius, universitetą, kursą.
     
3. Diskusijų forumai
   - Kiekvienam universitetui turėtų būti skirtos atskiros diskusijų sritys, suskirstos pagal įvairias temas
   - Vartotojai turi turėti galimybę kurti naujus pranešimus ir atsakinėti į kitų pranešimus
   - Sistema turi turėti pranešimų įvertinimo (upvote/downvote) sistemą

4. Resursų dalinimasis
   - Naudotojai turi galėti įkelti ir dalintis įvairiais užrašais, failais.
  
5. Atsiliepimai ir apžvalgos
   - Sistema turi leisti vartotojams palikti atsiliepimus apie universitetus
   - Naudotojai turi galėti palikti apžvalgas apie konkrečius kursus ar dėstytojus

6. Moderavimo įrankiai
   - Administratoriai turi galėti moderuoti pranešimus, šalinti netinkamą turinį.
   - Naudotojai turi galėti pranešti apie netinkamą turinį.
  
7. Saugumas ir privatumas
   - Sistema turi užtikrinti, kad vartotojų duomenys būtų saugiai laikomi ir apsaugoti


### Sistemos architektūra
![image](https://github.com/user-attachments/assets/21f0e1bf-beea-4b90-b822-ef502b31c19e)


### Naudotojo sąsają

| ![Pagrindinis puslapis](https://github.com/user-attachments/assets/bc92c246-ea51-4a38-b258-ed070f38a74c)|
| :--------------------------------------------------------: |
|                   _Pagrindinis puslapis_                   |

<br>

| ![Registracijos puslapis](https://github.com/user-attachments/assets/904820f3-3805-4700-a97e-50def47f1b95)|
| :--------------------------------------------------------: |
|                  _Registracijos puslapis_                   |

<br>

| ![Universiteto puslapis](https://github.com/user-attachments/assets/bf8b1d1b-f49a-4e9a-b45a-3e5be5c1f9c8)|
| :--------------------------------------------------------: |
|                  _Prisijungimo modulas_                   |

<br>

| ![Įrašo puslapis](https://github.com/user-attachments/assets/98858afc-f6b5-47f6-a3ed-0188ffcca709)|
| :--------------------------------------------------------: |
|                  _Įrašo puslapis_                          |

<br>

| ![Universitetų sąrašo puslapis](https://github.com/user-attachments/assets/837c689b-990d-43c5-a518-32e53163063f)|
| :--------------------------------------------------------: |
|                  _Universitetų sąrašo puslapis_            |

<br>

| ![Universiteto puslapis](https://github.com/user-attachments/assets/c0f0bbbd-697f-4cf0-aeac-afc400eb13dd)|
| :--------------------------------------------------------: |
|                  _Universiteto puslapis_                   |

<br>

| ![Administratoriaus panele](https://github.com/user-attachments/assets/a4a58931-f6d8-45c1-ad21-afb7ea2083c2)|
| :--------------------------------------------------------: |
|                  _Administratoriaus panele_                |

<br>



### API specifikacija
## Forumų API metodai

Gauti forumų sąrašą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">GET</td></tr> <tr><td>Paskirtis:</td><td>Gauti visų forumų sąrašą.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/forums</td></tr> <tr><td>Užklausos "header" dalis:</td><td>-</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td> <td> <code> [ { "id": 1, "title": "Programavimo diskusijos", "university_id": 1 } ] </code> </td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Forumai sėkmingai gauti. </td></tr> </table> <br>

Sukurti naują forumą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">POST</td></tr> <tr><td>Paskirtis:</td><td>Sukurti naują forumą.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/forums</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td> <td> <code> { "title": "Naujo forumo pavadinimas", "university_id": 1 } </code> </td></tr> <tr><td>Atsakymo struktūra:</td> <td> <code> { "id": 10, "title": "Naujo forumo pavadinimas", "university_id": 1, "created_at": "2024-12-22T15:00:00Z", "updated_at": null } </code> </td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 201 (Sukurta): Forumas sėkmingai sukurtas.<br> - 400 (Netinkama užklausa): Nepakanka ar netinkami duomenys. </td></tr> </table> <br>

Atnaujinti forumą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">PUT</td></tr> <tr><td>Paskirtis:</td><td>Atnaujinti esamą forumą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/forums/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td> <td> <code> { "title": "Atnaujintas forumo pavadinimas", "university_id": 1 } </code> </td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Forumas sėkmingai atnaujintas.<br> - 404 (Nerasta): Forumas su nurodytu ID neegzistuoja. </td></tr> </table> <br>

Ištrinti forumą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">DELETE</td></tr> <tr><td>Paskirtis:</td><td>Ištrinti forumą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/forums/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Forumas sėkmingai ištrintas.<br> - 404 (Nerasta): Forumas su nurodytu ID neegzistuoja. </td></tr> </table> <br>

## Įrašų API metodai

Gauti visus forumo įrašus
<table> <tr><td width="500px">API Metodas:</td><td width="500px">GET</td></tr> <tr><td>Paskirtis:</td><td>Gauti visus nurodyto forumo pranešimus, kartu su komentarais ir kategorijomis.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/forums/{forum_id}/posts</td></tr> <tr><td>Užklausos "header" dalis:</td><td>-</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td> <td> <code> { "forum_name": "Programavimo diskusijos", "posts": [ { "id": 1, "title": "Kaip išmokti Python?", "description": "Ieškau mokymosi šaltinių pradedantiesiems.", "user": 10, "comments": [], "categories": [ { "id": 5, "name": "Programavimo pagrindai" } ] } ] } </code> </td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Įrašai sėkmingai gauti.<br> - 404 (Nerasta): Forumų su nurodytu ID nėra. </td></tr> </table> <br>

Gauti konkretaus įrašo informaciją
<table> <tr><td width="500px">API Metodas:</td><td width="500px">GET</td></tr> <tr><td>Paskirtis:</td><td>Gauti informaciją apie konkretų įrašą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/posts/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>-</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td> <td> <code> { "id": 1, "title": "Kaip išmokti Python?", "description": "Ieškau mokymosi šaltinių pradedantiesiems.", "forum_id": 1, "university_id": 2, "user_id": 10, "created_at": "2024-12-21T15:00:00Z", "updated_at": "2024-12-22T08:00:00Z" } </code> </td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Pranešimo informacija sėkmingai gauta.<br> - 404 (Nerasta): įrašo su nurodytu ID nėra. </td></tr> </table> <br>

Sukurti naują įrašą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">POST</td></tr> <tr><td>Paskirtis:</td><td>Sukurti naują įrašą.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/posts</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td> <td> <code> { "title": "Kaip išmokti React?", "description": "Ieškau geriausių React praktikos būdų.", "forum_id": 2, "university_id": 1 } </code> </td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 201 (Sukurta): Įrašas sėkmingai sukurtas.<br> - 400 (Netinkama užklausa): Nepakanka ar netinkami duomenys. </td></tr> </table> <br>

Ištrinti įrašą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">DELETE</td></tr> <tr><td>Paskirtis:</td><td>Ištrinti esamą įrašą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/posts/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Įrašas sėkmingai ištrintas.<br> - 404 (Nerasta): Įrašo su nurodytu ID nėra. </td></tr> </table> <br>

Atnaujinti įrašą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">PUT</td></tr> <tr><td>Paskirtis:</td><td>Atnaujinti esamą pranešimą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/posts/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td> <td> <code> { "title": "Atnaujintas pranešimo pavadinimas", "description": "Atnaujintas aprašymas." } </code> </td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Įrašas sėkmingai atnaujintas.<br> - 404 (Nerasta): Įrašas su nurodytu ID neegzistuoja. </td></tr> </table> <br>

## Komentarų API metodai

Gauti komentarų sąrašą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">GET</td></tr> <tr><td>Paskirtis:</td><td>Gauti visų komentarų sąrašą.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/comments</td></tr> <tr><td>Užklausos "header" dalis:</td><td>-</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td> <td> <code> [ { "id": 1, "text": "Puikus postas!", "post_id": 5, "user_id": 3, "created_at": "2024-12-20T10:00:00Z", "updated_at": "2024-12-21T12:00:00Z" } ] </code> </td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Komentarai sėkmingai gauti. </td></tr> </table> <br>

Sukurti naują komentarą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">POST</td></tr> <tr><td>Paskirtis:</td><td>Sukurti naują komentarą.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/comments</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td> <td> <code> { "text": "Labai naudinga informacija!", "post_id": 10 } </code> </td></tr> <tr><td>Atsakymo struktūra:</td> <td> <code> { "id": 15, "text": "Labai naudinga informacija!", "post_id": 10, "user_id": 3, "created_at": "2024-12-22T12:00:00Z", "updated_at": null } </code> </td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 201 (Sukurta): Komentaras sėkmingai sukurtas.<br> - 400 (Netinkama užklausa): Nepakanka ar netinkami duomenys. </td></tr> </table> <br>

Atnaujinti komentarą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">PUT</td></tr> <tr><td>Paskirtis:</td><td>Atnaujinti esamą komentarą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/comments/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td> <td> <code> { "text": "Atnaujintas komentaras" } </code> </td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Komentaras sėkmingai atnaujintas.<br> - 404 (Nerasta): Komentaras su nurodytu ID neegzistuoja. </td></tr> </table> <br>

Ištrinti komentarą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">DELETE</td></tr> <tr><td>Paskirtis:</td><td>Ištrinti komentarą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/comments/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>Authorization: Bearer {token}</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Komentaras sėkmingai ištrintas.<br> - 404 (Nerasta): Komentaras su nurodytu ID neegzistuoja. </td></tr> </table> <br>


### Išvados
Šis projektas, sukurtas naudojant ReactJS ir Laravel, yra gera pradžia, nors dar ir nebaigtas. Dabartinėje versijoje pavyko sukurti pagrindines funkcijas – vartotojų autentifikaciją ir duomenų skaitymą, o administratoriaus panelėje galima atlikti CRUD operacijas. Tai jau suteikia tam tikrą funkcionalumą ir padėjo suprasti, kaip šios technologijos dera tarpusavyje.
