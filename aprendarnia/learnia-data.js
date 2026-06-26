/** Contenido de la ruta Cultura Española — arte, tradiciones y vida cotidiana (sin duplicar Historia de España) */
const RUTA_ESPAÑOLA = {
  id: 'cultura-espanola',
  title: 'Cultura Española',
  flag: '🇪🇸',
  description: 'Arte, tradiciones, gastronomía, música y costumbres. Para la historia completa, usa la ruta Historia de España.',
  topics: [
    {
      id: 'territorio',
      num: 1,
      title: 'Territorio y lenguas',
      icon: 'map',
      description: 'Geografía, islas y la riqueza lingüística del país.',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1200&auto=format&fit=crop',
      exam: {
        title: 'Examen: Territorio y lenguas',
        intro: 'Repasa geografía y diversidad lingüística de España. Necesitas acertar todas las preguntas para certificar el tema.',
        questions: [
          {
            question: '¿Qué estrecho separa España de África en su punto más cercano?',
            options: ['El Bósforo', 'El estrecho de Gibraltar', 'El canal de la Mancha'],
            correct: 1
          },
          {
            question: '¿Con qué país comparte España frontera terrestre en la península?',
            options: ['Francia', 'Portugal', 'Marruecos'],
            correct: 1
          },
          {
            question: '¿Qué lengua cooficial se habla en Cataluña?',
            options: ['Gallego', 'Catalán', 'Euskera'],
            correct: 1
          },
          {
            question: '¿Cuántas comunidades autónomas tiene España hoy?',
            options: ['15', '17', '19'],
            correct: 1
          },
          {
            question: '¿Cuál de estas islas es española?',
            options: ['Sicilia', 'Las Canarias', 'Cerdeña'],
            correct: 1
          },
          {
            question: '¿Cómo se llama la gran llanura central de la península ibérica?',
            options: ['La Meseta', 'La Mancha', 'El Guadalquivir'],
            correct: 0
          }
        ]
      },
      lessons: [
        {
          id: 'territorio-1',
          title: 'España en el mapa',
          icon: 'map-pin',
          blocks: [
            { type: 'p', text: 'España ocupa la mayor parte de la Península Ibérica. Comparte frontera con Portugal y está muy cerca de África, separada por el estrecho de Gibraltar.' },
            { type: 'p', text: 'Es un país de contrastes: montañas como los Pirineos, la Meseta Central y más de 8.000 kilómetros de costa entre Cantábrico, Mediterráneo y Atlántico.' },
            { type: 'tip', text: '💡 España tiene dos ciudades en África (Ceuta y Melilla) y archipiélagos como Baleares y Canarias. Para el relato histórico completo, abre la ruta Historia de España en Mis rutas.' }
          ],
          questions: [
            {
              question: '¿Qué separa España de África en su punto más cercano?',
              options: ['El río Tajo', 'El estrecho de Gibraltar', 'Los Pirineos'],
              correct: 1
            },
            {
              question: '¿Con qué país comparte España frontera terrestre en la península?',
              options: ['Francia', 'Portugal', 'Marruecos'],
              correct: 1
            },
            {
              question: '¿Qué cordillera marca la frontera natural con Francia?',
              options: ['Los Pirineos', 'El Sistema Central', 'La Cordillera Cantábrica'],
              correct: 0
            },
            {
              question: '¿Cuál de estas islas es española?',
              options: ['Sicilia', 'Las Canarias', 'Cerdeña'],
              correct: 1
            },
            {
              question: '¿Cómo se llama la gran llanura central de la península ibérica?',
              options: ['La Meseta', 'La Mancha', 'El Ebro'],
              correct: 0
            }
          ],
          sources: [
            { title: 'Instituto Geográfico Nacional (IGN)', url: 'https://www.ign.es' },
            { title: 'Ministerio de Asuntos Exteriores — Ficha país España', url: 'https://www.exteriores.gob.es/es/PoliticaExterior/Paginas/FichaPais.aspx' }
          ]
        },
        {
          id: 'territorio-2',
          title: 'Lenguas de España',
          icon: 'languages',
          blocks: [
            { type: 'p', text: 'El castellano es la lengua oficial común, pero España es plurilingüe: en Galicia se habla gallego, en Cataluña y Baleares catalán, en Valencia valenciano, en el País Vasco euskera y en Asturias bable, entre otras.' },
            { type: 'p', text: 'Muchas señales, carteles y medios locales usan la lengua propia de cada territorio. Conviven sin problema con el español en la vida diaria.' },
            { type: 'tip', text: '💡 El euskera no tiene parentesco conocido con las lenguas indoeuropeas: es una de las lenguas más antiguas de Europa aún vivas.' }
          ],
          questions: [
            {
              question: '¿Qué lengua cooficial se habla en Galicia?',
              options: ['Catalán', 'Gallego', 'Valenciano'],
              correct: 1
            },
            {
              question: '¿En qué comunidad es lengua cooficial el euskera?',
              options: ['Navarra y País Vasco', 'Aragón', 'Extremadura'],
              correct: 0
            },
            {
              question: '¿Cuál es la lengua común oficial en todo el Estado?',
              options: ['Catalán', 'Castellano', 'Gallego'],
              correct: 1
            },
            {
              question: '¿Qué lengua destaca por no ser indoeuropea?',
              options: ['Gallego', 'Euskera', 'Castellano'],
              correct: 1
            },
            {
              question: '¿Dónde es habitual ver carteles bilingües en la calle?',
              options: ['Solo en Madrid', 'En comunidades con lengua propia', 'Solo en los aeropuertos'],
              correct: 1
            }
          ],
          sources: [
            { title: 'Instituto Cervantes — Lenguas de España', url: 'https://www.cervantes.es' },
            { title: 'Gobierno de España — Lenguas cooficiales', url: 'https://www.lamoncloa.gob.es' }
          ]
        },
        {
          id: 'territorio-3',
          title: 'Un país de autonomías',
          icon: 'layout-grid',
          blocks: [
            { type: 'p', text: 'España se organiza en 17 comunidades autónomas y 2 ciudades autónomas (Ceuta y Melilla). Cada territorio conserva tradiciones, fiestas, gastronomía y, en muchos casos, lengua propia.' },
            { type: 'p', text: 'Esa diversidad es parte del carácter español: no es un país uniforme, sino un mosaico de paisajes y culturas que comparten el mismo Estado.' },
            { type: 'tip', text: '💡 Andalucía, Cataluña, País Vasco o Galicia suenan a identidades muy distintas, pero todas forman parte del mismo país.' }
          ],
          questions: [
            {
              question: '¿Cuántas comunidades autónomas tiene España?',
              options: ['15', '17', '20'],
              correct: 1
            },
            {
              question: '¿Cómo se llaman los territorios españoles en el norte de África?',
              options: ['Provincias ultramarinas', 'Ciudades autónomas', 'Departamentos'],
              correct: 1
            },
            {
              question: '¿Qué describe mejor a España en clave cultural?',
              options: ['Un país sin diferencias regionales', 'Un mosaico de territorios con tradiciones propias', 'Un único estilo en todo el mapa'],
              correct: 1
            },
            {
              question: '¿Qué elementos suelen variar entre comunidades?',
              options: ['Solo el clima', 'Fiestas, gastronomía y lengua', 'Únicamente el horario escolar'],
              correct: 1
            },
            {
              question: 'Además de las comunidades autónomas, ¿qué territorios especiales tiene España?',
              options: ['2 ciudades autónomas', '3 provincias francesas', '5 repúblicas'],
              correct: 0
            }
          ],
          sources: [
            { title: 'Ministerio de la Presidencia — Administración territorial', url: 'https://www.mpr.gob.es' },
            { title: 'Instituto Nacional de Estadística — Comunidades autónomas', url: 'https://www.ine.es' }
          ]
        }
      ]
    },
    {
      id: 'arte',
      num: 2,
      title: 'Arte y Arquitectura',
      icon: 'palette',
      description: 'Un recorrido por el arte y la arquitectura española.',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1200&auto=format&fit=crop',
      lessons: [
        {
          id: 'arte-1',
          title: 'Introducción al arte español',
          icon: 'sparkles',
          blocks: [
            { type: 'p', text: 'España ha dado al mundo artistas de talla universal. En pintura destacan Velázquez, Goya y Picasso; en arquitectura, Gaudí; y en escultura, Chillida o Mariano Benlliure, entre muchos otros.' },
            { type: 'p', text: 'La mezcla de culturas —romana, visigoda, islámica, judía y cristiana— dejó un legado único visible en catedrales, mezquitas convertidas y palacios nazaríes.' },
            { type: 'tip', text: '💡 El Museo del Prado en Madrid y el Guggenheim en Bilbao son paradas imprescindibles para conocer el arte español.' }
          ],
          quiz: {
            question: '¿Qué pintor español creó "Guernica"?',
            options: ['Velázquez', 'Goya', 'Picasso'],
            correct: 2
          }
        },
        {
          id: 'arte-2',
          title: 'Gaudí y el modernismo',
          icon: 'building-2',
          blocks: [
            { type: 'p', text: 'Antoni Gaudí (1852-1926) es el arquitecto más famoso de Barcelona. Su estilo se inspira en la naturaleza: formas curvas, mosaicos de color y estructuras que parecen vivas.' },
            { type: 'p', text: 'La Sagrada Familia es su obra maestra y sigue en construcción. Otros iconos son el Parque Güell, la Casa Batlló y la Casa Milà, conocida como La Pedrera.' },
            { type: 'tip', text: '💡 Gaudí diseñó hasta los bancos del parque con ondas para que la lluvia escurriera y se recogiera en cisternas.' }
          ],
          quiz: {
            question: '¿En qué ciudad trabajó principalmente Gaudí?',
            options: ['Madrid', 'Sevilla', 'Barcelona'],
            correct: 2
          }
        },
        {
          id: 'arte-3',
          title: 'Velázquez y el Prado',
          icon: 'frame',
          blocks: [
            { type: 'p', text: 'Diego Velázquez pintó en el siglo XVII para la corte de Felipe IV. Sus cuadros captan la luz y la mirada humana como pocos: "Las Meninas" es una de las obras más estudiadas del mundo.' },
            { type: 'p', text: 'El Museo del Prado alberga esa obra junto a "El jardín de las delicias" del Bosco, los "Fusilamientos del 3 de mayo" de Goya y muchas obras maestras.' },
            { type: 'tip', text: '💡 Si visitas el Prado, busca también "La maja desnuda" de Goya, una de las pinturas más famosas de la historia del arte español.' }
          ],
          quiz: {
            question: '¿Cómo se llama la famosa obra de Velázquez con la infanta Margarita?',
            options: ['Las Meninas', 'La familia de Carlos IV', 'El quitasol'],
            correct: 0
          }
        }
      ]
    },
    {
      id: 'tradiciones',
      num: 3,
      title: 'Tradiciones y Fiestas',
      icon: 'party-popper',
      description: 'Las celebraciones más queridas del país.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
      lessons: [
        {
          id: 'tradiciones-1',
          title: 'Semana Santa',
          icon: 'church',
          blocks: [
            { type: 'p', text: 'La Semana Santa conmemora la Pasión de Cristo. En ciudades como Sevilla, Málaga o Zamora, procesiones enormes recorren las calles con pasos (andamios con imágenes religiosas) y nazarenos.' },
            { type: 'p', text: 'Las marchas procesionales, el silencio de la madrugada y el aroma a incienso crean una atmósfera muy emotiva, incluso para quien no sea religioso.' },
            { type: 'tip', text: '💡 El "saeta" es un cante flamenco que alguien canta desde un balcón cuando pasa la procesión.' }
          ],
          quiz: {
            question: '¿Cómo se llaman las estructuras con imágenes que llevan en procesión?',
            options: ['Pasos', 'Carrozas', 'Altares'],
            correct: 0
          }
        },
        {
          id: 'tradiciones-2',
          title: 'San Fermín y la Tomatina',
          icon: 'zap',
          blocks: [
            { type: 'p', text: 'Los Sanfermines de Pamplona (julio) son famosos por el encierro: toros que corren delante de valientes (o temerarios) por calles estrechas. La fiesta dura nueve días de música y alegría.' },
            { type: 'p', text: 'La Tomatina de Buñol (agosto) es otra fiesta única: miles de personas se lanzan tomates maduros durante una hora. Al final, las calles se limpian con agua.' },
            { type: 'tip', text: '💡 Ernest Hemingway popularizó los Sanfermines con su novela "Fiesta" (The Sun Also Rises).' }
          ],
          quiz: {
            question: '¿En qué ciudad se celebra la Tomatina?',
            options: ['Pamplona', 'Buñol', 'Valencia'],
            correct: 1
          }
        },
        {
          id: 'tradiciones-3',
          title: 'Feria de Abril',
          icon: 'flower-2',
          blocks: [
            { type: 'p', text: 'La Feria de Abril de Sevilla transforma un gran recinto en un pueblo de casetas con farolillos de colores. Se baila sevillanas, se come bien y se bebe fino (vino blanco con gas).' },
            { type: 'p', text: 'Las mujeres suelen llevar trajes de flamenca y los hombres traje corto. Es una fiesta alegre que dura casi una semana después de Semana Santa.' },
            { type: 'tip', text: '💡 Cada caseta es privada, pero hay casetas públicas donde cualquier visitante puede entrar a disfrutar.' }
          ],
          quiz: {
            question: '¿Qué baile típico se baila en la Feria de Abril?',
            options: ['Sardana', 'Sevillanas', 'Jota'],
            correct: 1
          }
        }
      ]
    },
    {
      id: 'gastronomia',
      num: 4,
      title: 'Gastronomía',
      icon: 'utensils',
      description: 'Platos típicos, ingredientes y costumbres.',
      image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?q=80&w=1200&auto=format&fit=crop',
      lessons: [
        {
          id: 'gastronomia-1',
          title: 'La paella valenciana',
          icon: 'cooking-pot',
          blocks: [
            { type: 'p', text: 'La paella nació en Valencia. La auténtica lleva pollo, conejo, judías verdes (ferraura), garrofón (judía grande) y azafrán o colorante, todo cocinado en una paella (sartén ancha).' },
            { type: 'p', text: 'Hay muchas variantes: marisco, verduras, mixta… pero los valencianos defienden con pasión la receta tradicional.' },
            { type: 'tip', text: '💡 El "socarrat" es la capa crujiente del fondo: para muchos, lo mejor del plato.' }
          ],
          quiz: {
            question: '¿De qué región es originaria la paella tradicional?',
            options: ['Andalucía', 'Valencia', 'Galicia'],
            correct: 1
          }
        },
        {
          id: 'gastronomia-2',
          title: 'Tapas y sobremesa',
          icon: 'wine',
          blocks: [
            { type: 'p', text: 'Las tapas son pequeñas raciones para compartir: tortilla, croquetas, jamón, pimientos de Padrón, boquerones… Se toman de pie en el bar o sentados, acompañadas de una caña (cerveza pequeña) o vino.' },
            { type: 'p', text: 'Después de comer viene la sobremesa: quedarse en la mesa charlando, con café o digestivo. No es prisa: es tiempo de familia y amigos.' },
            { type: 'tip', text: '💡 En León existe la tradición de la "tapa gratis" con la bebida; en otras ciudades se pagan aparte.' }
          ],
          quiz: {
            question: '¿Cómo se llama la costumbre de charlar tras la comida?',
            options: ['Siesta', 'Sobremesa', 'Merienda'],
            correct: 1
          }
        },
        {
          id: 'gastronomia-3',
          title: 'Jamón y aceite de oliva',
          icon: 'leaf',
          blocks: [
            { type: 'p', text: 'España es el mayor productor mundial de aceite de oliva. El virgen extra se usa en ensaladas, tostadas y casi todo. Jaén, en Andalucía, es el gran olivar del país.' },
            { type: 'p', text: 'El jamón ibérico de bellota —de cerdos que comen bellotas en la dehesa— es un manjar. Se corta en lonchas finísimas y se sirve a temperatura ambiente.' },
            { type: 'tip', text: '💡 Un pan con tomate rallado, aceite y sal ("pan tumaca") es el desayuno o cena más simple y delicioso.' }
          ],
          quiz: {
            question: '¿Qué alimentan a los cerdos ibéricos de bellota?',
            options: ['Maíz', 'Bellotas', 'Trigo'],
            correct: 1
          }
        }
      ]
    },
    {
      id: 'musica',
      num: 5,
      title: 'Música y Danza',
      icon: 'music',
      description: 'De lo tradicional a lo contemporáneo.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      lessons: [
        {
          id: 'musica-1',
          title: 'El flamenco',
          icon: 'flame',
          blocks: [
            { type: 'p', text: 'El flamenco nació en Andalucía, fruto del cruce de culturas. Une cante (voz), toque (guitarra) y baile en una expresión intensa de emoción.' },
            { type: 'p', text: 'Hay palos distintos: soleá, bulerías, alegrías, seguiriya… Cada uno tiene su ritmo y su sentimiento. En 2010 la UNESCO lo declaró Patrimonio Inmaterial de la Humanidad.' },
            { type: 'tip', text: '💡 Los "palmas" (aplausos rítmicos) y los "jaleos" (ánimos del público) forman parte esencial del espectáculo.' }
          ],
          quiz: {
            question: '¿De qué región es originario el flamenco?',
            options: ['Galicia', 'Andalucía', 'Asturias'],
            correct: 1
          }
        },
        {
          id: 'musica-2',
          title: 'La zarzuela',
          icon: 'theater',
          blocks: [
            { type: 'p', text: 'La zarzuela es el género lírico español: combina música, canto y teatro, a menudo con humor y escenas cotidianas. Surgió en el siglo XVII en los palacios reales.' },
            { type: 'p', text: 'Obras como "La verbena de la Paloma" o "Doña Francisquita" siguen representándose. Es la ópera popular de España.' },
            { type: 'tip', text: '💡 Se llama zarzuela por el Palacio de la Zarzuela, donde se representaban las primeras obras.' }
          ],
          quiz: {
            question: '¿Qué combina la zarzuela?',
            options: ['Solo danza', 'Música, canto y teatro', 'Poesía y pintura'],
            correct: 1
          }
        },
        {
          id: 'musica-3',
          title: 'Canciones que nos unen',
          icon: 'mic',
          blocks: [
            { type: 'p', text: 'España ha producido músicos internacionales: Paco de Lucía en guitarra, Rosalía mezclando flamenco y urbano, o grupos como Mecano y Estopa en pop-rock en castellano.' },
            { type: 'p', text: 'También hay canciones que casi todo el mundo conoce en fiestas: "YMCA" en verbenas, "Cielito lindo" en bodas, o villancicos en Navidad.' },
            { type: 'tip', text: '💡 La canción "Bamboleo" del Gipsy Kings popularizó el rumba flamenca en todo el mundo en los años 80.' }
          ],
          quiz: {
            question: '¿Qué artista fusiona flamenco con música urbana moderna?',
            options: ['Rosalía', 'Plácido Domingo', 'Camaron de la Isla'],
            correct: 0
          }
        }
      ]
    },
    {
      id: 'sociedad',
      num: 6,
      title: 'Sociedad y Costumbres',
      icon: 'users',
      description: 'La vida cotidiana y el carácter español.',
      image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop',
      lessons: [
        {
          id: 'sociedad-1',
          title: 'El ritmo del día',
          icon: 'clock',
          blocks: [
            { type: 'p', text: 'En España la comida principal suele ser a las dos o tres de la tarde, y la cena entre las nueve y las once. El desayuno es ligero: café con leche y tostada.' },
            { type: 'p', text: 'La siesta no es obligatoria, pero muchas pequeñas tiendas cierran de dos a cinco. Las grandes ciudades y centros comerciales suelen abrir sin interrupción.' },
            { type: 'tip', text: '💡 "¿Quedamos a las 8?" puede significar 8 de la tarde para un café o 8 de la noche para salir: ¡siempre conviene confirmar!' }
          ],
          quiz: {
            question: '¿A qué hora suelen cenar muchas familias españolas?',
            options: ['A las 6 de la tarde', 'Entre las 9 y las 11 de la noche', 'A medianoche'],
            correct: 1
          }
        },
        {
          id: 'sociedad-2',
          title: 'Familia y cercanía',
          icon: 'heart-handshake',
          blocks: [
            { type: 'p', text: 'La familia es muy importante. Es habitual reunirse los domingos para comer, celebrar cumpleaños o ayudarse entre generaciones.' },
            { type: 'p', text: 'Los españoles suelen ser cercanos al hablar: dos besos al saludar (uno en cada mejilla), hablar con las manos y un tono de voz animado no significan enfado, sino interés.' },
            { type: 'tip', text: '💡 El trato de "tú" es lo normal entre desconocidos en la calle; el "usted" se reserva para mayor respeto formal o con personas mayores en contextos muy protocolarios.' }
          ],
          quiz: {
            question: '¿Cuántos besos de saludo son habituales entre amigos?',
            options: ['Uno', 'Dos (uno por mejilla)', 'Tres'],
            correct: 1
          }
        },
        {
          id: 'sociedad-3',
          title: 'Fiestas del pueblo',
          icon: 'tent',
          blocks: [
            { type: 'p', text: 'Casi cada pueblo tiene sus fiestas patronales: verbenas con música, concursos, procesiones y comidas populares. Son el momento del año en que vuelve la gente que se fue a vivir a otras ciudades.' },
            { type: 'p', text: 'Las plazas se llenan de niños, las terrazas de conversación y el ambiente es de comunidad. Participar es la mejor forma de entender el alma local.' },
            { type: 'tip', text: '💡 En muchas fiestas hay "peñas": grupos de amigos que organizan comidas y actividades durante los días de celebración.' }
          ],
          quiz: {
            question: '¿Cómo se llaman los grupos de amigos que organizan actividades en fiestas locales?',
            options: ['Cuadrillas', 'Peñas', 'Hermandades'],
            correct: 1
          }
        }
      ]
    }
  ]
};
