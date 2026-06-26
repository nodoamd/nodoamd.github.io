/** Ruta de aprendizaje: Historia de España — completa */
const RUTA_HISTORIA_ESPANA = {
  id: 'historia-espana',
  title: 'Historia de España',
  flag: '🇪🇸',
  description: 'Un recorrido completo desde los primeros homínidos en la Península Ibérica hasta la España democrática de hoy.',
  topics: [

    // ─────────────────────────────────────────────
    // BLOQUE 1 — Primeros habitantes y Prehistoria
    // ─────────────────────────────────────────────
    {
      id: 'prehistoria',
      num: 1,
      title: 'Primeros habitantes y Prehistoria',
      icon: 'bone',
      description: 'Desde los primeros homínidos en Atapuerca hasta la Edad del Bronce.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Primeros habitantes y Prehistoria',
        intro: 'Repasa los tres periodos fundamentales de la Prehistoria en la Península Ibérica. Necesitas acertar todas las preguntas para certificar el bloque.',
        questions: [
          { question: '¿En qué yacimiento español se hallaron los restos humanos más antiguos de Europa occidental?', options: ['Altamira', 'Atapuerca', 'El Tossal de la Roca'], correct: 1 },
          { question: '¿Qué especie homínida se encontró en la Sima de los Huesos de Atapuerca?', options: ['Homo sapiens', 'Homo heidelbergensis', 'Homo erectus'], correct: 1 },
          { question: '¿Qué técnica caracteriza el paso del Paleolítico al Neolítico?', options: ['La navegación', 'La agricultura y la ganadería', 'La escritura cuneiforme'], correct: 1 },
          { question: '¿Cómo se llama la cultura de los grandes monumentos de piedra presentes en España?', options: ['Cultura megalítica', 'Cultura campaniforme', 'Cultura argárica'], correct: 0 },
          { question: '¿En qué cueva del norte de España se pintaron bisontes y ciervos hace unos 14.000 años?', options: ['Cueva de Nerja', 'Cueva de Altamira', 'Cueva de La Pileta'], correct: 1 },
          { question: '¿Qué metal define la última etapa de la Prehistoria antes de los pueblos históricos?', options: ['Hierro', 'Bronce', 'Cobre'], correct: 1 },
          { question: '¿Dónde se han encontrado los dólmenes de Antequera, monumentos megalíticos clave de la Prehistoria española?', options: ['Galicia', 'Andalucía', 'Cataluña'], correct: 1 },
          { question: '¿Qué periodo prehistórico se caracteriza por la fabricación de útiles de piedra tallada?', options: ['Neolítico', 'Paleolítico', 'Calcolítico'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'prehistoria-1',
          title: 'Atapuerca: la cuna de Europa',
          icon: 'skull',
          blocks: [
            { type: 'p', text: 'La Sierra de Atapuerca, en Burgos, es el yacimiento prehistórico más importante de Europa. Allí se hallaron restos de Homo antecessor con más de 900.000 años de antigüedad, y de Homo heidelbergensis en la llamada Sima de los Huesos, datados en unos 430.000 años.' },
            { type: 'p', text: 'Estos hallazgos demuestran que la Península Ibérica fue uno de los primeros territorios de Europa occidental habitados por homínidos. Mucho antes de que existiera ningún pueblo, ningún reino, ninguna lengua, ya había humanos contemplando estas tierras.' },
            { type: 'tip', text: '💡 La Sima de los Huesos es única en el mundo: contiene los restos de al menos 28 individuos, probablemente depositados allí de forma intencionada, lo que sugiere uno de los primeros rituales funerarios conocidos de la humanidad.' }
          ],
          questions: [
            { question: '¿En qué provincia española se encuentra el yacimiento de Atapuerca?', options: ['Burgos', 'Salamanca', 'León'], correct: 0 },
            { question: '¿Qué especie homínida se encontró en Atapuerca con más de 900.000 años?', options: ['Homo sapiens', 'Homo antecessor', 'Homo neanderthalensis'], correct: 1 },
            { question: '¿Qué hace especialmente relevante a la Sima de los Huesos?', options: ['Es la cueva pintada más antigua', 'Contiene restos de ~28 individuos posiblemente depositados intencionalmente', 'Allí se hallaron las primeras herramientas de bronce'], correct: 1 },
            { question: '¿Qué especie se asocia a los restos de la Sima de los Huesos?', options: ['Homo habilis', 'Homo heidelbergensis', 'Homo erectus'], correct: 1 },
            { question: '¿Por qué es importante Atapuerca para la historia de Europa?', options: ['Porque allí nació la escritura europea', 'Porque contiene los restos humanos más antiguos de Europa occidental', 'Porque fue el primer asentamiento agrícola del continente'], correct: 1 }
          ],
          sources: [
            { title: 'Fundación Atapuerca', url: 'https://www.fundacionatapuerca.es' },
            { title: 'Museo de la Evolución Humana — Burgos', url: 'https://www.museoevolucionhumana.com' }
          ]
        },
        {
          id: 'prehistoria-2',
          title: 'Arte rupestre y el Paleolítico',
          icon: 'image',
          blocks: [
            { type: 'p', text: 'Hace unos 14.000 años, en la cueva de Altamira (Cantabria), el Homo sapiens pintó bisontes, ciervos y caballos con un realismo asombroso. Usaban ocre, carbón y grasa animal, y aprovechaban los relieves naturales de la roca para dar volumen a las figuras.' },
            { type: 'p', text: 'España y Francia concentran la mayor colección de arte rupestre paleolítico del mundo. Además de Altamira, en España destacan la Cueva de Nerja (Málaga) y la Cueva de La Pileta (Ronda). En 2008, la UNESCO amplió la declaración de Patrimonio Mundial para incluir diecisiete cuevas del norte de España.' },
            { type: 'tip', text: '💡 Cuando se descubrió Altamira en 1879, los prehistoriadores no creyeron que fueran auténticas: les parecía imposible que un ser "primitivo" pudiera crear algo tan bello. Tardaron décadas en aceptar su autenticidad.' }
          ],
          questions: [
            { question: '¿En qué comunidad autónoma se encuentra la cueva de Altamira?', options: ['Asturias', 'Cantabria', 'País Vasco'], correct: 1 },
            { question: '¿Qué animales predominan en las pinturas de Altamira?', options: ['Mamuts y rinocerontes', 'Bisontes, ciervos y caballos', 'Lobos y osos'], correct: 1 },
            { question: '¿Qué materiales usaban los artistas del Paleolítico para pintar?', options: ['Arcilla y agua', 'Ocre, carbón y grasa animal', 'Tiza y barro'], correct: 1 },
            { question: '¿En qué año la UNESCO amplió el reconocimiento de las cuevas del norte de España?', options: ['1979', '2008', '1995'], correct: 1 },
            { question: '¿Por qué tardaron en aceptarse las pinturas de Altamira como auténticas?', options: ['Porque estaban muy deterioradas', 'Porque se creía imposible esa habilidad artística en el Paleolítico', 'Porque no había ningún hueso humano cerca'], correct: 1 }
          ],
          sources: [
            { title: 'Museo de Altamira — Ministerio de Cultura', url: 'https://museodealtamira.mcu.es' },
            { title: 'UNESCO — Cueva de Altamira', url: 'https://whc.unesco.org/en/list/310' }
          ]
        },
        {
          id: 'prehistoria-3',
          title: 'Neolítico, megalitos y Edad del Bronce',
          icon: 'monument',
          blocks: [
            { type: 'p', text: 'Hacia el 6000 a.C. llegó a la Península el Neolítico: la agricultura, la ganadería y los primeros poblados estables. Los seres humanos dejaron de ser nómadas y comenzaron a modificar el paisaje de forma permanente.' },
            { type: 'p', text: 'Durante el Calcolítico (Edad del Cobre, ~3000-2000 a.C.) aparecieron los grandes monumentos megalíticos: dólmenes, menhires y cromlechs. Los dólmenes de Antequera (Menga, Viera, El Romeral) son los más impresionantes de la Península. Hacia el 2000 a.C. comenzó la Edad del Bronce, con culturas como la Argárica en el sureste, que ya fabricaban armas y joyas metálicas.' },
            { type: 'tip', text: '💡 El dolmen de Menga, en Antequera, pesa más de 1.000 toneladas y fue construido sin maquinaria. Su orientación exacta apunta a la salida del sol en el solsticio de verano.' }
          ],
          questions: [
            { question: '¿Qué cambio fundamental trajo el Neolítico a la Península Ibérica?', options: ['La escritura y el comercio marítimo', 'La agricultura, la ganadería y los poblados estables', 'El uso del hierro y las primeras ciudades'], correct: 1 },
            { question: '¿Cómo se llaman los grandes monumentos de piedra del Calcolítico?', options: ['Castros', 'Megalitos', 'Oppida'], correct: 1 },
            { question: '¿Dónde se encuentran los dólmenes de Menga, Viera y El Romeral?', options: ['Antequera (Málaga)', 'Carmona (Sevilla)', 'Mérida (Extremadura)'], correct: 0 },
            { question: '¿Qué cultura de la Edad del Bronce destacó en el sureste peninsular?', options: ['Cultura de los campos de urnas', 'Cultura argárica', 'Cultura campaniforme'], correct: 1 },
            { question: '¿Hacia qué fecha aproximada comenzó el Neolítico en la Península Ibérica?', options: ['15000 a.C.', '6000 a.C.', '1000 a.C.'], correct: 1 }
          ],
          sources: [
            { title: 'Conjunto Arqueológico Dólmenes de Antequera', url: 'https://www.dólmenesdantequera.es' },
            { title: 'Museo Arqueológico Nacional — Prehistoria', url: 'https://www.man.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 2 — Pueblos Prerromanos
    // ─────────────────────────────────────────────
    {
      id: 'prerromanos',
      num: 2,
      title: 'Pueblos Prerromanos',
      icon: 'shield',
      description: 'Íberos, celtas, tartessos y los colonizadores mediterráneos antes de Roma.',
      image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Pueblos Prerromanos',
        intro: 'Pon a prueba tus conocimientos sobre los pueblos que habitaron la Península antes de Roma.',
        questions: [
          { question: '¿Qué pueblo prerromano habitaba principalmente el levante y sureste peninsular?', options: ['Celtas', 'Íberos', 'Cántabros'], correct: 1 },
          { question: '¿Dónde se asentaron principalmente los celtas en la Península?', options: ['En el Mediterráneo oriental', 'En la meseta norte y noroeste', 'En el valle del Guadalquivir'], correct: 1 },
          { question: '¿Qué pueblo misterioso y rico floreció en el suroeste peninsular antes del 500 a.C.?', options: ['Los íberos del norte', 'Los tartessos', 'Los celtíberos de Numancia'], correct: 1 },
          { question: '¿Qué pueblo del Mediterráneo oriental fundó la ciudad de Gadir (actual Cádiz)?', options: ['Griegos', 'Fenicios', 'Cartagineses'], correct: 1 },
          { question: '¿Qué famoso yacimiento escultórico ibérico representa a una dama ricamente adornada?', options: ['La Dama de Elche', 'La Venus de Willendorf', 'El Guerrero de Mogente'], correct: 0 },
          { question: '¿En qué año desembarcaron los romanos en Ampurias, poniendo fin a la era prerromana?', options: ['509 a.C.', '218 a.C.', '146 a.C.'], correct: 1 },
          { question: '¿Qué eran los "castros", típicos de la cultura castreña del noroeste?', options: ['Templos íberos en piedra', 'Poblados amurallados en alto', 'Mercados fenicios costeros'], correct: 1 },
          { question: '¿Qué pueblo semita del norte de África llegó a dominar Cartago Nova (hoy Cartagena) antes de los romanos?', options: ['Los fenicios', 'Los cartagineses', 'Los griegos'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'prerromanos-1',
          title: 'Íberos y celtas: dos mundos en la Península',
          icon: 'swords',
          blocks: [
            { type: 'p', text: 'Hacia el año 1000 a.C. la Península albergaba dos grandes grupos culturales: los íberos en el este y sur (levante mediterráneo, Andalucía) y los celtas en el norte, meseta y noroeste. No eran naciones unificadas, sino conjuntos de tribus con lenguas y costumbres distintas.' },
            { type: 'p', text: 'Los íberos vivían en oppida (ciudades elevadas amuralladas), cultivaban la tierra, comerciaban con fenicios y griegos, y desarrollaron su propia escritura —aún no descifrada del todo—. Los celtas, por su parte, construyeron castros (aldeas circulares en alto) y se destacaron como guerreros. La cultura castreña del noroeste dejó monumentos que aún se visitan en Galicia y Portugal.' },
            { type: 'tip', text: '💡 En la zona interior donde íberos y celtas se mezclaron surgieron los celtíberos — guerreros que resistieron ferozmente a Roma. Numancia (Soria) fue su símbolo más heroico.' }
          ],
          questions: [
            { question: '¿En qué zonas de la Península se asentaron principalmente los íberos?', options: ['Norte y noroeste', 'Levante y sur mediterráneo', 'Interior de la meseta'], correct: 1 },
            { question: '¿Cómo se llamaban las ciudades amuralladas y elevadas de los íberos?', options: ['Castros', 'Oppida', 'Vici'], correct: 1 },
            { question: '¿Qué caracteriza la escritura ibérica?', options: ['Está completamente descifrada', 'Aún no se comprende del todo', 'Es idéntica al latín'], correct: 1 },
            { question: '¿Qué pueblo resultó de la mezcla de íberos y celtas en el interior peninsular?', options: ['Vascones', 'Celtíberos', 'Turdetanos'], correct: 1 },
            { question: '¿Qué ciudad celtíbera se hizo famosa por su resistencia a Roma?', options: ['Sagunto', 'Numancia', 'Ilerda'], correct: 1 }
          ],
          sources: [
            { title: 'Museo Arqueológico Nacional — Íberos', url: 'https://www.man.es' },
            { title: 'Museo del Castro de Santa Tegra', url: 'https://www.museocastrodesantatecla.com' }
          ]
        },
        {
          id: 'prerromanos-2',
          title: 'Tartessos: el misterio del suroeste',
          icon: 'gem',
          blocks: [
            { type: 'p', text: 'Tartessos fue una civilización o reino del suroeste peninsular (actual Andalucía occidental y Extremadura) que floreció entre el 900 y el 500 a.C. aproximadamente. Era rico en metales —plata, cobre, estaño— y comerciaba con todo el Mediterráneo.' },
            { type: 'p', text: 'Los griegos lo mencionaban como un lugar fabuloso más allá de las columnas de Hércules (Gibraltar). Algunos lo identifican con la mítica Atlántida. Desapareció sin dejar una capital identificada con certeza, lo que lo convierte en uno de los grandes misterios de la arqueología peninsular.' },
            { type: 'tip', text: '💡 El Tesoro del Carambolo, hallado en Sevilla en 1958, es una de las joyas de oro más espectaculares de la Antigüedad y se asocia a la cultura tartésica: 21 piezas de oro puro con decoración geométrica.' }
          ],
          questions: [
            { question: '¿En qué zona de la Península se situaba Tartessos?', options: ['Noroeste (Galicia y Portugal)', 'Suroeste (Andalucía occidental y Extremadura)', 'Levante (Valencia y Murcia)'], correct: 1 },
            { question: '¿Con qué mito griego se relaciona a veces Tartessos?', options: ['La Odisea', 'La Atlántida', 'El Minotauro'], correct: 1 },
            { question: '¿Qué tesoro de oro se asocia a la cultura tartésica?', options: ['El Tesoro de Villena', 'El Tesoro del Carambolo', 'El Tesoro de Guarrazar'], correct: 1 },
            { question: '¿Por qué Tartessos sigue siendo un misterio arqueológico?', options: ['Porque no dejó ningún objeto', 'Porque no se ha identificado su capital con certeza', 'Porque fue destruida por los romanos sin dejar rastro'], correct: 1 },
            { question: '¿Qué riqueza principal hizo famosos a los tartessos en el Mediterráneo?', options: ['Especias y seda', 'Metales como plata, cobre y estaño', 'Caballos y trigo'], correct: 1 }
          ],
          sources: [
            { title: 'Museo Arqueológico de Sevilla — Tesoro del Carambolo', url: 'https://www.museosdeandalucia.es/web/museoarqueologicodesevilla' },
            { title: 'Real Academia de la Historia — Tartessos', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'prerromanos-3',
          title: 'Fenicios, griegos y cartagineses',
          icon: 'anchor',
          blocks: [
            { type: 'p', text: 'A partir del siglo IX a.C. llegaron a las costas peninsulares los primeros colonizadores del Mediterráneo oriental. Los fenicios fundaron Gadir (hoy Cádiz, una de las ciudades más antiguas de Occidente), Malaka (Málaga) y Sexi (Almuñécar). Traían aceite, vino, cerámica y tejidos a cambio de metales.' },
            { type: 'p', text: 'Los griegos establecieron colonias en el noreste: Emporion (Ampurias, en Gerona) y Rhode (Rosas). Más tarde, los cartagineses —herederos del poder fenicio desde el norte de África— conquistaron gran parte del sur y el este. Aníbal Barca partió de Cartago Nova (Cartagena) para cruzar los Alpes y atacar Roma, desencadenando la Segunda Guerra Púnica.' },
            { type: 'tip', text: '💡 Cádiz (Gadir) fue fundada por los fenicios hacia el 1100 a.C., lo que la convierte en la ciudad habitada de forma continua más antigua de la Península Ibérica y una de las más antiguas de Europa occidental.' }
          ],
          questions: [
            { question: '¿Qué ciudad peninsular fundaron los fenicios y es una de las más antiguas de Occidente?', options: ['Málaga', 'Cádiz (Gadir)', 'Cartagena'], correct: 1 },
            { question: '¿Qué colonia griega se estableció en Ampurias (Gerona)?', options: ['Rhode', 'Emporion', 'Massalia'], correct: 1 },
            { question: '¿Qué general cartaginés partió de la Península para atacar Roma cruzando los Alpes?', options: ['Amílcar Barca', 'Aníbal Barca', 'Asdrúbal'], correct: 1 },
            { question: '¿Cómo se llamaba la gran base cartaginesa en el sureste peninsular?', options: ['Gadir', 'Cartago Nova', 'Qart Hadasht del norte'], correct: 1 },
            { question: '¿Qué guerra enfrentó a Roma con Cartago por el control de Hispania?', options: ['La Guerra de Yugurta', 'La Segunda Guerra Púnica', 'La Guerra de los Aliados'], correct: 1 }
          ],
          sources: [
            { title: 'Museo de Historia de Cádiz', url: 'https://www.museosdeandalucia.es/web/museohistoricodecadiz' },
            { title: 'Museo de Arqueología de Cataluña — Ampurias', url: 'https://www.mac.cat/Seus/Empuries' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 3 — Hispania Romana
    // ─────────────────────────────────────────────
    {
      id: 'hispania-romana',
      num: 3,
      title: 'Hispania Romana',
      icon: 'columns',
      description: 'Seis siglos de romanización que cimentaron la lengua, el derecho y la cultura española.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Hispania Romana',
        intro: 'Demuestra que conoces la huella que Roma dejó en la Península Ibérica.',
        questions: [
          { question: '¿En qué año desembarcaron los romanos en Ampurias, iniciando la conquista de Hispania?', options: ['264 a.C.', '218 a.C.', '133 a.C.'], correct: 1 },
          { question: '¿Qué ciudad hispanorromana fue capital de la Hispania Ulterior y luego Baetica?', options: ['Hispalis (Sevilla)', 'Emerita Augusta (Mérida)', 'Corduba (Córdoba)'], correct: 2 },
          { question: '¿Qué emperadores romanos nacieron en Hispania?', options: ['Julio César y Augusto', 'Trajano y Adriano', 'Nerón y Calígula'], correct: 1 },
          { question: '¿Qué lengua se impuso en la Península gracias a Roma?', options: ['El griego koiné', 'El latín vulgar', 'El arameo'], correct: 1 },
          { question: '¿Qué acueducto romano sigue en pie en Segovia?', options: ['El acueducto de Pont du Gard', 'El acueducto de Segovia', 'El acueducto de Mérida'], correct: 1 },
          { question: '¿Qué escritor romano nacido en Hispania es famoso por sus "Cartas" y su estoicismo?', options: ['Lucano', 'Séneca', 'Quintiliano'], correct: 1 },
          { question: '¿En qué año cayó el Imperio Romano de Occidente, marcando el fin de la Hispania romana?', options: ['410 d.C.', '455 d.C.', '476 d.C.'], correct: 2 },
          { question: '¿Cómo se llama el proceso por el que los pueblos peninsulares adoptaron la lengua y cultura romanas?', options: ['Helenización', 'Romanización', 'Latinización'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'hispania-romana-1',
          title: 'La conquista romana (218–19 a.C.)',
          icon: 'sword',
          blocks: [
            { type: 'p', text: 'En el 218 a.C., durante la Segunda Guerra Púnica, los hermanos Escipión desembarcaron en Ampurias para cortar el suministro a Aníbal. Así comenzó la conquista romana de Hispania, que no terminaría hasta el 19 a.C. con las Guerras Cántabras bajo Augusto —casi doscientos años de resistencia de los pueblos del norte.' },
            { type: 'p', text: 'La resistencia más célebre fue la de Numancia (133 a.C.): los celtíberos prefirieron quemar su ciudad y morir antes que rendirse a Escipión Emiliano. Ese episodio se convirtió en símbolo de valor y dignidad en la cultura española hasta hoy.' },
            { type: 'tip', text: '💡 Las Guerras Cántabras (29-19 a.C.) fueron tan duras que Augusto tuvo que intervenir personalmente. Los cántabros y astures del norte de la Península fueron los últimos en ser sometidos por Roma en todo el Imperio occidental.' }
          ],
          questions: [
            { question: '¿Por qué desembarcaron los romanos en Ampurias en el 218 a.C.?', options: ['Para fundar una colonia comercial', 'Para cortar el suministro a Aníbal durante la Segunda Guerra Púnica', 'Para explorar las costas del Mediterráneo'], correct: 1 },
            { question: '¿Cuándo finalizó definitivamente la conquista romana de Hispania?', options: ['133 a.C.', '19 a.C.', '27 a.C.'], correct: 1 },
            { question: '¿Qué hicieron los numantinos en el 133 a.C. antes de rendirse a Roma?', options: ['Negociaron un tratado de paz', 'Quemaron su ciudad y murieron antes que rendirse', 'Huyeron a las montañas'], correct: 1 },
            { question: '¿Qué pueblos del norte fueron los últimos en ser conquistados por Roma?', options: ['Íberos y tartessos', 'Cántabros y astures', 'Vascones y turdetanos'], correct: 1 },
            { question: '¿Qué general romano sometió Numancia en el 133 a.C.?', options: ['Julio César', 'Escipión Emiliano', 'Pompeyo'], correct: 1 }
          ],
          sources: [
            { title: 'Yacimiento de Numancia — Soria', url: 'https://www.castillayleon.es/turismo/es/monumentos/yacimiento-arqueologico-numancia.html' },
            { title: 'Museo Arqueológico de Cataluña — Ampurias', url: 'https://www.mac.cat/Seus/Empuries' }
          ]
        },
        {
          id: 'hispania-romana-2',
          title: 'La romanización: lengua, leyes y ciudades',
          icon: 'building',
          blocks: [
            { type: 'p', text: 'Roma no solo conquistó militarmente: romanizó. Impuso el latín (del que nacerán el castellano, el catalán, el gallego y el portugués), el derecho romano, la moneda, las calzadas y el modelo de ciudad. Ciudades como Emerita Augusta (Mérida), Caesaraugusta (Zaragoza), Hispalis (Sevilla) o Corduba (Córdoba) siguen habitadas y guardan restos romanos impresionantes.' },
            { type: 'p', text: 'El acueducto de Segovia, el teatro de Mérida, el puente de Alcántara o las murallas de Lugo (declaradas Patrimonio de la Humanidad) son testimonio del nivel de ingeniería que Roma trasladó a la Península. La romanización fue tan profunda que Hispania se convirtió en una de las provincias más ricas e integradas del Imperio.' },
            { type: 'tip', text: '💡 El acueducto de Segovia tiene 166 arcos y más de 15 metros de altura en su punto más alto. Fue construido sin argamasa, solo con la precisión del encaje entre las piedras de granito. Siguió funcionando hasta el siglo XIX.' }
          ],
          questions: [
            { question: '¿De qué lengua romana derivan el castellano, el catalán y el gallego?', options: ['Del latín clásico', 'Del latín vulgar', 'Del griego koiné'], correct: 1 },
            { question: '¿Qué ciudad romana sigue siendo conocida hoy como Mérida?', options: ['Caesaraugusta', 'Emerita Augusta', 'Hispalis'], correct: 1 },
            { question: '¿Qué monumento romano de Segovia sigue siendo símbolo de la ingeniería antigua?', options: ['El teatro romano', 'El acueducto', 'El anfiteatro'], correct: 1 },
            { question: '¿Qué muralla romana española es Patrimonio de la Humanidad?', options: ['Las murallas de Ávila', 'Las murallas de Lugo', 'Las murallas de Cáceres'], correct: 1 },
            { question: '¿Cuál de estas afirmaciones describe mejor la romanización?', options: ['Solo fue una ocupación militar sin cambios culturales', 'Impuso lengua, leyes, ciudades y costumbres que transformaron la Península', 'Fue rechazada por toda la población peninsular'], correct: 1 }
          ],
          sources: [
            { title: 'Conjunto arqueológico de Mérida — UNESCO', url: 'https://whc.unesco.org/en/list/664' },
            { title: 'Acueducto de Segovia — Patrimonio Nacional', url: 'https://www.turismodesegovia.com' }
          ]
        },
        {
          id: 'hispania-romana-3',
          title: 'Emperadores y escritores hispanos',
          icon: 'crown',
          blocks: [
            { type: 'p', text: 'Hispania no solo fue una provincia: fue también cuna de emperadores y pensadores que marcaron la historia de Roma. Trajano (53-117 d.C.), nacido en Itálica (Sevilla), fue el primero en expandir el Imperio más allá del Danubio. Su sucesor Adriano, también de Itálica, es conocido por la construcción del Panteón de Roma y la muralla que lleva su nombre en Britania.' },
            { type: 'p', text: 'En las letras, Séneca (4 a.C.-65 d.C.), filósofo estoico de Córdoba, fue tutor de Nerón y uno de los escritores en latín más influyentes de la Antigüedad. El poeta épico Lucano (también cordobés) escribió la Farsalia, y Quintiliano (de Calahorra) es el padre de la retórica y la pedagogía occidentales.' },
            { type: 'tip', text: '💡 Itálica, a las afueras de Sevilla, fue la primera ciudad romana fundada fuera de Italia (206 a.C.) y el lugar de nacimiento de dos emperadores: Trajano y Adriano. Hoy sus ruinas son visitables.' }
          ],
          questions: [
            { question: '¿En qué ciudad hispanorromana nacieron los emperadores Trajano y Adriano?', options: ['Corduba', 'Itálica', 'Hispalis'], correct: 1 },
            { question: '¿Qué aportación cultural es más conocida de Adriano?', options: ['Conquistó Mesopotamia', 'Construyó el Panteón y la muralla en Britania', 'Abolió la esclavitud en Roma'], correct: 1 },
            { question: '¿De qué ciudad hispanorromana era originario el filósofo Séneca?', options: ['Hispalis (Sevilla)', 'Corduba (Córdoba)', 'Caesaraugusta (Zaragoza)'], correct: 1 },
            { question: '¿Qué corriente filosófica representaba Séneca?', options: ['El epicureísmo', 'El estoicismo', 'El platonismo'], correct: 1 },
            { question: '¿Qué distinción histórica tiene Itálica respecto a las ciudades romanas?', options: ['Fue la capital de Hispania', 'Fue la primera ciudad romana fundada fuera de Italia', 'Fue la última ciudad en rendirse a los visigodos'], correct: 1 }
          ],
          sources: [
            { title: 'Conjunto Arqueológico de Itálica', url: 'https://www.museosdeandalucia.es/web/conjuntoarqueologicodeitálica' },
            { title: 'Real Academia de la Historia — Trajano', url: 'https://dbe.rah.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 4 — El Reino Visigodo
    // ─────────────────────────────────────────────
    {
      id: 'visigodos',
      num: 4,
      title: 'El Reino Visigodo',
      icon: 'castle',
      description: 'De aliados de Roma a reyes de Hispania: tres siglos de reino germánico cristiano.',
      image: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: El Reino Visigodo',
        intro: 'Comprueba cuánto sabes sobre los visigodos y su legado en la Península.',
        questions: [
          { question: '¿Qué batalla en el 711 marcó el fin del reino visigodo?', options: ['Batalla de Covadonga', 'Batalla de Guadalete', 'Batalla de las Navas de Tolosa'], correct: 1 },
          { question: '¿Cuál fue la capital del reino visigodo en Hispania?', options: ['Mérida', 'Toledo', 'Zaragoza'], correct: 1 },
          { question: '¿Qué rey visigodo se convirtió al catolicismo en el 589, unificando religiosamente el reino?', options: ['Leovigildo', 'Recaredo', 'Recesvinto'], correct: 1 },
          { question: '¿Qué código legal visigodo unificó las leyes para hispanorromanos y visigodos?', options: ['El Código de Justiniano', 'El Liber Iudiciorum', 'Las Doce Tablas'], correct: 1 },
          { question: '¿Qué general árabe cruzó el Estrecho de Gibraltar en el 711?', options: ['Muza ibn Nusayr', 'Tariq ibn Ziyad', 'Abderramán I'], correct: 1 },
          { question: '¿Qué tesoro de orfebrería visigoda se conserva en Madrid y Toledo?', options: ['El Tesoro del Carambolo', 'El Tesoro de Guarrazar', 'El Tesoro de Villena'], correct: 1 },
          { question: '¿Cómo entraron los visigodos inicialmente en la Península Ibérica?', options: ['Como conquistadores independientes', 'Como foederati (aliados federados) de Roma', 'Como refugiados de guerras en Asia'], correct: 1 },
          { question: '¿Quién era el rey visigodo derrotado en Guadalete?', options: ['Ataúlfo', 'Rodrigo (Don Rodrigo)', 'Witiza'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'visigodos-1',
          title: 'De foederati a reyes de Hispania',
          icon: 'shield-half',
          blocks: [
            { type: 'p', text: 'Los visigodos eran un pueblo germánico que a finales del siglo IV entró en el Imperio Romano como foederati: tropas aliadas que Roma utilizaba para defender sus fronteras. Tras el saco de Roma (410) y décadas de moverse por el Imperio, se establecieron en el sur de la Galia y luego, tras su derrota ante los francos en Vouillé (507), se replegaron hacia Hispania.' },
            { type: 'p', text: 'Su capital fue Toledo, ciudad que dominó la política peninsular durante casi dos siglos. A diferencia de otros pueblos germánicos, los visigodos no destruyeron la estructura romana: mantuvieron la administración, el latín como lengua culta y la Iglesia como institución clave del poder.' },
            { type: 'tip', text: '💡 Ataúlfo, primer rey visigodo en Hispania, llegó a casarse con Gala Placidia, hija del emperador Teodosio. Los visigodos no veían a Roma como enemiga, sino como un modelo al que querían pertenecer.' }
          ],
          questions: [
            { question: '¿Cómo se llamaban los pueblos germánicos que servían como aliados militares de Roma?', options: ['Mercenarios', 'Foederati', 'Legionarios auxiliares'], correct: 1 },
            { question: '¿Qué batalla en el 507 empujó a los visigodos hacia Hispania?', options: ['Batalla de Adrianópolis', 'Batalla de Vouillé', 'Batalla del Marne'], correct: 1 },
            { question: '¿Cuál fue la capital del reino visigodo en Hispania?', options: ['Mérida', 'Toledo', 'Córdoba'], correct: 1 },
            { question: '¿Qué mantuvieron los visigodos de la herencia romana?', options: ['El idioma griego y los templos paganos', 'La administración, el latín y la Iglesia como institución de poder', 'El ejército de legiones y la moneda de plata'], correct: 1 },
            { question: '¿Con quién se casó Ataúlfo, mostrando la aspiración visigoda de integrarse en Roma?', options: ['Una princesa franca', 'Gala Placidia, hija del emperador Teodosio', 'Una noble hispanorromana de Mérida'], correct: 1 }
          ],
          sources: [
            { title: 'Museo Visigodo de Toledo', url: 'https://www.toledo.es/servicios-municipales/cultura/museos/' },
            { title: 'Real Academia de la Historia — Visigodos', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'visigodos-2',
          title: 'Recaredo y la unidad religiosa',
          icon: 'cross',
          blocks: [
            { type: 'p', text: 'El mayor problema del reino visigodo era la división religiosa: los visigodos eran arrianos (una variante del cristianismo condenada como herejía) mientras que la población hispanorromana era católica. Esto creaba tensión social y política constante.' },
            { type: 'p', text: 'En el año 589, el rey Recaredo se convirtió al catolicismo en el III Concilio de Toledo. Fue un acto político tanto como religioso: unificó espiritualmente el reino y ganó el apoyo de la Iglesia y la población romana. A partir de entonces, los concilios de Toledo se convirtieron en asambleas donde clérigos y nobles decidían juntos los asuntos del reino.' },
            { type: 'tip', text: '💡 El Liber Iudiciorum (654), promulgado por el rey Recesvinto, fue uno de los primeros códigos legales que aplicaba las mismas leyes a hispanorromanos y visigodos, eliminando la distinción jurídica entre pueblos. Es un antecedente remoto del Estado de derecho.' }
          ],
          questions: [
            { question: '¿Qué problema religioso dividía el reino visigodo?', options: ['Los visigodos eran paganos y los hispanorromanos arrianos', 'Los visigodos eran arrianos y la población hispanorromana era católica', 'Los visigodos eran musulmanes y el pueblo era cristiano'], correct: 1 },
            { question: '¿En qué concilio se convirtió Recaredo al catolicismo?', options: ['I Concilio de Nicea', 'III Concilio de Toledo', 'Concilio de Trento'], correct: 1 },
            { question: '¿Qué consecuencia tuvo la conversión de Recaredo para la Iglesia?', options: ['La Iglesia perdió poder en Hispania', 'La Iglesia se convirtió en aliada clave del poder político visigodo', 'Se suprimieron todos los obispados del reino'], correct: 1 },
            { question: '¿Cómo se llamaba el código legal visigodo que unificó las leyes para todos los habitantes?', options: ['Código de Hammurabi', 'Liber Iudiciorum', 'Lex Romana Visigothorum'], correct: 1 },
            { question: '¿Qué rey promulgó el Liber Iudiciorum en el 654?', options: ['Recaredo', 'Recesvinto', 'Leovigildo'], correct: 1 }
          ],
          sources: [
            { title: 'Concilios de Toledo — Biblioteca Nacional de España', url: 'https://www.bne.es' },
            { title: 'Museo de los Concilios y la Cultura Visigoda — Toledo', url: 'https://www.toledo.es' }
          ]
        },
        {
          id: 'visigodos-3',
          title: 'La caída: Guadalete y el fin de un reino',
          icon: 'flame',
          blocks: [
            { type: 'p', text: 'A principios del siglo VIII el reino visigodo estaba debilitado por luchas internas de sucesión. En el 711, un ejército bereber y árabe al mando de Tariq ibn Ziyad cruzó el Estrecho —que desde entonces llevaría su nombre: Yabal Tariq, el monte de Tariq, hoy Gibraltar— y derrotó al rey Rodrigo en la batalla de Guadalete.' },
            { type: 'p', text: 'El reino visigodo colapsó en apenas tres años. Solo en las montañas del norte, en Asturias, sobrevivió un núcleo de resistencia cristiana que se convirtió en el germen de la futura Reconquista. La herencia visigoda, sin embargo, no desapareció: su lengua (latín), su ley y su Iglesia siguieron siendo referencias culturales durante siglos.' },
            { type: 'tip', text: '💡 La leyenda de "Don Rodrigo" y "La Cava" culpabilizaba al propio rey visigodo de la invasión: habría deshonrado a la hija del conde Julián, quien llamó a los árabes en venganza. Es un mito político que surgió siglos después para explicar la "traición" de algunos nobles hispanorromanos.' }
          ],
          questions: [
            { question: '¿Quién lideró el ejército que derrotó a los visigodos en Guadalete?', options: ['Muza ibn Nusayr', 'Tariq ibn Ziyad', 'Abderramán I'], correct: 1 },
            { question: '¿Qué nombre árabe dio origen al topónimo "Gibraltar"?', options: ['Yabal Musa', 'Yabal Tariq', 'Yabal al-Andalus'], correct: 1 },
            { question: '¿En qué año se produjo la batalla de Guadalete?', options: ['622', '711', '732'], correct: 1 },
            { question: '¿Dónde se formó el núcleo de resistencia cristiana tras la caída visigoda?', options: ['En los Pirineos catalanes', 'En las montañas de Asturias', 'En el reino de Navarra'], correct: 1 },
            { question: '¿Qué debilidad principal facilitó la rapidez de la invasión árabe?', options: ['La falta de ejército visigodo', 'Las luchas internas de sucesión que dividían el reino', 'La ausencia de murallas en las ciudades'], correct: 1 }
          ],
          sources: [
            { title: 'Real Academia de la Historia — Batalla de Guadalete', url: 'https://dbe.rah.es' },
            { title: 'Museo Arqueológico Nacional — Arte Visigodo', url: 'https://www.man.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 5 — La Edad Media: Al-Ándalus y Reconquista
    // ─────────────────────────────────────────────
    {
      id: 'edad-media',
      num: 5,
      title: 'La Edad Media: Al-Ándalus y Reconquista',
      icon: 'landmark',
      description: 'Dos caras de la misma moneda: el esplendor islámico y el avance cristiano hacia el sur.',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Al-Ándalus y Reconquista',
        intro: 'Pon a prueba tus conocimientos sobre los siglos medievales en la Península.',
        questions: [
          { question: '¿Cómo se llamaba el primer emirato independiente establecido en Córdoba en el 756?', options: ['Califato de Bagdad', 'Emirato omeya de Córdoba', 'Taifa de Sevilla'], correct: 1 },
          { question: '¿Qué batalla del 722 se considera el inicio simbólico de la Reconquista?', options: ['Batalla de Clavijo', 'Batalla de Covadonga', 'Batalla de las Navas de Tolosa'], correct: 1 },
          { question: '¿Qué rey asturiano ganó la batalla de Covadonga según la tradición?', options: ['Alfonso II el Casto', 'Don Pelayo', 'Ordoño I'], correct: 1 },
          { question: '¿En qué año alcanzó Córdoba su máximo esplendor como Califato?', options: ['Siglo VIII', 'Siglo X', 'Siglo XII'], correct: 1 },
          { question: '¿Cómo se llamaba la convivencia (y también tensión) de las tres culturas en Al-Ándalus?', options: ['Convivencia', 'Simbiosis mediterránea', 'Fusión ibérica'], correct: 0 },
          { question: '¿Qué gran batalla de 1212 abrió Andalucía a la conquista cristiana?', options: ['Batalla de Alarcos', 'Batalla de las Navas de Tolosa', 'Batalla del Salado'], correct: 1 },
          { question: '¿Cuál fue el último reino musulmán en la Península, conquistado en 1492?', options: ['El Califato de Córdoba', 'El Reino Nazarí de Granada', 'La Taifa de Sevilla'], correct: 1 },
          { question: '¿Qué filósofo andalusí del siglo XII, conocido como Averroes, fue clave para recuperar a Aristóteles en Europa?', options: ['Maimónides', 'Averroes (Ibn Rushd)', 'Avicena'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'edad-media-1',
          title: 'Al-Ándalus: el esplendor islámico',
          icon: 'moon-star',
          blocks: [
            { type: 'p', text: 'Tras la conquista del 711, la Península pasó a llamarse Al-Ándalus. En el 756, Abderramán I estableció en Córdoba un emirato independiente del Califato de Bagdad. Bajo Abderramán III (siglo X) Córdoba se convirtió en el califato más poderoso de Occidente: tenía más de 500.000 habitantes, cientos de mezquitas, una biblioteca con 400.000 volúmenes y alumbrado público.' },
            { type: 'p', text: 'Al-Ándalus fue un polo cultural de primer orden. Filósofos como Averroes (que devolvió a Aristóteles a Europa) y Maimónides (médico y filósofo judío) trabajaron en suelo andalusí. La arquitectura dejó la Mezquita-Catedral de Córdoba, la Alhambra de Granada y la Giralda de Sevilla.' },
            { type: 'tip', text: '💡 La palabra "alcalde", "almohada", "azúcar", "albañil" o "aceite" son de origen árabe. El 8% del vocabulario castellano tiene raíces árabes, legado de los siglos de Al-Ándalus.' }
          ],
          questions: [
            { question: '¿Quién estableció el emirato independiente de Córdoba en el 756?', options: ['Tariq ibn Ziyad', 'Abderramán I', 'Abderramán III'], correct: 1 },
            { question: '¿Qué filósofo andalusí fue clave para recuperar la obra de Aristóteles en Europa?', options: ['Avicena', 'Averroes', 'Al-Farabi'], correct: 1 },
            { question: '¿Cuál de estos monumentos NO es de origen islámico en España?', options: ['La Alhambra de Granada', 'La Mezquita de Córdoba', 'El acueducto de Segovia'], correct: 2 },
            { question: '¿Qué porcentaje aproximado del vocabulario castellano tiene raíces árabes?', options: ['1%', '8%', '25%'], correct: 1 },
            { question: '¿Qué ciudad fue el centro político y cultural de Al-Ándalus en su apogeo?', options: ['Sevilla', 'Córdoba', 'Granada'], correct: 1 }
          ],
          sources: [
            { title: 'Patronato de la Alhambra y Generalife', url: 'https://www.alhambra-patronato.es' },
            { title: 'Mezquita-Catedral de Córdoba', url: 'https://mezquita-catedralcordoba.es' }
          ]
        },
        {
          id: 'edad-media-2',
          title: 'La Reconquista: el avance cristiano',
          icon: 'cross',
          blocks: [
            { type: 'p', text: 'La tradición cristiana sitúa el inicio de la Reconquista en la batalla de Covadonga (722), donde el noble astur Don Pelayo derrotó a una incursión musulmana. En realidad fue un episodio menor, pero se convirtió en símbolo fundacional del reino de Asturias, embrión de Castilla y León.' },
            { type: 'p', text: 'Durante siglos el avance fue lento: el Duero, el Tajo, el Guadiana y finalmente el Guadalquivir fueron las líneas de frontera que los reinos cristianos fueron cruzando. La batalla de las Navas de Tolosa (1212) fue el punto de inflexión: abrió Andalucía. Fernando III el Santo tomó Córdoba (1236) y Sevilla (1248). Solo quedó en pie el Reino Nazarí de Granada, que sobrevivió hasta 1492.' },
            { type: 'tip', text: '💡 El Camino de Santiago (siglo IX en adelante) no fue solo un fenómeno religioso: fue una autopista cultural que conectó la Península con Europa, trayendo artistas, ideas y peregrinos que transformaron el arte románico y gótico español.' }
          ],
          questions: [
            { question: '¿Qué batalla es el símbolo fundacional de la Reconquista según la tradición cristiana?', options: ['Las Navas de Tolosa', 'Covadonga', 'Clavijo'], correct: 1 },
            { question: '¿Qué batalla de 1212 abrió el camino hacia Andalucía para los reinos cristianos?', options: ['Batalla de Alarcos', 'Batalla de las Navas de Tolosa', 'Batalla de Río Salado'], correct: 1 },
            { question: '¿Qué rey castellano conquistó Córdoba en 1236 y Sevilla en 1248?', options: ['Alfonso X el Sabio', 'Fernando III el Santo', 'Alfonso VIII'], correct: 1 },
            { question: '¿Qué función adicional cumplió el Camino de Santiago además de la religiosa?', options: ['Fue una ruta comercial de especias', 'Conectó la Península con Europa y difundió el arte románico y gótico', 'Sirvió como línea defensiva contra los musulmanes'], correct: 1 },
            { question: '¿Hasta qué año sobrevivió el Reino Nazarí de Granada?', options: ['1248', '1402', '1492'], correct: 2 }
          ],
          sources: [
            { title: 'Camino de Santiago — UNESCO', url: 'https://whc.unesco.org/en/list/669' },
            { title: 'Real Academia de la Historia — Reconquista', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'edad-media-3',
          title: 'La convivencia: tres culturas, una Península',
          icon: 'users',
          blocks: [
            { type: 'p', text: 'Durante siglos, musulmanes, judíos y cristianos coexistieron en la Península en una relación compleja que los historiadores llaman "convivencia". No fue siempre idílica: hubo persecuciones, masacres y expulsiones. Pero también hubo colaboración intelectual extraordinaria: en la Toledo cristiana del siglo XII, traductores judíos y árabes vertían al latín los textos de Aristóteles para las universidades europeas.' },
            { type: 'p', text: 'La Escuela de Traductores de Toledo fue uno de los centros de saber más importantes de la Edad Media. El rey Alfonso X el Sabio (siglo XIII) promovió la cultura en castellano, el árabe y el hebreo. Su corte era un modelo de pluralidad intelectual rara en la Europa medieval.' },
            { type: 'tip', text: '💡 Las "jarchas" son los poemas más antiguos escritos en una lengua romance (precastellano, siglo XI). Las escribían poetas árabes y judíos en Al-Ándalus como estribillo en lengua vulgar dentro de poemas cultos en árabe o hebreo.' }
          ],
          questions: [
            { question: '¿Cómo se llama el concepto histórico que describe la coexistencia de las tres culturas medievales en la Península?', options: ['Tolerancia ibérica', 'Convivencia', 'Simbiosis mediterránea'], correct: 1 },
            { question: '¿Qué ciudad fue el gran centro de traducción de textos griegos y árabes al latín en el siglo XII?', options: ['Salamanca', 'Toledo', 'Burgos'], correct: 1 },
            { question: '¿Quién fue Alfonso X el Sabio y qué le hace destacar?', options: ['Rey que conquistó Granada', 'Rey que promovió la cultura en castellano, árabe y hebreo en el siglo XIII', 'Rey que unió Castilla y Aragón'], correct: 1 },
            { question: '¿Qué son las jarchas?', options: ['Canciones de guerra visigodas', 'Los poemas más antiguos en lengua romance, escritos en Al-Ándalus', 'Crónicas de la Reconquista en latín'], correct: 1 },
            { question: '¿Qué textos traducía la Escuela de Traductores de Toledo?', options: ['La Biblia al árabe', 'Textos de Aristóteles y otros autores griegos y árabes al latín', 'Las crónicas visigodas al castellano'], correct: 1 }
          ],
          sources: [
            { title: 'Escuela de Traductores de Toledo — Ayuntamiento', url: 'https://www.toledo.es' },
            { title: 'Biblioteca Nacional — Alfonso X el Sabio', url: 'https://www.bne.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 6 — Los Reyes Católicos
    // ─────────────────────────────────────────────
    {
      id: 'reyes-catolicos',
      num: 6,
      title: 'Los Reyes Católicos: el nacimiento del Estado',
      icon: 'crown',
      description: 'Unión dinástica, toma de Granada, expulsión de los judíos y llegada a América.',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Los Reyes Católicos',
        intro: 'Un año clave, 1492, y mucho más. Demuestra que conoces este periodo fundacional.',
        questions: [
          { question: '¿En qué año se casaron Isabel de Castilla y Fernando de Aragón?', options: ['1469', '1479', '1492'], correct: 0 },
          { question: '¿Qué institución crearon los Reyes Católicos para perseguir la herejía?', options: ['El Tribunal del Santo Oficio (Inquisición)', 'El Consejo de Castilla', 'La Santa Hermandad'], correct: 0 },
          { question: '¿En qué año se tomó Granada y se expulsó a los judíos?', options: ['1469', '1492', '1516'], correct: 1 },
          { question: '¿Qué navegante llegó a América con patrocinio de los Reyes Católicos?', options: ['Vasco de Gama', 'Cristóbal Colón', 'Américo Vespucio'], correct: 1 },
          { question: '¿Cuántos judíos se estima que fueron expulsados de España en 1492?', options: ['Unos 5.000', 'Entre 100.000 y 200.000', 'Más de un millón'], correct: 1 },
          { question: '¿Qué tratado de 1494 repartió el mundo entre España y Portugal?', options: ['Tratado de Utrecht', 'Tratado de Tordesillas', 'Tratado de Westfalia'], correct: 1 },
          { question: '¿Qué conquistó Fernando de Aragón en 1504, completando la unión peninsular?', options: ['Portugal', 'Navarra', 'El reino de Nápoles'], correct: 2 },
          { question: '¿Qué documento de 1492 fijó el acuerdo para el viaje de Colón?', options: ['Las Bulas Alejandrinas', 'Las Capitulaciones de Santa Fe', 'El Tratado de Alcáçovas'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'reyes-catolicos-1',
          title: 'La unión de Castilla y Aragón',
          icon: 'merge',
          blocks: [
            { type: 'p', text: 'En 1469, Isabel de Castilla y Fernando de Aragón se casaron en Valladolid de forma casi secreta, ante la oposición de muchos nobles. No fue una unión de reinos: cada uno siguió gobernando el suyo. Pero fue el inicio de una alianza que cambiaría el mundo.' },
            { type: 'p', text: 'Para consolidar su poder crearon la Santa Hermandad (policía rural), reformaron la administración y sometieron a la nobleza rebelde. La Inquisición española, establecida en 1478, fue otro instrumento de control religioso y político. Los Reyes Católicos construyeron el primer Estado moderno de Europa, con leyes comunes, política exterior coordinada y una identidad basada en la fe católica.' },
            { type: 'tip', text: '💡 El título de "Reyes Católicos" no se lo pusieron ellos mismos: se lo concedió el papa Alejandro VI en 1494 como reconocimiento a su defensa de la fe, especialmente tras la toma de Granada y la expulsión de los judíos.' }
          ],
          questions: [
            { question: '¿En qué ciudad se casaron Isabel y Fernando en 1469?', options: ['Toledo', 'Valladolid', 'Burgos'], correct: 1 },
            { question: '¿Qué cuerpo de seguridad crearon los Reyes Católicos para controlar el orden en el campo?', options: ['La Guardia Civil', 'La Santa Hermandad', 'Los Tercios'], correct: 1 },
            { question: '¿En qué año se estableció la Inquisición española?', options: ['1469', '1478', '1492'], correct: 1 },
            { question: '¿Quién les concedió el título de "Reyes Católicos"?', options: ['El Concilio de Trento', 'El papa Alejandro VI', 'El propio Parlamento de Castilla'], correct: 1 },
            { question: '¿Qué modelo de Estado inauguraron los Reyes Católicos?', options: ['Una república parlamentaria', 'El primer Estado moderno europeo con administración centralizada', 'Una monarquía feudal sin leyes comunes'], correct: 1 }
          ],
          sources: [
            { title: 'Real Academia de la Historia — Isabel I', url: 'https://dbe.rah.es' },
            { title: 'Museo Nacional de Escultura — Valladolid', url: 'https://www.culturaydeporte.gob.es/mnescultura' }
          ]
        },
        {
          id: 'reyes-catolicos-2',
          title: '1492: el año que cambió el mundo',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'El 2 de enero de 1492, Boabdil entregó las llaves de Granada a los Reyes Católicos. Terminaba la Reconquista. El mismo año, el Edicto de Granada expulsó a los judíos: entre 100.000 y 200.000 personas tuvieron que convertirse o marcharse. Los que se fueron se llamaron sefardíes y sus descendientes conservan aún el ladino (judeoespañol) en comunidades de Turquía, Grecia o Marruecos.' },
            { type: 'p', text: 'El 12 de octubre de 1492, Cristóbal Colón llegó a las Bahamas tras firmar las Capitulaciones de Santa Fe con los reyes. Ninguno de los dos —ni Colón ni los reyes— comprendió en ese momento la magnitud de lo que acababa de ocurrir. Colón murió creyendo que había llegado a Asia.' },
            { type: 'tip', text: '💡 El mismo 1492 se publicó la primera gramática del castellano, escrita por el humanista Antonio de Nebrija. En el prólogo escribió: "la lengua fue siempre compañera del Imperio." Una frase que define perfectamente la época.' }
          ],
          questions: [
            { question: '¿Quién entregó las llaves de Granada a los Reyes Católicos el 2 de enero de 1492?', options: ['Muhammad XII (Boabdil)', 'Abderramán III', 'Tariq ibn Ziyad'], correct: 0 },
            { question: '¿Cómo se llaman los judíos expulsados de España en 1492 y sus descendientes?', options: ['Asquenazíes', 'Sefardíes', 'Conversos'], correct: 1 },
            { question: '¿Qué documento firmó Colón con los reyes para financiar su viaje?', options: ['El Tratado de Tordesillas', 'Las Capitulaciones de Santa Fe', 'Las Bulas Alejandrinas'], correct: 1 },
            { question: '¿Dónde llegó Colón el 12 de octubre de 1492?', options: ['Cuba', 'Las Bahamas', 'América del Sur'], correct: 1 },
            { question: '¿Qué humanista publicó la primera gramática del castellano en 1492?', options: ['Lope de Vega', 'Antonio de Nebrija', 'Juan de Mena'], correct: 1 }
          ],
          sources: [
            { title: 'Archivo General de Indias — Capitulaciones de Santa Fe', url: 'https://www.culturaydeporte.gob.es/archivos/agindias' },
            { title: 'Biblioteca Nacional — Antonio de Nebrija', url: 'https://www.bne.es' }
          ]
        },
        {
          id: 'reyes-catolicos-3',
          title: 'Política exterior y herencia',
          icon: 'flag',
          blocks: [
            { type: 'p', text: 'Los Reyes Católicos no solo miraron a América: también dominaron Italia. Fernando conquistó el reino de Nápoles en 1504 gracias al Gran Capitán, Gonzalo Fernández de Córdoba, que renovó la táctica militar europea con los Tercios. España se convirtió en la primera potencia militar del Mediterráneo.' },
            { type: 'p', text: 'El Tratado de Tordesillas (1494) repartió el mundo entre España y Portugal. Una línea imaginaria dividió el Atlántico: todo lo que estuviera al oeste sería español, al este portugués. Era la primera geopolítica global de la historia.' },
            { type: 'tip', text: '💡 Isabel murió en 1504 y Fernando no pudo heredar Castilla. Fue su hija Juana (llamada "la Loca") quien heredó, con su marido Felipe el Hermoso. Cuando Felipe murió joven, Fernando gobernó como regente hasta su muerte en 1516, y el trono pasó a su nieto Carlos.' }
          ],
          questions: [
            { question: '¿Qué general español renovó la táctica militar europea durante las guerras de Italia?', options: ['El Duque de Alba', 'El Gran Capitán (Gonzalo Fernández de Córdoba)', 'Hernán Cortés'], correct: 1 },
            { question: '¿Qué dividía el Tratado de Tordesillas entre España y Portugal?', options: ['El océano Índico', 'El Atlántico mediante una línea imaginaria', 'El continente americano por el ecuador'], correct: 1 },
            { question: '¿En qué año se firmó el Tratado de Tordesillas?', options: ['1492', '1494', '1504'], correct: 1 },
            { question: '¿Quién era el nieto de los Reyes Católicos que heredó el trono en 1516?', options: ['Felipe II', 'Carlos (futuro Carlos V)', 'Fernando el Católico'], correct: 1 },
            { question: '¿Por qué no pudo Fernando heredar Castilla tras la muerte de Isabel?', options: ['Porque el Tratado de Tordesillas lo impedía', 'Porque Castilla solo podía ser heredada por una mujer o su marido', 'Porque fue excomulgado por el Papa'], correct: 1 }
          ],
          sources: [
            { title: 'Archivo General de Indias', url: 'https://www.culturaydeporte.gob.es/archivos/agindias' },
            { title: 'Real Academia de la Historia — Fernando el Católico', url: 'https://dbe.rah.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 7 — El Imperio Español: Los Austrias y el Siglo de Oro
    // ─────────────────────────────────────────────
    {
      id: 'austrias',
      num: 7,
      title: 'El Imperio: Los Austrias y el Siglo de Oro',
      icon: 'globe-2',
      description: 'De Carlos V a Carlos II: el mayor Imperio del mundo y su florecimiento cultural.',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Los Austrias y el Siglo de Oro',
        intro: 'Del mayor Imperio del mundo al ocaso de los Habsburgo. ¿Cuánto sabes?',
        questions: [
          { question: '¿Qué rey español fue también Emperador del Sacro Imperio Romano Germánico?', options: ['Felipe II', 'Carlos I (Carlos V)', 'Felipe IV'], correct: 1 },
          { question: '¿Quién escribió "El Quijote", considerada la primera novela moderna?', options: ['Lope de Vega', 'Francisco de Quevedo', 'Miguel de Cervantes'], correct: 2 },
          { question: '¿Qué batalla naval de 1571 frenó la expansión otomana en el Mediterráneo?', options: ['Batalla de Trafalgar', 'Batalla de Lepanto', 'Batalla de Gravelines'], correct: 1 },
          { question: '¿En qué año se derrotó a la Armada Invencible española?', options: ['1571', '1588', '1648'], correct: 1 },
          { question: '¿Qué tratado de 1648 marcó el inicio del declive del Imperio español en Europa?', options: ['Tratado de Utrecht', 'Paz de Westfalia', 'Tratado de los Pirineos'], correct: 1 },
          { question: '¿Cuál de estos pintores NO fue del Siglo de Oro español?', options: ['Velázquez', 'El Greco', 'Francisco de Goya'], correct: 2 },
          { question: '¿Qué explorador español completó la primera vuelta al mundo en la expedición de Magallanes-Elcano?', options: ['Hernán Cortés', 'Juan Sebastián Elcano', 'Francisco Pizarro'], correct: 1 },
          { question: '¿Cómo se llamaba el sistema de trabajo forzado indígena en América que generó gran controversia moral?', options: ['Mita y encomienda', 'Sistema de peonaje', 'Tributo de sangre'], correct: 0 }
        ]
      },
      lessons: [
        {
          id: 'austrias-1',
          title: 'Carlos V: el Imperio donde no se ponía el sol',
          icon: 'sun',
          blocks: [
            { type: 'p', text: 'Carlos I de España (Carlos V como Emperador) heredó en 1516 el mayor conjunto de territorios de la historia: Castilla, Aragón, Nápoles, Sicilia, los Países Bajos, el Franco Condado, Alemania y los territorios americanos. Nunca antes ni después nadie gobernó tanto desde Europa.' },
            { type: 'p', text: 'Su reinado fue una sucesión de guerras: contra Francia (por Italia), contra los turcos otomanos (Lepanto llegará con su hijo), contra los protestantes alemanes (Lutero publicó sus tesis en 1517, el mismo año que Carlos llegó al poder). Abdicó en 1556, cansado y enfermo, y se retiró al monasterio de Yuste (Extremadura) hasta su muerte en 1558.' },
            { type: 'tip', text: '💡 La frase "en mis dominios nunca se pone el sol" no la dijo Carlos V, sino que fue atribuida a él siglos después. El primero en usarla fue el escritor John Heywood en 1546 refiriéndose precisamente al Imperio español.' }
          ],
          questions: [
            { question: '¿Qué territorios heredó Carlos I al subir al trono en 1516?', options: ['Solo España y sus colonias americanas', 'España, los Países Bajos, Alemania, Italia y América', 'España, Francia y Portugal'], correct: 1 },
            { question: '¿Qué acontecimiento religioso sacudió Europa el mismo año que Carlos llegó al poder?', options: ['El Concilio de Trento', 'Las 95 tesis de Lutero', 'La Contrarreforma española'], correct: 1 },
            { question: '¿Dónde se retiró Carlos V tras abdicar en 1556?', options: ['Al Palacio del Escorial', 'Al monasterio de Yuste en Extremadura', 'A los Países Bajos'], correct: 1 },
            { question: '¿En qué año abdicó Carlos V?', options: ['1545', '1556', '1558'], correct: 1 },
            { question: '¿Qué otros nombre tenía Carlos I de España en el contexto del Imperio?', options: ['Felipe II', 'Carlos V del Sacro Imperio Romano Germánico', 'Maximiliano I'], correct: 1 }
          ],
          sources: [
            { title: 'Monasterio de Yuste — Patrimonio Nacional', url: 'https://www.patrimonionacional.es/visita/monasterio-de-yuste' },
            { title: 'Museo del Prado — Carlos V', url: 'https://www.museodelprado.es' }
          ]
        },
        {
          id: 'austrias-2',
          title: 'Felipe II y el ocaso de los Austrias',
          icon: 'sunset',
          blocks: [
            { type: 'p', text: 'Felipe II construyó el Escorial, venció en Lepanto (1571) y anexionó Portugal (1580). Pero su reinado también vio la derrota de la Armada Invencible (1588) frente a Inglaterra, el inicio de la independencia de los Países Bajos y el agotamiento financiero por las guerras continuas. España declaró la bancarrota cuatro veces durante su reinado.' },
            { type: 'p', text: 'Los Austrias menores (Felipe III, Felipe IV, Carlos II) fueron incapaces de frenar el declive. La Paz de Westfalia (1648) reconoció la independencia de los Países Bajos. Carlos II murió en 1700 sin descendencia, dejando el trono en disputa y abriendo la Guerra de Sucesión española.' },
            { type: 'tip', text: '💡 Felipe II era conocido en Europa como "el Demonio del Sur" por sus enemigos protestantes. Para sus súbditos católicos era el defensor de la fe. Un mismo rey, dos imágenes opuestas: primer ejemplo de guerra de propaganda moderna.' }
          ],
          questions: [
            { question: '¿Qué gran edificio mandó construir Felipe II como palacio, monasterio y panteón real?', options: ['El Palacio Real de Madrid', 'El monasterio de El Escorial', 'La Catedral de Toledo'], correct: 1 },
            { question: '¿Qué derrota naval de 1588 marcó el inicio del declive español en el Atlántico?', options: ['La batalla de Trafalgar', 'La derrota de la Armada Invencible', 'La batalla de Gravelines'], correct: 1 },
            { question: '¿Qué tratado de 1648 reconoció la independencia de los Países Bajos?', options: ['Tratado de Utrecht', 'Paz de Westfalia', 'Tratado de los Pirineos'], correct: 1 },
            { question: '¿Cuántas veces declaró España la bancarrota durante el reinado de Felipe II?', options: ['Una', 'Dos', 'Cuatro'], correct: 2 },
            { question: '¿Por qué fue importante la muerte de Carlos II en 1700?', options: ['Porque fue asesinado en un complot', 'Porque murió sin descendencia dejando el trono en disputa', 'Porque España perdió sus colonias americanas'], correct: 1 }
          ],
          sources: [
            { title: 'Real Monasterio de El Escorial — Patrimonio Nacional', url: 'https://www.patrimonionacional.es/visita/real-sitio-de-san-lorenzo-de-el-escorial' },
            { title: 'Museo Nacional del Prado', url: 'https://www.museodelprado.es' }
          ]
        },
        {
          id: 'austrias-3',
          title: 'El Siglo de Oro: arte y literatura',
          icon: 'feather',
          blocks: [
            { type: 'p', text: 'Mientras el poder político se erosionaba, la cultura española vivía su momento más brillante. El Siglo de Oro (aprox. 1492-1681) dio a la literatura universal el Quijote de Cervantes (1605/1615), los dramas de Lope de Vega y Calderón de la Barca, y la poesía de Góngora y Quevedo. En pintura, Velázquez, El Greco y Zurbarán.' },
            { type: 'p', text: 'La paradoja del Siglo de Oro es que coincide con el declive político y económico: como si la energía creativa se disparara precisamente cuando el poder material se agotaba. Cervantes luchó en Lepanto, estuvo preso en Argel y vivió en la pobreza. Su Quijote es, entre muchas cosas, una meditación sobre el fracaso de los ideales.' },
            { type: 'tip', text: '💡 Lope de Vega escribió más de 1.500 obras de teatro (se conservan unas 400). Fue llamado "el Fénix de los Ingenios" y "monstruo de la naturaleza" por Cervantes. Sus obras se representaban ante todo el pueblo, no solo ante la élite.' }
          ],
          questions: [
            { question: '¿En qué año se publicó la primera parte del Quijote?', options: ['1492', '1605', '1648'], correct: 1 },
            { question: '¿En qué batalla naval participó Cervantes antes de escribir el Quijote?', options: ['Trafalgar', 'Lepanto', 'La Invencible'], correct: 1 },
            { question: '¿Cuántas obras de teatro escribió aproximadamente Lope de Vega?', options: ['Unas 50', 'Unas 400 conservadas de más de 1.500', 'Unas 100 conservadas'], correct: 1 },
            { question: '¿Cuál de estos pintores NO pertenece al Siglo de Oro español?', options: ['El Greco', 'Velázquez', 'Francisco de Goya'], correct: 2 },
            { question: '¿Qué paradoja caracteriza al Siglo de Oro español?', options: ['Fue el periodo de mayor poder político pero menor producción cultural', 'El florecimiento cultural coincidió con el declive político y económico', 'Los artistas solo trabajaban para la Iglesia y el rey'], correct: 1 }
          ],
          sources: [
            { title: 'Biblioteca Virtual Miguel de Cervantes', url: 'https://www.cervantesvirtual.com' },
            { title: 'Museo del Prado — Siglo de Oro', url: 'https://www.museodelprado.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 8 — Los Borbones y la Ilustración
    // ─────────────────────────────────────────────
    {
      id: 'borbones-ilustracion',
      num: 8,
      title: 'Los Borbones y la Ilustración',
      icon: 'lamp',
      description: 'Guerra de Sucesión, reformas ilustradas y la crisis del Antiguo Régimen.',
      image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Los Borbones y la Ilustración',
        intro: 'El siglo XVIII español: guerras, reformas y las ideas que cambiaron el mundo.',
        questions: [
          { question: '¿Qué guerra estalló tras la muerte de Carlos II por la sucesión del trono español?', options: ['Guerra de los Treinta Años', 'Guerra de Sucesión española', 'Guerra de los Siete Años'], correct: 1 },
          { question: '¿Qué tratado de 1713 reconoció a Felipe V como rey pero supuso pérdidas territoriales?', options: ['Tratado de Westfalia', 'Tratado de Utrecht', 'Tratado de París'], correct: 1 },
          { question: '¿Qué cedió España a Gran Bretaña en el Tratado de Utrecht?', options: ['Cuba y Puerto Rico', 'Gibraltar y Menorca', 'Las Canarias y Ceuta'], correct: 1 },
          { question: '¿Qué reformas promovió Carlos III en el siglo XVIII?', options: ['Reformas militares y expulsión de los protestantes', 'Reformas administrativas, económicas y culturales ilustradas', 'Reformas religiosas que suprimieron la Inquisición'], correct: 1 },
          { question: '¿Qué orden religiosa expulsó Carlos III de España en 1767?', options: ['Los franciscanos', 'Los dominicos', 'Los jesuitas'], correct: 2 },
          { question: '¿Qué institución cultural creó Felipe V que sigue siendo referente hoy?', options: ['La Universidad Complutense', 'La Real Academia Española', 'El Museo del Prado'], correct: 1 },
          { question: '¿Qué corriente intelectual europea caracterizó el siglo XVIII?', options: ['El Humanismo renacentista', 'La Ilustración o el Siglo de las Luces', 'El Romanticismo'], correct: 1 },
          { question: '¿Quién fue el gran pensador ilustrado español del siglo XVIII?', options: ['Francisco de Goya', 'Gaspar Melchor de Jovellanos', 'Leandro Fernández de Moratín'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'borbones-1',
          title: 'La Guerra de Sucesión y los nuevos Borbones',
          icon: 'swords',
          blocks: [
            { type: 'p', text: 'Cuando Carlos II murió sin herederos en 1700, dejó el trono a Felipe de Anjou, nieto de Luis XIV de Francia. Pero Austria reclamó el trono para su candidato, el archiduque Carlos. Estalló la Guerra de Sucesión española (1701-1713), que en realidad fue una guerra europea por el equilibrio de poder.' },
            { type: 'p', text: 'El Tratado de Utrecht (1713) reconoció a Felipe V como rey de España, pero a un precio enorme: Gibraltar y Menorca pasaron a Gran Bretaña. Gibraltar sigue siendo territorio británico hoy. Además, España perdió sus posesiones en Italia y los Países Bajos, y la dinastía borbónica centralista eliminó los fueros de Aragón, Cataluña, Valencia y Mallorca, que habían apoyado al bando austriaco.' },
            { type: 'tip', text: '💡 Los Decretos de Nueva Planta (1707-1716) de Felipe V abolieron los fueros y privilegios de los reinos de la Corona de Aragón. Fue el primer gran intento de centralización del Estado español — y el origen de tensiones que aún resuenan en la política actual.' }
          ],
          questions: [
            { question: '¿Entre qué años se libró la Guerra de Sucesión española?', options: ['1688-1697', '1701-1713', '1740-1748'], correct: 1 },
            { question: '¿Qué territorios cedió España a Gran Bretaña en el Tratado de Utrecht?', options: ['Las Canarias y Ceuta', 'Gibraltar y Menorca', 'Cuba y Jamaica'], correct: 1 },
            { question: '¿Cómo se llamaron los decretos de Felipe V que abolieron los fueros de Aragón?', options: ['Decretos de Brihuega', 'Decretos de Nueva Planta', 'Fueros de Castilla'], correct: 1 },
            { question: '¿A qué familia dinástica pertenecía Felipe V?', options: ['Habsburgo', 'Borbón', 'Sajonia'], correct: 1 },
            { question: '¿Qué bando apoyaron Cataluña, Aragón y Valencia durante la guerra?', options: ['Al candidato borbónico Felipe V', 'Al candidato austriaco archiduque Carlos', 'A la neutralidad absoluta'], correct: 1 }
          ],
          sources: [
            { title: 'Real Academia de la Historia — Felipe V', url: 'https://dbe.rah.es' },
            { title: 'Biblioteca Nacional — Tratado de Utrecht', url: 'https://www.bne.es' }
          ]
        },
        {
          id: 'borbones-2',
          title: 'Carlos III: el mejor alcalde de Madrid',
          icon: 'city',
          blocks: [
            { type: 'p', text: 'Carlos III (1759-1788) es considerado el rey ilustrado por excelencia en España. Transformó Madrid en una capital moderna: construyó el Paseo del Prado, el Jardín Botánico, el Museo del Prado (entonces Gabinete de Historia Natural), el Hospital de San Carlos y puso farolas en las calles. Los madrileños lo llamaron "el mejor alcalde de Madrid".' },
            { type: 'p', text: 'Sus reformas iban más allá de la urbanística: promovió la agricultura, el comercio y las artes. Expulsó a los jesuitas en 1767 (acusados de interferir en la política). Creó las Sociedades Económicas de Amigos del País para difundir el pensamiento ilustrado en toda España.' },
            { type: 'tip', text: '💡 Bajo Carlos III se construyó la Puerta de Alcalá de Madrid (1778), símbolo de la ciudad. También fundó las Reales Fábricas de tapices, porcelana y cristal. La Corona española fue una de las más activas en aplicar las ideas ilustradas en Europa.' }
          ],
          questions: [
            { question: '¿Por qué Carlos III es llamado "el mejor alcalde de Madrid"?', options: ['Porque fue alcalde de Madrid antes de ser rey', 'Por las reformas urbanísticas y culturales que transformaron la ciudad', 'Porque abolió los impuestos en Madrid'], correct: 1 },
            { question: '¿Qué orden expulsó Carlos III de España en 1767?', options: ['Los franciscanos', 'Los dominicos', 'Los jesuitas'], correct: 2 },
            { question: '¿Qué institución creó Carlos III para difundir el pensamiento ilustrado?', options: ['La Real Academia Española', 'Las Sociedades Económicas de Amigos del País', 'El Consejo de Estado'], correct: 1 },
            { question: '¿Cuándo reinó Carlos III en España?', options: ['1700-1746', '1759-1788', '1788-1808'], correct: 1 },
            { question: '¿Cuál de estos edificios madrileños se construyó bajo el reinado de Carlos III?', options: ['El Palacio Real', 'La Puerta de Alcalá', 'La Catedral de la Almudena'], correct: 1 }
          ],
          sources: [
            { title: 'Museo Nacional del Prado — Historia del edificio', url: 'https://www.museodelprado.es/el-prado/historia-del-museo' },
            { title: 'Ayuntamiento de Madrid — Historia', url: 'https://www.madrid.es/portal/site/munimadrid' }
          ]
        },
        {
          id: 'borbones-3',
          title: 'La Ilustración española y la crisis del Antiguo Régimen',
          icon: 'book-open',
          blocks: [
            { type: 'p', text: 'Los ilustrados españoles —Jovellanos, Floridablanca, Campomanes— querían modernizar el país desde arriba: reformar la educación, fomentar la industria, reducir el poder de la Iglesia y la Inquisición. Pero chocaban con la resistencia de la nobleza, el clero y unas estructuras sociales muy rígidas.' },
            { type: 'p', text: 'La Revolución Francesa (1789) cambió todo. El miedo a que las ideas revolucionarias cruzaran los Pirineos llevó a cerrar las fronteras culturales. Carlos IV (1788-1808), débil e influenciable, dejó el poder real en manos de Manuel Godoy. La alianza con Napoleón terminó con la invasión francesa en 1808.' },
            { type: 'tip', text: '💡 Francisco de Goya pintó el retrato de Carlos IV y su familia con una honestidad despiadada: los retratos muestran a personajes torpes y poco agraciados. Nunca se sabe si el rey entendió la ironía. Goya es también el cronista visual de la guerra y el horror.' }
          ],
          questions: [
            { question: '¿Qué pretendían los ilustrados españoles como Jovellanos?', options: ['Restaurar el poder de la Inquisición', 'Modernizar España reformando educación, industria y estructuras sociales', 'Recuperar los territorios perdidos en Utrecht'], correct: 1 },
            { question: '¿Qué evento de 1789 atemorizó a la monarquía española y cerró las fronteras intelectuales?', options: ['La independencia de Estados Unidos', 'La Revolución Francesa', 'La Revolución Industrial inglesa'], correct: 1 },
            { question: '¿Quién fue el valido de Carlos IV que ejerció el poder real?', options: ['Floridablanca', 'Manuel Godoy', 'Campomanes'], correct: 1 },
            { question: '¿Qué pintor retrató a Carlos IV con una honestidad irónica?', options: ['Velázquez', 'Francisco de Goya', 'El Greco'], correct: 1 },
            { question: '¿Con qué alianza política se metió España que terminó en la invasión de 1808?', options: ['Alianza con Gran Bretaña', 'Alianza con Napoleón Bonaparte', 'Alianza con Austria'], correct: 1 }
          ],
          sources: [
            { title: 'Museo del Prado — Goya', url: 'https://www.museodelprado.es' },
            { title: 'Real Academia de la Historia — Jovellanos', url: 'https://dbe.rah.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 9 — Guerra, Liberalismo y Revolución
    // ─────────────────────────────────────────────
    {
      id: 'liberalismo',
      num: 9,
      title: 'Guerra, Liberalismo y Revolución',
      icon: 'flame',
      description: 'La invasión napoleónica, las Cortes de Cádiz, Fernando VII e Isabel II.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Guerra, Liberalismo y Revolución (1808-1874)',
        intro: 'El siglo XIX español fue una montaña rusa. Comprueba si conoces sus momentos clave.',
        questions: [
          { question: '¿En qué fecha comenzó el levantamiento popular contra los franceses en Madrid?', options: ['2 de mayo de 1808', '12 de octubre de 1808', '19 de marzo de 1808'], correct: 0 },
          { question: '¿Qué constitución española fue la primera en reconocer la soberanía nacional?', options: ['Constitución de 1837', 'Constitución de Cádiz de 1812', 'Estatuto Real de 1834'], correct: 1 },
          { question: '¿Con qué nombre popularmente se conoce la Constitución de 1812?', options: ['La Progresista', 'La Pepa', 'La Liberal'], correct: 1 },
          { question: '¿Qué hizo Fernando VII al volver al trono en 1814 con la Constitución de 1812?', options: ['La reformó para hacerla más liberal', 'La abolió y restauró el absolutismo', 'La mantuvo pero anuló las Cortes'], correct: 1 },
          { question: '¿Cuándo se proclamó la Primera República española?', options: ['1848', '1868', '1873'], correct: 2 },
          { question: '¿Qué guerra carlista enfrentó a los partidarios de Isabel II con los del pretendiente Carlos?', options: ['Solo una guerra', 'Tres guerras carlistas a lo largo del siglo', 'Dos guerras carlistas'], correct: 1 },
          { question: '¿Qué revolución derrocó a Isabel II en 1868?', options: ['La Revolución de 1820', 'La Gloriosa', 'El Sexenio Liberal'], correct: 1 },
          { question: '¿Qué pintor español documentó el horror de la guerra napoleónica con sus "Desastres de la guerra"?', options: ['Velázquez', 'Sorolla', 'Francisco de Goya'], correct: 2 }
        ]
      },
      lessons: [
        {
          id: 'liberalismo-1',
          title: 'La Guerra de Independencia y las Cortes de Cádiz',
          icon: 'cannon',
          blocks: [
            { type: 'p', text: 'El 2 de mayo de 1808, el pueblo de Madrid se levantó contra las tropas francesas de Napoleón. Fue el inicio de la Guerra de Independencia (1808-1814), un conflicto brutal donde el ejército regular español fue destruido pero la resistencia popular —la guerrilla— mantuvo a Francia en jaque durante seis años.' },
            { type: 'p', text: 'Mientras la guerra ardía, en Cádiz (la única ciudad no ocupada por los franceses, protegida por la flota inglesa) se reunían las Cortes. En 1812 aprobaron la primera Constitución española: la "Pepa" (promulgada el día de San José). Reconocía la soberanía nacional, la separación de poderes y los derechos individuales. Era una revolución en papel.' },
            { type: 'tip', text: '💡 La palabra "guerrilla" —que hoy usan todos los ejércitos del mundo— nació en la Guerra de Independencia española para describir las partidas irregulares que hostigaban a las tropas napoleónicas. España exportó el concepto al vocabulario militar universal.' }
          ],
          questions: [
            { question: '¿Qué fecha marca el inicio del levantamiento popular contra Napoleón en Madrid?', options: ['2 de mayo de 1808', '2 de agosto de 1808', '19 de marzo de 1808'], correct: 0 },
            { question: '¿Por qué se reunieron las Cortes en Cádiz y no en Madrid?', options: ['Porque Cádiz era la capital de España en ese momento', 'Porque Cádiz era la única ciudad importante no ocupada por los franceses', 'Porque el clima de Cádiz era más favorable para las reuniones'], correct: 1 },
            { question: '¿Qué apelativo recibió la Constitución de 1812?', options: ['La Gloriosa', 'La Pepa', 'La Progresista'], correct: 1 },
            { question: '¿Qué nueva forma de combate desarrollaron los españoles contra Napoleón?', options: ['La guerra de trincheras', 'La guerrilla', 'La guerra naval'], correct: 1 },
            { question: '¿Qué principio político fundamental reconocía la Constitución de 1812?', options: ['La soberanía del rey absoluto', 'La soberanía nacional y la separación de poderes', 'La soberanía compartida entre rey y nobleza'], correct: 1 }
          ],
          sources: [
            { title: 'Cortes Generales — Constitución de 1812', url: 'https://www.congreso.es' },
            { title: 'Museo de las Cortes de Cádiz', url: 'https://www.museosdeandalucia.es' }
          ]
        },
        {
          id: 'liberalismo-2',
          title: 'Fernando VII, el liberalismo y las guerras carlistas',
          icon: 'crown-off',
          blocks: [
            { type: 'p', text: 'Fernando VII volvió al trono en 1814 con el apoyo del pueblo que lo aclamaba como "el Deseado". Su primera decisión: abolir la Constitución de 1812 y restaurar el absolutismo. Gobernó de forma despótica hasta 1833, alternando periodos de represión con momentos de liberalización forzada (el Trienio Liberal, 1820-1823, en que un pronunciamiento militar le obligó a aceptar la Constitución de 1812).' },
            { type: 'p', text: 'Al morir sin hijos varones, Fernando modificó la ley de sucesión para que su hija Isabel heredara. Su hermano Carlos se negó y reclamó el trono. Estalló la Primera Guerra Carlista (1833-1840): liberales con Isabel, absolutistas con Carlos. Hubo tres guerras carlistas a lo largo del siglo, el último conflicto carlista fue en 1872-1876.' },
            { type: 'tip', text: '💡 Durante el reinado de Fernando VII se perdieron casi todas las colonias americanas: entre 1810 y 1824, México, Perú, Colombia, Argentina y el resto de Hispanoamérica proclamaron su independencia. España pasó de ser Imperio global a potencia media en menos de una generación.' }
          ],
          questions: [
            { question: '¿Qué hizo Fernando VII con la Constitución de 1812 al volver al poder en 1814?', options: ['La aceptó y gobernó con ella', 'La abolió y restauró el absolutismo', 'La reformó para hacerla más moderada'], correct: 1 },
            { question: '¿Qué fue el Trienio Liberal (1820-1823)?', options: ['Tres años de monarquía parlamentaria voluntaria de Fernando VII', 'Un periodo en que un pronunciamiento militar obligó a Fernando VII a aceptar la Constitución', 'Los tres años de la Primera República española'], correct: 1 },
            { question: '¿Cuántas guerras carlistas hubo a lo largo del siglo XIX?', options: ['Una', 'Dos', 'Tres'], correct: 2 },
            { question: '¿Qué ocurrió con las colonias americanas durante el reinado de Fernando VII?', options: ['Se consolidaron y expandieron', 'La mayoría declararon su independencia entre 1810 y 1824', 'Fueron vendidas a Francia'], correct: 1 },
            { question: '¿Quién era el pretendiente carlista al trono de España?', options: ['El hermano de Fernando VII, Carlos', 'El hijo de Carlos IV, Francisco', 'El nieto de Carlos III, Luis'], correct: 0 }
          ],
          sources: [
            { title: 'Real Academia de la Historia — Fernando VII', url: 'https://dbe.rah.es' },
            { title: 'Biblioteca Nacional — Guerras Carlistas', url: 'https://www.bne.es' }
          ]
        },
        {
          id: 'liberalismo-3',
          title: 'Isabel II, la Gloriosa y el Sexenio Democrático',
          icon: 'revolution',
          blocks: [
            { type: 'p', text: 'Isabel II reinó de 1833 a 1868 bajo la tutela de generales y partidos liberales que se alternaban en el poder mediante pronunciamientos militares. Su reinado fue una era de modernización (ferrocarril, telégrafo, bolsa) pero también de corrupción, inestabilidad y guerras coloniales.' },
            { type: 'p', text: 'En 1868, la revolución "la Gloriosa" la derrocó. El Sexenio Democrático (1868-1874) fue un experimento acelerado: nueva Constitución de 1869 (la más democrática del siglo), un rey importado de Italia (Amadeo I), y finalmente la Primera República española (1873), que duró once meses y tuvo cuatro presidentes. El pronunciamiento de Martínez Campos en 1874 restauró la monarquía borbónica en la figura de Alfonso XII.' },
            { type: 'tip', text: '💡 El Sexenio Democrático vio nacer el movimiento obrero organizado en España: en 1869 llegó a Madrid el delegado de la Primera Internacional, Giuseppe Fanelli, y fundó las primeras secciones anarquistas. El conflicto entre capital y trabajo entró en la política española para quedarse.' }
          ],
          questions: [
            { question: '¿Hasta qué año reinó Isabel II antes de ser depuesta?', options: ['1854', '1868', '1874'], correct: 1 },
            { question: '¿Cómo se llamó la revolución de 1868 que derrocó a Isabel II?', options: ['La Progresista', 'La Gloriosa', 'El Bienio Progresista'], correct: 1 },
            { question: '¿Cuántos presidentes tuvo la Primera República española en sus once meses?', options: ['Dos', 'Cuatro', 'Seis'], correct: 1 },
            { question: '¿Qué ideología obrera organizada llegó a España durante el Sexenio Democrático?', options: ['El socialismo marxista institucionalizado', 'El anarquismo de la Primera Internacional', 'El sindicalismo cristiano'], correct: 1 },
            { question: '¿Qué pronunciamiento militar en 1874 restauró la monarquía borbónica?', options: ['El de Prim en Valencia', 'El de Martínez Campos en Sagunto', 'El de O\'Donnell en Vicálvaro'], correct: 1 }
          ],
          sources: [
            { title: 'Congreso de los Diputados — Historia constitucional', url: 'https://www.congreso.es' },
            { title: 'Real Academia de la Historia — Isabel II', url: 'https://dbe.rah.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 10 — La Restauración y el Desastre del 98
    // ─────────────────────────────────────────────
    {
      id: 'restauracion',
      num: 10,
      title: 'La Restauración y el Desastre del 98',
      icon: 'trending-down',
      description: 'Caciquismo, pérdida de colonias, Regeneracionismo, crisis de 1917 y Primo de Rivera.',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: La Restauración y el Desastre del 98',
        intro: 'Entre la estabilidad artificial y el colapso real. ¿Conoces este periodo crucial?',
        questions: [
          { question: '¿Qué sistema político ideó Cánovas del Castillo para garantizar la alternancia pacífica?', options: ['El sufragio universal masculino', 'El turno pacífico bipartidista', 'El presidencialismo republicano'], correct: 1 },
          { question: '¿Cómo se llamaba la práctica de falsificar elecciones en la Restauración?', options: ['El sufragismo', 'El caciquismo y el pucherazo', 'El turno dinástico'], correct: 1 },
          { question: '¿Qué colonias perdió España en 1898 tras la guerra con Estados Unidos?', options: ['Marruecos y Guinea', 'Cuba, Puerto Rico y Filipinas', 'Las Canarias y Ceuta'], correct: 1 },
          { question: '¿Qué generación de escritores reflexionó sobre el fracaso nacional tras el 98?', options: ['La Generación del 27', 'La Generación del 98', 'El Modernismo hispanoamericano'], correct: 1 },
          { question: '¿Qué corriente política post-98 pedía modernizar España desde sus raíces?', options: ['El carlismo renovado', 'El Regeneracionismo', 'El socialismo científico'], correct: 1 },
          { question: '¿Qué crisis social y militar estalló en España en 1917?', options: ['Una crisis de sucesión dinástica', 'Una triple crisis con huelga general, juntas militares y asamblea parlamentaria', 'Una guerra colonial en Marruecos'], correct: 1 },
          { question: '¿Qué general implantó una dictadura en España en 1923 con el beneplácito del rey?', options: ['Francisco Franco', 'Miguel Primo de Rivera', 'Mola Vidal'], correct: 1 },
          { question: '¿Qué acontecimiento en 1921 marcó un desastre militar en Marruecos?', options: ['La batalla del Barranco del Lobo', 'El Desastre de Annual', 'La caída de Melilla'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'restauracion-1',
          title: 'La Restauración: el sistema del turno',
          icon: 'repeat',
          blocks: [
            { type: 'p', text: 'Antonio Cánovas del Castillo diseñó el sistema de la Restauración (1874-1923): dos partidos dinásticos (Conservador y Liberal) se alternaban en el poder de forma pactada. Parecía estabilidad; en realidad era una democracia de fachada sostenida por el caciquismo: los caciques locales controlaban los votos, fabricaban resultados electorales ("pucherazo") y garantizaban que el partido de turno ganara siempre.' },
            { type: 'p', text: 'El sistema funcionó durante décadas. Alfonso XII (1874-1885) y la regente María Cristina estabilizaron el país. Pero excluía a socialistas, republicanos, nacionalistas catalanes, vascos y gallegos. Era una modernización sin democratización real.' },
            { type: 'tip', text: '💡 Práxedes Mateo Sagasta (Liberal) y Cánovas del Castillo (Conservador) fueron los dos "jefes de turno" que alternaron el poder. Cuando Cánovas fue asesinado por un anarquista en 1897, el sistema perdió a su principal arquitecto, justo antes del Desastre del 98.' }
          ],
          questions: [
            { question: '¿Qué político diseñó el sistema de la Restauración?', options: ['Sagasta', 'Cánovas del Castillo', 'Martínez Campos'], correct: 1 },
            { question: '¿Cómo se llamaba la práctica de manipular las elecciones en la Restauración?', options: ['El bipartidismo', 'El caciquismo y el pucherazo', 'El turno dinástico legal'], correct: 1 },
            { question: '¿Qué grupos políticos quedaban excluidos del sistema de la Restauración?', options: ['Solo los anarquistas violentos', 'Socialistas, republicanos y nacionalistas regionales', 'Los militares y la Iglesia'], correct: 1 },
            { question: '¿Qué monarca reinó durante la primera etapa de la Restauración?', options: ['Alfonso XIII', 'Alfonso XII', 'Isabel II'], correct: 1 },
            { question: '¿Cómo murió Cánovas del Castillo en 1897?', options: ['Por enfermedad', 'Asesinado por un anarquista', 'En un accidente de carruaje'], correct: 1 }
          ],
          sources: [
            { title: 'Real Academia de la Historia — Restauración', url: 'https://dbe.rah.es' },
            { title: 'Congreso de los Diputados — Historia', url: 'https://www.congreso.es' }
          ]
        },
        {
          id: 'restauracion-2',
          title: 'El Desastre del 98 y el Regeneracionismo',
          icon: 'ship-sinking',
          blocks: [
            { type: 'p', text: 'En 1898, España fue derrotada por Estados Unidos en una guerra relámpago. Cuba, Puerto Rico y Filipinas —los últimos restos del Imperio colonial— pasaron a manos norteamericanas. Fue un shock brutal para la sociedad española: la marina destruida, el ejército humillado, el prestigio hundido. Era el fin definitivo de España como potencia colonial.' },
            { type: 'p', text: 'La respuesta intelectual fue doble. La Generación del 98 —Unamuno, Azorín, Antonio Machado, Baroja, Valle-Inclán— reflexionó sobre el "problema de España": su atraso, su identidad, su fracaso. El Regeneracionismo, liderado por Joaquín Costa, pedía reformas concretas: educación, regadíos, modernización económica. Costa resumió su programa en la frase "escuela y despensa".' },
            { type: 'tip', text: '💡 Joaquín Costa, el gran regeneracionista, fue el primero en pedir "cerrar el sepulcro del Cid con doble llave": olvidar la épica imperial y mirar al futuro con pragmatismo. Una metáfora polémica que sigue siendo citada hoy en los debates sobre identidad española.' }
          ],
          questions: [
            { question: '¿Qué colonias perdió España en 1898 tras la guerra con Estados Unidos?', options: ['Marruecos, Guinea y Sahara', 'Cuba, Puerto Rico y Filipinas', 'Las Canarias, Ceuta y Melilla'], correct: 1 },
            { question: '¿Cómo se llamó el movimiento intelectual que reflexionó sobre el fracaso nacional tras el 98?', options: ['El Modernismo', 'La Generación del 98', 'El Krausismo'], correct: 1 },
            { question: '¿Qué frase resumía el programa regeneracionista de Joaquín Costa?', options: ['"Pan y trabajo"', '"Escuela y despensa"', '"Libertad e igualdad"'], correct: 1 },
            { question: '¿Cuál de estos escritores NO pertenece a la Generación del 98?', options: ['Miguel de Unamuno', 'Federico García Lorca', 'Antonio Machado'], correct: 1 },
            { question: '¿Qué imagen usó Costa para pedir que España olvidara su pasado imperial y mirara al futuro?', options: ['Apagar el fuego del Imperio', 'Cerrar el sepulcro del Cid con doble llave', 'Hundir la Armada Invencible definitivamente'], correct: 1 }
          ],
          sources: [
            { title: 'Biblioteca Virtual Miguel de Cervantes — Generación del 98', url: 'https://www.cervantesvirtual.com' },
            { title: 'Real Academia de la Historia — Joaquín Costa', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'restauracion-3',
          title: 'Crisis de 1917, Annual y la Dictadura de Primo de Rivera',
          icon: 'alert-triangle',
          blocks: [
            { type: 'p', text: 'El Regeneracionismo no cuajó en reformas reales. El sistema de la Restauración se fue agrietando. En 1917 estalló una triple crisis: las Juntas de Defensa (militares descontentos), una Asamblea de Parlamentarios catalanes que pedía autonomía, y una huelga general revolucionaria. El sistema sobrevivió, pero debilitado. En 1921, el Desastre de Annual en Marruecos —un ejército mal equipado y peor mandado fue masacrado por las tribus de Abd el-Krim— añadió una catástrofe militar al descrédito político.' },
            { type: 'p', text: 'En 1923, el general Miguel Primo de Rivera dio un golpe de Estado con el beneplácito del rey Alfonso XIII. Su dictadura (1923-1930) intentó modernizar la economía (carreteras, pantanos, exposiciones internacionales) pero suprimió los partidos, las libertades y la Constitución. Cuando la crisis económica de 1929 llegó a España, Primo cayó. La monarquía quedó tan desprestigiada que las elecciones municipales de abril de 1931 se convirtieron en un plebiscito: el rey se fue sin abdicar, y España proclamó la Segunda República.' },
            { type: 'tip', text: '💡 El Expediente Picasso —la investigación parlamentaria sobre el Desastre de Annual— amenazaba con implicar al propio rey Alfonso XIII. Muchos historiadores creen que ese fue el verdadero motivo por el que Alfonso XIII aceptó la dictadura de Primo: para frenar la investigación antes de que llegara a la corona.' }
          ],
          questions: [
            { question: '¿Qué tres crisis simultáneas sacudieron España en 1917?', options: ['Una guerra civil, una epidemia y una crisis financiera', 'Juntas militares, asamblea de parlamentarios y huelga general', 'Una crisis colonial, religiosa y dinástica'], correct: 1 },
            { question: '¿Qué desastre militar ocurrió en Marruecos en 1921?', options: ['La batalla del Barranco del Lobo', 'El Desastre de Annual', 'La caída del protectorado de Tetuán'], correct: 1 },
            { question: '¿En qué año dio Primo de Rivera su golpe de Estado?', options: ['1917', '1923', '1929'], correct: 1 },
            { question: '¿Por qué la dictadura de Primo de Rivera acabó en 1930?', options: ['Fue derrocado por un golpe militar', 'La crisis económica de 1929 y la pérdida de apoyos lo llevaron a dimitir', 'Murió en el cargo'], correct: 1 },
            { question: '¿Qué ocurrió tras la caída de Primo de Rivera con la monarquía de Alfonso XIII?', options: ['Alfonso XIII reformó la Constitución y convocó elecciones', 'Las elecciones municipales de 1931 mostraron tanto apoyo republicano que el rey se marchó', 'Hubo un nuevo golpe militar que restauró el orden'], correct: 1 }
          ],
          sources: [
            { title: 'Real Academia de la Historia — Primo de Rivera', url: 'https://dbe.rah.es' },
            { title: 'Biblioteca Nacional — Desastre de Annual', url: 'https://www.bne.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 11 — Segunda República y Guerra Civil
    // ─────────────────────────────────────────────
    {
      id: 'republica-guerra-civil',
      num: 11,
      title: 'Segunda República y Guerra Civil',
      icon: 'siren',
      description: 'Modernización democrática, polarización y el conflicto fratricida (1931-1939).',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Segunda República y Guerra Civil',
        intro: 'Uno de los periodos más complejos y dolorosos de la historia española.',
        questions: [
          { question: '¿En qué fecha se proclamó la Segunda República española?', options: ['14 de abril de 1931', '18 de julio de 1936', '1 de abril de 1939'], correct: 0 },
          { question: '¿Qué reformas impulsó la República en el "Bienio Reformista"?', options: ['Reforma militar, agraria, educativa y separación Iglesia-Estado', 'Reforma fiscal y supresión del ejército', 'Solo reforma educativa y electoral'], correct: 0 },
          { question: '¿Qué general encabezó el golpe militar de julio de 1936?', options: ['Franco, Mola y Sanjurjo actuaron juntos desde el inicio', 'Mola fue el organizador principal; Franco asumió el mando total tras la muerte de Sanjurjo', 'Solo Franco desde Canarias'], correct: 1 },
          { question: '¿Qué ciudad vasca fue bombardeada por la aviación nazi en 1937 y se hizo símbolo de la guerra?', options: ['Bilbao', 'Guernica', 'San Sebastián'], correct: 1 },
          { question: '¿Quién pintó el "Guernica" como respuesta al bombardeo?', options: ['Salvador Dalí', 'Joan Miró', 'Pablo Picasso'], correct: 2 },
          { question: '¿Qué potencias apoyaron a Franco durante la guerra?', options: ['Gran Bretaña y Francia', 'La Alemania nazi y la Italia fascista', 'La Unión Soviética y México'], correct: 1 },
          { question: '¿Quién apoyó a la República?', options: ['Las Brigadas Internacionales y la URSS', 'Francia y Gran Bretaña oficialmente', 'Estados Unidos y Portugal'], correct: 0 },
          { question: '¿Cuándo terminó la Guerra Civil española?', options: ['18 de julio de 1938', '1 de abril de 1939', '8 de mayo de 1945'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'republica-1',
          title: 'La Segunda República: reforma y esperanza',
          icon: 'sunrise',
          blocks: [
            { type: 'p', text: 'El 14 de abril de 1931, España amaneció republicana casi sin sangre. El rey se fue; la gente salió a la calle. La República llegó con una agenda ambiciosa: reforma agraria (tierra para los campesinos sin tierra), reforma militar (modernizar y republicanizar el ejército), educación laica y universal (miles de nuevas escuelas), estatutos de autonomía para Cataluña y el País Vasco, y separación Iglesia-Estado.' },
            { type: 'p', text: 'La Constitución de 1931 era la más avanzada de Europa: voto femenino, matrimonio civil, divorcio, libertad de culto. Pero las reformas eran tan profundas que crearon resistencia en todos los frentes: la derecha (nobleza, Iglesia, militares conservadores) las veía como revolución; la izquierda obrera las consideraba insuficientes.' },
            { type: 'tip', text: '💡 Clara Campoamor fue la diputada que defendió el voto femenino en el Parlamento en 1931 frente a una parte de sus compañeras republicanas que temían que las mujeres votaran a los partidos católicos. Ganó el debate: las mujeres votaron por primera vez en España en noviembre de 1933.' }
          ],
          questions: [
            { question: '¿Cuándo se proclamó la Segunda República española?', options: ['14 de abril de 1931', '12 de octubre de 1931', '28 de junio de 1931'], correct: 0 },
            { question: '¿Qué derechos reconoció la Constitución de 1931?', options: ['Solo el sufragio masculino', 'El voto femenino, el divorcio y la libertad de culto', 'El voto femenino pero no el divorcio'], correct: 1 },
            { question: '¿Quién lideró la defensa del voto femenino en el Parlamento republicano?', options: ['Victoria Kent', 'Clara Campoamor', 'Federica Montseny'], correct: 1 },
            { question: '¿Cuál fue una de las reformas más conflictivas de la República con la Iglesia?', options: ['La supresión del ejército', 'La separación Iglesia-Estado y la educación laica', 'La expropiación de todos los templos'], correct: 1 },
            { question: '¿En qué año votaron las mujeres por primera vez en España?', options: ['1931', '1933', '1936'], correct: 1 }
          ],
          sources: [
            { title: 'Congreso de los Diputados — Constitución de 1931', url: 'https://www.congreso.es' },
            { title: 'Real Academia de la Historia — Segunda República', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'republica-2',
          title: 'Polarización y el golpe de julio de 1936',
          icon: 'divide',
          blocks: [
            { type: 'p', text: 'Entre 1933 y 1936 la República vivió una espiral de radicalización. El "bienio negro" (1933-1935) con el gobierno de la derecha revirtió muchas reformas. La insurrección de octubre de 1934 en Asturias —aplastada por el ejército con el general Franco al frente— dejó miles de muertos y una herida profunda. En febrero de 1936 ganó las elecciones el Frente Popular (coalición de izquierdas).' },
            { type: 'p', text: 'El 17-18 de julio de 1936, un sector del ejército se sublevó contra la República desde Marruecos (Franco) y la Península (Mola). El golpe fracasó en Madrid, Barcelona y muchas ciudades, pero triunfó en zonas rurales. España quedó partida en dos: zona republicana y zona nacional. Comenzó la guerra.' },
            { type: 'tip', text: '💡 El asesinato del líder de la derecha José Calvo Sotelo el 13 de julio de 1936 (cuatro días antes del golpe) fue utilizado por los sublevados como justificación. En realidad, el golpe llevaba meses preparándose. El asesinato de Calvo Sotelo fue la chispa, no la causa.' }
          ],
          questions: [
            { question: '¿Qué fue el "bienio negro" (1933-1935)?', options: ['Dos años de guerra civil encubierta', 'Periodo de gobierno derechista que revirtió reformas republicanas', 'El periodo de mayor represión de la Inquisición'], correct: 1 },
            { question: '¿Qué insurrección de 1934 fue aplastada con gran violencia?', options: ['La de Cataluña en Barcelona', 'La de los mineros asturianos en octubre', 'La de los anarquistas en Valencia'], correct: 1 },
            { question: '¿Desde dónde inició Franco su sublevación el 17 de julio de 1936?', options: ['Desde Sevilla', 'Desde Marruecos', 'Desde Burgos'], correct: 1 },
            { question: '¿Por qué el golpe no triunfó completamente en los primeros días?', options: ['Porque el ejército era muy pequeño', 'Porque fracasó en Madrid, Barcelona y muchas ciudades importantes', 'Porque el gobierno lo supo con meses de antelación'], correct: 1 },
            { question: '¿Qué coalición ganó las elecciones de febrero de 1936?', options: ['La CEDA de la derecha', 'El Frente Popular de izquierdas', 'El Partido Republicano de centro'], correct: 1 }
          ],
          sources: [
            { title: 'Centro Documental de la Memoria Histórica', url: 'https://www.culturaydeporte.gob.es/archivos/cdmh' },
            { title: 'Real Academia de la Historia — Guerra Civil', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'republica-3',
          title: 'La Guerra Civil (1936-1939)',
          icon: 'bomb',
          blocks: [
            { type: 'p', text: 'La Guerra Civil fue un conflicto brutal que causó entre 300.000 y 500.000 muertos y abrió heridas que tardarían décadas en cicatrizar. Franco recibió apoyo decisivo de la Alemania nazi (Legión Cóndor) y la Italia fascista. La República recibió armas soviéticas y el apoyo voluntario de las Brigadas Internacionales (combatientes de 54 países). Francia y Gran Bretaña adoptaron una política de "no intervención" que en la práctica favoreció a Franco.' },
            { type: 'p', text: 'El bombardeo de Guernica (26 de abril de 1937) por la aviación alemana —para probar nuevas tácticas de terror sobre población civil— se convirtió en símbolo del horror de la guerra moderna. Picasso lo inmortalizó en su cuadro más famoso. El 1 de abril de 1939, Franco firmó el último parte de guerra: "La guerra ha terminado."' },
            { type: 'tip', text: '💡 Casi 500.000 españoles tuvieron que exiliarse al terminar la guerra: políticos, intelectuales, artistas, científicos. México y Francia fueron los principales destinos. Este exilio privó a España de una generación de talento durante décadas.' }
          ],
          questions: [
            { question: '¿Qué apoyo exterior recibió Franco durante la guerra?', options: ['La URSS y México', 'La Alemania nazi y la Italia fascista', 'Francia y Gran Bretaña'], correct: 1 },
            { question: '¿Qué fueron las Brigadas Internacionales?', options: ['Tropas alemanas e italianas que ayudaron a Franco', 'Voluntarios de 54 países que lucharon por la República', 'El ejército regular de la URSS enviado a España'], correct: 1 },
            { question: '¿Qué ciudad vasca fue bombardeada por la aviación nazi en 1937?', options: ['Bilbao', 'Guernica', 'Vitoria'], correct: 1 },
            { question: '¿Cuándo terminó oficialmente la Guerra Civil española?', options: ['18 de julio de 1938', '1 de abril de 1939', '8 de mayo de 1945'], correct: 1 },
            { question: '¿Cuántos españoles aproximadamente tuvieron que exiliarse al terminar la guerra?', options: ['Unos 50.000', 'Casi 500.000', 'Más de un millón'], correct: 1 }
          ],
          sources: [
            { title: 'Museo Reina Sofía — Guernica de Picasso', url: 'https://www.museoreinasofia.es' },
            { title: 'Centro Documental de la Memoria Histórica', url: 'https://www.culturaydeporte.gob.es/archivos/cdmh' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 12 — El Franquismo
    // ─────────────────────────────────────────────
    {
      id: 'franquismo',
      num: 12,
      title: 'El Franquismo',
      icon: 'lock',
      description: 'Dictadura, represión, autarquía, desarrollismo y la lenta apertura (1939-1975).',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: El Franquismo',
        intro: 'Casi cuarenta años de dictadura que marcaron a varias generaciones de españoles.',
        questions: [
          { question: '¿Cuántos años duró la dictadura de Franco?', options: ['25 años', '36 años', '45 años'], correct: 1 },
          { question: '¿Cómo se llamó la política económica autárquica de los años 40?', options: ['El Plan de Estabilización', 'La autarquía', 'El desarrollismo'], correct: 1 },
          { question: '¿Qué organismos tecnócratas vinculados al Opus Dei diseñaron los Planes de Desarrollo de los años 60?', options: ['Los falangistas del Movimiento', 'Los tecnócratas del Opus Dei', 'Los militares del Alto Estado Mayor'], correct: 1 },
          { question: '¿Qué organización vasca fundada en 1959 llevó a cabo atentados terroristas?', options: ['Terra Lliure', 'ETA', 'GRAPO'], correct: 1 },
          { question: '¿A quién designó Franco como su sucesor a título de Rey?', options: ['A su hijo biológico', 'Al príncipe Juan Carlos de Borbón', 'Al príncipe Alfonso de Borbón'], correct: 1 },
          { question: '¿En qué año España fue admitida en la ONU, rompiendo el aislamiento internacional?', options: ['1945', '1955', '1962'], correct: 1 },
          { question: '¿Qué fenómeno demográfico transformó España en los años 60?', options: ['Una gran natalidad rural', 'La emigración masiva a Europa y el éxodo rural interno', 'La llegada de inmigrantes latinoamericanos'], correct: 1 },
          { question: '¿Cuándo murió Francisco Franco?', options: ['1 de abril de 1939', '20 de noviembre de 1975', '15 de junio de 1977'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'franquismo-1',
          title: 'La posguerra: represión y autarquía',
          icon: 'skull',
          blocks: [
            { type: 'p', text: 'Los años 40 fueron los más duros. La represión franquista causó decenas de miles de ejecuciones tras la guerra (las cifras oscilan entre 30.000 y 150.000 fusilados en la posguerra según las fuentes). Cárceles abarrotadas, trabajos forzados, depuraciones en todos los ámbitos. La dictadura se apoyaba en el Ejército, la Iglesia y el partido único (Falange Española).' },
            { type: 'p', text: 'La política económica fue la autarquía: cierre al exterior, autosuficiencia forzada, racionamiento de alimentos. Fue un fracaso: España vivió hambre real en los años 40. El aislamiento internacional (España fue excluida de la ONU y del Plan Marshall) agravó la situación hasta que en 1955 fue admitida en la ONU.' },
            { type: 'tip', text: '💡 La cartilla de racionamiento, que limitaba la compra de alimentos básicos, se mantuvo en España hasta 1952 — siete años después del fin de la Segunda Guerra Mundial. El hambre de la posguerra marcó psicológicamente a toda una generación.' }
          ],
          questions: [
            { question: '¿En qué tres pilares se apoyaba la dictadura franquista?', options: ['La Iglesia, la nobleza y los industriales', 'El Ejército, la Iglesia y el partido único (Falange)', 'El Ejército, los banqueros y los tecnócratas'], correct: 1 },
            { question: '¿Cómo se llamó la política económica de cierre al exterior en los años 40?', options: ['El Plan de Estabilización', 'La autarquía', 'El desarrollismo'], correct: 1 },
            { question: '¿Cuándo fue admitida España en la ONU, rompiendo el aislamiento?', options: ['1945', '1955', '1960'], correct: 1 },
            { question: '¿Hasta qué año se mantuvo el racionamiento de alimentos en España?', options: ['1946', '1952', '1959'], correct: 1 },
            { question: '¿Por qué España fue excluida del Plan Marshall y de organismos internacionales?', options: ['Por su pobreza extrema', 'Por ser una dictadura que había apoyado al Eje durante la WWII', 'Por la deuda de la Guerra Civil'], correct: 1 }
          ],
          sources: [
            { title: 'Centro Documental de la Memoria Histórica', url: 'https://www.culturaydeporte.gob.es/archivos/cdmh' },
            { title: 'Real Academia de la Historia — Franquismo', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'franquismo-2',
          title: 'El desarrollismo de los años 60',
          icon: 'trending-up',
          blocks: [
            { type: 'p', text: 'A partir de 1959, con el Plan de Estabilización diseñado por los tecnócratas del Opus Dei (López Rodó, Ullastres), España abandonó la autarquía y abrió su economía. Los años 60 fueron el "milagro económico español": el PIB creció a tasas del 7% anual, llegaron el turismo masivo y la inversión extranjera, y España se llenó de coches (el SEAT 600) y televisiones.' },
            { type: 'p', text: 'Pero el desarrollo fue desigual y traumático: millones de españoles emigraron a Europa (Alemania, Francia, Suiza) o a las ciudades industriales del interior (Madrid, Bilbao, Barcelona). Los pueblos se vaciaron; las periferias urbanas se llenaron de barrios sin servicios. Y la oposición creció: universitarios, obreros, sacerdotes obreros y los primeros nacionalismos.' },
            { type: 'tip', text: '💡 El SEAT 600, fabricado en Barcelona desde 1957, se convirtió en el símbolo del desarrollismo español. Era el coche del "milagro": pequeño, asequible, el primero que muchas familias pudieron comprar. Hoy es un icono vintage.' }
          ],
          questions: [
            { question: '¿Qué plan económico de 1959 marcó el fin de la autarquía?', options: ['El Plan Marshall español', 'El Plan de Estabilización', 'El Plan de Desarrollo del Opus'], correct: 1 },
            { question: '¿Qué tasa de crecimiento anual del PIB alcanzó España en los años 60?', options: ['2% anual', '7% anual', '12% anual'], correct: 1 },
            { question: '¿Qué coche se convirtió en símbolo del desarrollismo español?', options: ['El Citroën 2CV', 'El SEAT 600', 'El Renault 4'], correct: 1 },
            { question: '¿A dónde emigraron millones de españoles durante los años 60?', options: ['A América Latina', 'A Europa (Alemania, Francia, Suiza) y a ciudades industriales españolas', 'A las colonias africanas'], correct: 1 },
            { question: '¿Qué nuevos focos de oposición al régimen surgieron en los años 60?', options: ['Solo partidos políticos clandestinos', 'Universitarios, obreros, sacerdotes obreros y movimientos nacionalistas', 'Solo el ejército descontento'], correct: 1 }
          ],
          sources: [
            { title: 'Museo de Historia de Madrid — Desarrollismo', url: 'https://www.madrid.es/museodehistoria' },
            { title: 'Real Academia de la Historia — Desarrollismo', url: 'https://dbe.rah.es' }
          ]
        },
        {
          id: 'franquismo-3',
          title: 'La oposición, ETA y el fin del régimen',
          icon: 'flag-off',
          blocks: [
            { type: 'p', text: 'En 1959 nació ETA (Euskadi Ta Askatasuna), organización nacionalista vasca que combinó la lucha cultural con el terrorismo. Su atentado más impactante fue el asesinato del almirante Carrero Blanco en diciembre de 1973 — sucesor designado de Franco — mediante una bomba que hizo volar su coche por encima de un edificio en Madrid.' },
            { type: 'p', text: 'Franco murió el 20 de noviembre de 1975, tras una agonía larga y mediáticamente gestionada. Antes había designado como sucesor al príncipe Juan Carlos de Borbón, nieto de Alfonso XIII, formado en la España franquista pero que sorprendería a todos. La España de Franco terminaba; la España democrática estaba a punto de nacer.' },
            { type: 'tip', text: '💡 Los últimos fusilamientos del régimen franquista fueron el 27 de septiembre de 1975, apenas dos meses antes de la muerte de Franco. Cinco personas fueron ejecutadas en medio de condenas internacionales masivas. Fue la última vez que se aplicó la pena de muerte en España.' }
          ],
          questions: [
            { question: '¿En qué año se fundó ETA?', options: ['1950', '1959', '1968'], correct: 1 },
            { question: '¿Cuál fue el atentado más impactante de ETA durante el franquismo?', options: ['El atentado en la calle Correo de Madrid', 'El asesinato del almirante Carrero Blanco en 1973', 'El asesinato del general Mola'], correct: 1 },
            { question: '¿Cuándo murió Franco?', options: ['1 de abril de 1969', '20 de noviembre de 1975', '15 de junio de 1977'], correct: 1 },
            { question: '¿A quién designó Franco como su sucesor?', options: ['A su yerno, el marqués de Villaverde', 'Al príncipe Juan Carlos de Borbón', 'Al almirante Carrero Blanco'], correct: 1 },
            { question: '¿Cuándo se produjeron los últimos fusilamientos del franquismo?', options: ['El 1 de abril de 1939', 'El 27 de septiembre de 1975', 'El 20 de noviembre de 1975'], correct: 1 }
          ],
          sources: [
            { title: 'Centro Documental de la Memoria Histórica', url: 'https://www.culturaydeporte.gob.es/archivos/cdmh' },
            { title: 'Fundación Francisco Franco', url: 'https://www.fnff.es' }
          ]
        }
      ]
    },

    // ─────────────────────────────────────────────
    // BLOQUE 13 — La Transición y Democracia Actual
    // ─────────────────────────────────────────────
    {
      id: 'transicion',
      num: 13,
      title: 'La Transición y Democracia Actual',
      icon: 'sunrise',
      description: 'De la dictadura a la democracia: la Constitución de 1978 y la España de hoy.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: La Transición y Democracia Actual',
        intro: 'El camino de España hacia la democracia y su lugar en el mundo actual.',
        questions: [
          { question: '¿En qué año se aprobó la Constitución española vigente?', options: ['1975', '1978', '1982'], correct: 1 },
          { question: '¿Quién fue el presidente del gobierno durante la redacción de la Constitución de 1978?', options: ['Manuel Fraga', 'Adolfo Suárez', 'Felipe González'], correct: 1 },
          { question: '¿Qué intento de golpe de Estado sacudió España el 23 de febrero de 1981?', options: ['El "Tejerazo"', 'La Operación Galaxia', 'El golpe de Milans del Bosch'], correct: 0 },
          { question: '¿En qué año ingresó España en la Comunidad Económica Europea (hoy UE)?', options: ['1978', '1982', '1986'], correct: 2 },
          { question: '¿Qué partido ganó las elecciones de 1982 con mayoría absoluta inaugurando la alternancia democrática?', options: ['Alianza Popular', 'El PSOE de Felipe González', 'UCD de Adolfo Suárez'], correct: 1 },
          { question: '¿Cuántas comunidades autónomas tiene España según la Constitución de 1978?', options: ['15', '17', '19'], correct: 1 },
          { question: '¿En qué año España acogió los Juegos Olímpicos de Barcelona y la Expo de Sevilla?', options: ['1988', '1992', '1996'], correct: 1 },
          { question: '¿Cuándo ingresó España en la OTAN?', options: ['1978', '1982', '1986'], correct: 1 }
        ]
      },
      lessons: [
        {
          id: 'transicion-1',
          title: 'La Transición: de la dictadura a la democracia',
          icon: 'arrow-right',
          blocks: [
            { type: 'p', text: 'La Transición española (1975-1982) es estudiada en todo el mundo como un modelo de cambio político pacífico. Juan Carlos I, inesperadamente, impulsó la democratización desde dentro del sistema. Nombró presidente del Gobierno a Adolfo Suárez —un hombre del régimen franquista— que maniobró con habilidad para desmantelar las instituciones franquistas y construir una democracia.' },
            { type: 'p', text: 'La Ley para la Reforma Política (1976) fue aprobada en referéndum con el 94% del voto favorable. Se legalizaron los partidos, incluido el Partido Comunista en abril de 1977 —una decisión que muchos consideraban imposible—. Las primeras elecciones libres se celebraron el 15 de junio de 1977. Los llamados "Pactos de la Moncloa" (1977) lograron que partidos de izquierda y derecha acordaran juntos las medidas económicas y políticas para estabilizar la democracia naciente.' },
            { type: 'tip', text: '💡 El rey Juan Carlos I legalizar el PCE (Partido Comunista) fue el momento más arriesgado de la Transición. El propio Adolfo Suárez dijo que aquella semana de Semana Santa de 1977 fue "la más difícil de su vida política". El ejército estaba furioso; el riesgo de golpe era real.' }
          ],
          questions: [
            { question: '¿A quién nombró Juan Carlos I como presidente del Gobierno para liderar la Transición?', options: ['Manuel Fraga', 'Adolfo Suárez', 'Felipe González'], correct: 1 },
            { question: '¿Qué ley de 1976 fue el instrumento jurídico de la Transición democrática?', options: ['La Ley Orgánica del Estado', 'La Ley para la Reforma Política', 'La Ley de Amnistía'], correct: 1 },
            { question: '¿Cuándo se celebraron las primeras elecciones democráticas en España?', options: ['20 de noviembre de 1975', '15 de junio de 1977', '6 de diciembre de 1978'], correct: 1 },
            { question: '¿Qué acordaron los Pactos de la Moncloa (1977)?', options: ['La distribución de territorios en comunidades autónomas', 'Medidas económicas y políticas de consenso entre partidos para estabilizar la democracia', 'La legalización de todos los partidos políticos'], correct: 1 },
            { question: '¿Por qué la legalización del PCE en 1977 fue un momento crítico de la Transición?', options: ['Porque el PCE era el partido más votado', 'Porque generó furia en sectores del ejército y ponía en riesgo un posible golpe', 'Porque estaba prohibido por la Constitución de 1978'], correct: 1 }
          ],
          sources: [
            { title: 'Congreso de los Diputados — La Transición', url: 'https://www.congreso.es/es/cem/transicion' },
            { title: 'Fundación Adolfo Suárez', url: 'https://www.fundacion-adolfusuarez.es' }
          ]
        },
        {
          id: 'transicion-2',
          title: 'La Constitución de 1978 y el 23-F',
          icon: 'file-text',
          blocks: [
            { type: 'p', text: 'La Constitución de 1978, aprobada en referéndum el 6 de diciembre por el 87,8% de los votantes, es el texto que rige España hoy. Fue redactada por los "padres de la Constitución", un grupo de siete ponentes que representaban el espectro político: de la derecha franquista reformista (Fraga) al comunista (Solé Tura), pasando por socialistas, centristas y nacionalistas.' },
            { type: 'p', text: 'El 23 de febrero de 1981, el teniente coronel Tejero asaltó el Congreso con la Guardia Civil mientras se votaba la investidura de Calvo Sotelo. Tanques en Valencia. España contuvo el aliento. El rey Juan Carlos I apareció de madrugada en televisión con uniforme militar: "La Corona no puede tolerar ninguna acción que pretenda interrumpir por la fuerza el proceso democrático." El golpe fracasó.' },
            { type: 'tip', text: '💡 La Constitución del 78 creó el Estado de las Autonomías: 17 comunidades autónomas con sus propios parlamentos y gobiernos. Es un modelo único en el mundo, a caballo entre el Estado federal (como Alemania) y el unitario (como Francia), que ha permitido a lenguas y culturas como el catalán, el vasco o el gallego florecer institucionalmente.' }
          ],
          questions: [
            { question: '¿Qué porcentaje de votos favorables obtuvo la Constitución de 1978 en referéndum?', options: ['62%', '87,8%', '94%'], correct: 1 },
            { question: '¿Cuántos "padres de la Constitución" redactaron el texto?', options: ['Cinco', 'Siete', 'Nueve'], correct: 1 },
            { question: '¿Qué ocurrió el 23 de febrero de 1981?', options: ['Se aprobó la Constitución en el Congreso', 'El teniente coronel Tejero asaltó el Congreso con la Guardia Civil', 'Se celebraron las primeras elecciones municipales'], correct: 1 },
            { question: '¿Cómo frenó Juan Carlos I el golpe del 23-F?', options: ['Declarando el estado de guerra', 'Apareciendo en televisión con uniforme militar rechazando el golpe', 'Negociando con los golpistas en secreto'], correct: 1 },
            { question: '¿Qué modelo territorial estableció la Constitución de 1978?', options: ['Un Estado federal como Alemania', 'Un Estado de las Autonomías con 17 comunidades', 'Un Estado unitario centralizado'], correct: 1 }
          ],
          sources: [
            { title: 'Constitución Española — Congreso de los Diputados', url: 'https://www.congreso.es/constitucion/ficheros/c78/cons_espa.pdf' },
            { title: 'Archivo del Congreso — 23-F', url: 'https://www.congreso.es' }
          ]
        },
        {
          id: 'transicion-3',
          title: 'España en el mundo: de 1982 a hoy',
          icon: 'globe',
          blocks: [
            { type: 'p', text: 'En 1982, el PSOE de Felipe González ganó las elecciones con mayoría absoluta — la primera alternancia democrática. España modernizó su economía, construyó el Estado del Bienestar (sanidad universal, educación gratuita hasta los 16 años), y en 1986 ingresó en la Comunidad Económica Europea. El año 1992 fue el año de la proyección global: los Juegos Olímpicos de Barcelona, la Expo de Sevilla y el Tren de Alta Velocidad (AVE) Madrid-Sevilla.' },
            { type: 'p', text: 'El siglo XXI trajo desafíos nuevos: el atentado islamista del 11-M (11 de marzo de 2004, 193 muertos en trenes de Madrid), la gran crisis económica de 2008-2013 (21% de paro), el debate sobre la independencia de Cataluña desde 2017, y la pandemia de 2020. España es hoy la cuarta economía de la zona euro, miembro fundador de la OTAN y uno de los países con mayor esperanza de vida del mundo.' },
            { type: 'tip', text: '💡 España tiene hoy el AVE (Alta Velocidad Española) más extenso de Europa y el segundo del mundo tras China. La red de alta velocidad conecta Madrid con casi todas las capitales de provincia y ha transformado la movilidad del país.' }
          ],
          questions: [
            { question: '¿En qué año ingresó España en la Comunidad Económica Europea?', options: ['1982', '1986', '1992'], correct: 1 },
            { question: '¿Qué tres grandes eventos internacionales celebró España en 1992?', options: ['Copa del Mundo, Expo y Nobel de Literatura', 'Juegos Olímpicos de Barcelona, Expo de Sevilla y el AVE Madrid-Sevilla', 'Entrada en la OTAN, la UE y los JJ.OO.'], correct: 1 },
            { question: '¿Qué atentado terrorista sacudió España el 11 de marzo de 2004?', options: ['El asesinato de Carrero Blanco', 'Los atentados islamistas en trenes de Madrid (11-M)', 'Un atentado de ETA en el aeropuerto de Barajas'], correct: 1 },
            { question: '¿Cuál fue la tasa de paro más alta que alcanzó España durante la crisis de 2008-2013?', options: ['Casi el 11%', 'Casi el 21%', 'Casi el 27%'], correct: 2 },
            { question: '¿Qué posición ocupa España en la economía de la zona euro?', options: ['Primera', 'Segunda', 'Cuarta'], correct: 2 }
          ],
          sources: [
            { title: 'Ministerio de Asuntos Exteriores — España en la UE', url: 'https://www.exteriores.gob.es' },
            { title: 'Instituto Nacional de Estadística', url: 'https://www.ine.es' }
          ]
        }
      ]
    }

  ]
};
