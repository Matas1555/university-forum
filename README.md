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


### Naudotojo sąsajos projektas



### API specifikacija
##Forums

## Posts

Gauti visus forumo įrašus
<table> <tr><td width="500px">API Metodas:</td><td width="500px">GET</td></tr> <tr><td>Paskirtis:</td><td>Gauti visus nurodyto forumo pranešimus, kartu su komentarais ir kategorijomis.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/forums/{forum_id}/posts</td></tr> <tr><td>Užklausos "header" dalis:</td><td>-</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td> <td> <code> { "forum_name": "Programavimo diskusijos", "posts": [ { "id": 1, "title": "Kaip išmokti Python?", "description": "Ieškau mokymosi šaltinių pradedantiesiems.", "user": 10, "comments": [], "categories": [ { "id": 5, "name": "Programavimo pagrindai" } ] } ] } </code> </td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Pranešimai sėkmingai gauti.<br> - 404 (Nerasta): Forumų su nurodytu ID nėra. </td></tr> </table> <br>

Sukurti naują įrašą
<table> <tr><td width="500px">API Metodas:</td><td width="500px">POST</td></tr> <tr><td>Paskirtis:</td><td>Sukurti naują įrašą.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/posts</td></tr> <tr><td>Užklausos "header" dalis:</td><td>-</td></tr> <tr><td>Užklausos struktūra:</td> <td> <code> { "title": "Kaip išmokti React?", "description": "Ieškau geriausių React praktikos būdų.", "forum_id": 2, "university_id": 1 } </code> </td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 201 (Sukurta): Pranešimas sėkmingai sukurtas.<br> - 400 (Netinkama užklausa): Nepakanka ar netinkami duomenys. </td></tr> </table> <br>
Ištrinti įrašą

<table> <tr><td width="500px">API Metodas:</td><td width="500px">DELETE</td></tr> <tr><td>Paskirtis:</td><td>Ištrinti esamą įrašą pagal jo ID.</td></tr> <tr><td>Pasiekiama adresu:</td><td>/api/posts/{id}</td></tr> <tr><td>Užklausos "header" dalis:</td><td>-</td></tr> <tr><td>Užklausos struktūra:</td><td>-</td></tr> <tr><td>Atsakymo struktūra:</td><td>-</td></tr> <tr><td>Galimi atsakymo kodai:</td><td> - 200 (OK): Pranešimas sėkmingai ištrintas.<br> - 404 (Nerasta): Pranešimo su nurodytu ID nėra. </td></tr> </table> <br>
## Comments

## 


