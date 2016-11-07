# WebX-Extension

Struktura subora obsahujuceho extension
  - icon.png - Ikona chrome extensionu.
  - manifest.json - Json obsahujuci zakladne informacie o extension napr. nazov html subora, ikonu a permissions.
  - popup.html - Html extensionu a zaroven odkaz na JS subor.
  - popup.js - JS subor.

Nacitanie extensionu do Chromu
  - Do prehliadaca zadat adresu chrome://extensions/
  - Hore zaskrtnut Developer mode
  - Load unpacked extension...
  - Vybrat subor obsahujuci extension a kliknut Open
  - Extension uz bezi a ked je potrebne ho reloadnut tak v chrome://extensions/ je moznost kliknutia reload
    (Ak nastala nejaka chyba tak to pri reloade zahlasi a oznaci aj riadok oznacuje to ale tak pofiderne oznacilo mi
     zly riadok pricom chyba bola o riadok vyssie.)

Praca
  - Cize staci vytvorit v popup.html grafiku a idcka k tym veciam a potom nasledne popup.js robit logiku.
