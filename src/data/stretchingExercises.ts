/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StretchExercise {
  name: string;
  steps: string[];
  cues: string[];
  breathing: string;
  duration: string;
  commonMistakes: string[];
  difficulty: 'Lehká' | 'Střední' | 'Pokročilá';
}

// Custom-tailored detailed physiotherapeutic exercises for muscles
export const CUSTOM_STRETCHING_EXERCISES: Record<string, StretchExercise> = {
  trapezius: {
    name: 'Úklon hlavy s dopomocí a depresí ramene',
    steps: [
      'Posaďte se vzpřímeně na židli nebo na podložku. Jednou rukou se uchopte pod sedákem nebo ji zatlačte dolů k zemi s otevřenou dlaní.',
      'Druhou ruku položte přes hlavu nad protilehlé ucho.',
      'S hlubokým pomalým výdechem ukloňte hlavu na stranu (k rameni ruky na hlavě). Horní ruka pouze lehce zatěžuje hlavu svou vahou – nikdy netahejte silou!',
      'Udržujte rameno protahované strany plně stlačené dolů (deprese lopatky).'
    ],
    cues: [
      'Ramena táhněte co nejdále od uší.',
      'Záda držte vzpřímená, neprohýbejte se v bedrové části.'
    ],
    breathing: 'Při návratu nádech, v pozici protažení hluboký dlouhý výdech s uvolněním napětí (PIR koncept).',
    duration: '30–45 sekund na každou stranu',
    commonMistakes: [
      'Tahání hlavy rukou trhavou silou',
      'Zvedání ramene protahované strany vzhůru',
      'Předklon či rotace trupu'
    ],
    difficulty: 'Lehká'
  },
  latissimus_dorsi: {
    name: 'Laterální protažení v kleče o oporu (Modlitba)',
    steps: [
      'Klekněte si před židli, stůl nebo gauč. Položte předloktí na hranu opory dlaněmi k sobě.',
      'Pomalu zaklánějte pánev dozadu nad paty, dokud neucítíte intenzivní tah po stranách hrudníku pod pažemi.',
      'Gesta: Zkuste mírně vyhrbit bederní páteř a zatlačit hrudník směrem k zemi pro maximální izolaci širokého svalu.'
    ],
    cues: [
      'Uvolněte ramena a dovolte hlavě volně klesnout mezi paže.',
      'Předloktí tlačte jemně dolů do podložky.'
    ],
    breathing: 'Dýchejte hluboko do spodních žeber, čímž sval ještě více rozepnete zevnitř s každým nádechem.',
    duration: '35–50 sekund ve stabilní poloze',
    commonMistakes: [
      'Přílišný průhyb v bederní páteři (lordotizace)',
      'Křečovité zatínání krčních svalů'
    ],
    difficulty: 'Střední'
  },
  sternocleidomastoid: {
    name: 'Cílený záklon s rotací a fixací klíční kosti',
    steps: [
      'Položte dlaně přes sebe těsně pod klíční kost na jedné straně a jemně zatlačte kůži a tkáň směrem dolů k hrudníku (tím sval fixujeme na začátku).',
      'Pomalu zakloňte hlavu a ukloňte ji na opačnou stranu, než kde máte ruce.',
      'Následně hlavu jemně otočte (rotace) směrem k fixovanému rameni, dokud neucítíte tah na přední/boční straně krku.'
    ],
    cues: [
      'Tlačte klíční kost a kůži konstantně dolů během celého cviku.',
      'Pohyb provádějte extrémně pomalu ze středu.'
    ],
    breathing: 'Klidné povrchové brániční dýchání, s důrazem na výdech.',
    duration: '20–30 sekund, provádět velmi citlivě',
    commonMistakes: [
      'Rychlý, nekontrolovaný záklon hlavy, který může způsobit motání hlavy',
      'Nedostatečné zafixování klíční kosti rukama'
    ],
    difficulty: 'Střední'
  },
  erector_spinae: {
    name: 'Kočičí hřbet s cíleným dýcháním do zad',
    steps: [
      'Přejděte na všechny čtyři (vzpor klečmo), dlaně pod rameny, kolena pod kyčlemi.',
      'S hlubokým výdechem zatlačte dlaně do podložky, vtáhněte břicho a obratel po obratli vyhrbte celou páteř vzhůru (především bederní a hrudní část).',
      'Bradu přitiskněte jemně k hrudníku a pánev podsazujte dopředu.'
    ],
    cues: [
      'Představte si, že chcete páteří vytlačit strop vzhůru.',
      'Lopatky roztáhněte co nejvíce do stran.'
    ],
    breathing: 'S hlubokým výdechem vyhrbte záda a úplně vyfoukněte vzduch z plic. V maximálním vyhrbení krátce setrvejte.',
    duration: '10–12 opakování v plynulém tempu dechu',
    commonMistakes: [
      'Krčení ramen k uším',
      'Prohýbání se dolů s nekontrolovaným záklonem hlavy (pokud je sval zkrácen)'
    ],
    difficulty: 'Lehká'
  },
  pectoralis_major: {
    name: 'Protažení prsních svalů u zdi / zárubně dveří',
    steps: [
      'Postavte se bokem k zárubni dveří nebo pevné zdi. Pokrčte loket předloktí do úhlu 90 stupňů a opřete o zeď.',
      'Udělejte mírný krok vpřed nohou blíže ke zdi.',
      'Pomalu otáčejte trup a hrudník směrem od zdi dopředu, dokud neucítíte příjemný tah v prsním svalu a předním rameni.'
    ],
    cues: [
      'Loket udržujte v úrovni ramene (nebo mírně výš pro dolní vlákna svalu).',
      'Rameno tlačte od ucha dolů a lopatku k páteři.'
    ],
    breathing: 'Dýchat plynule do hrudníku, v nejhlubším bodě výdechu sval plně uvolnit do protahované pozice.',
    duration: '30–40 sekund na každou stranu',
    commonMistakes: [
      'Předsouvání hlavy a ramene dopředu',
      'Rotace celé pánve bez izolace hrudního korzetu'
    ],
    difficulty: 'Lehká'
  },
  iliopsoas: {
    name: 'Nízký výpad na koleni (Low Lunge) s podsazením pánve',
    steps: [
      'Udělejte dlouhý krok vpřed (výpad), zadní koleno položte na měkkou podložku a nárt na zem.',
      'Zpevněte střed těla a **aktivně podsaďte pánev** (táhněte stydkou kost nahoru k pupíku). Bez tohoto podsazení se tah přenese do beder místo iliopsoasu!',
      'Pomalu posouvejte těžiště a kyčle vpřed a dolů, záda držte vzpřímená.'
    ],
    cues: [
      'Udržujte hýždě zadní nohy neustále mírně zatnuté (reciproční inhibice ohybače).',
      'Zádový korzet držte svisle, nezaklánějte se v bedrech.'
    ],
    breathing: 'Hluboký nádech, s výdechem klesat hlouběji do kyčle a uvolňovat přední stranu stehna.',
    duration: '40–50 sekund na každou stranu',
    commonMistakes: [
      'Velký záklon v zádech a prohnutí v bedrech za cenu ztráty podsazení pánve',
      'Přední koleno předbíhá špičku prstů u nohy'
    ],
    difficulty: 'Střední'
  },
  quadratus_lumborum: {
    name: 'Aktivní úklon trupu stranou v kleče (Brána / Parighasana)',
    steps: [
      'Klekněte si vzpřímeně. Jednu nohu natáhněte přímo do strany, chodidlo položte celou plochou na zem.',
      'Upažte svisle nahoru ruku na straně klečícího kolene.',
      'S hlubokým výdechem se ukloňte přes nataženou nohu, druhou ruku položte lehce na stehno natažené nohy.',
      'Protahovaná strana těla od kolene k prstům ruky tvoří jeden dlouhý oblouk.'
    ],
    cues: [
      'Hrudník držte plně otevřený dopředu, nezavírejte rameno dolů k zemi.',
      'Pánev neprotáčejte, obě kyčle směřují vpřed.'
    ],
    breathing: 'Směřujte nádech do nataženého boku a dolních žeber, čímž uvolníte hluboká bedra.',
    duration: '30–45 sekund na stranu',
    commonMistakes: [
      'Předklon a rotace trupu k podlaze namísto čistého úklonu v ose',
      'Sesouvání kyčlí dozadu'
    ],
    difficulty: 'Střední'
  },
  gluteus_maximus: {
    name: 'Poloviční holub (Half Pigeon) na zemi',
    steps: [
      'Začněte na všech čtyřech. Pravé koleno přisuňte k pravému zápěstí a chodidlo vytočte mírně doleva pod tělo.',
      'Levou nohu natáhněte rovně dozadu po podložce, boky držte vyrovnané rovnoběžně se zemí.',
      'Pomalu klesejte pánví dolů a opřete se o předloktí nebo položte hrudník až k podložce.'
    ],
    cues: [
      'Nepřeklápějte pánev na stranu pokrčené nohy, boky musí zůstat v jedné rovině.',
      'Uvolněte ramena a krk.'
    ],
    breathing: 'Dlouhé, hluboké výdechy pro postupné uvolnění hlubokého napětí v kyčelním kloubu.',
    duration: '45–60 sekund u každé nohy',
    commonMistakes: [
      'Křivé boky (naklápění se na protahované stehno)',
      'Ostrá bolest v koleni pokrčené nohy (v tom případě zmírněte úhel vytočení)'
    ],
    difficulty: 'Pokročilá'
  },
  piriformis: {
    name: 'Protahování hruškovitého svalu vleže (Číslice 4)',
    steps: [
      'Lehněte si na záda s pokrčenými koleny, chodidla na zemi.',
      'Položte pravý vnější kotník přes levé koleno (vytvoříte tvar číslice 4).',
      'Oběma rukama uchopte levé stehno zezadu pod kolenem a pomalu ho přitahujte k hrudníku.',
      'Měli byste cítit hluboký tah uprostřed pravé hýždě.'
    ],
    cues: [
      'Hlava a celá záda musí ležet uvolněně na podložce.',
      'Pravé koleno tlačte jemně aktivně směrem od těla.'
    ],
    breathing: 'Plynulý hluboký výdech při každém přitažení nohy blíže ke hrudníku.',
    duration: '35–45 sekund na každou stranu',
    commonMistakes: [
      'Zvedání hlavy a ramen z podložky s velkým napětím v šíji',
      'Zakulacování bederní páteře do vzduchu'
    ],
    difficulty: 'Lehká'
  },
  biceps_femoris: {
    name: 'Statické protažení hamstringů v polovičním kleku',
    steps: [
      'Klekněte si na jedno koleno, druhou nohu natáhněte rovně dopředu a patu opřete o zem, špička směřuje vzhůru.',
      'Položte ruce na boky, udržujte naprosto **rovná záda** (nepředklánějte se kulatě).',
      'S rovnou páteří překlápějte pánev z kyčlí směrem dopředu k natažené noze, jako byste chtěli pupík položit na stehno.'
    ],
    cues: [
      'Záda nesmí být ohnutá neboli kulatá – tah musí vycházet z překlopení pánve.',
      'Zadní kyčel držte přímo nad kolenem.'
    ],
    breathing: 'Provádějte dlouhý výdech s mírným poklesem břicha blíž k natažené noze.',
    duration: '30–45 sekund na nohu',
    commonMistakes: [
      'Zakulacení hrudní zadní části, čímž se tah v hamstringu úplně ztratí',
      'Krčení nataženého kolene'
    ],
    difficulty: 'Lehká'
  },
  triceps_surae: {
    name: 'Protažení lýtkového svalu ve stoji s oporou',
    steps: [
      'Postavte se čelem ke zdi ve vzdálenosti zhruba na délku paží a opřete se dlaněmi o zeď.',
      'Udělejte jednou nohou velký krok dozadu. Celé chodidlo zadní nohy (včetně paty!) musí zůstat pevně přitisknuté k zemi.',
      'Zadní nohu držte plně nataženou v koleni, přední koleno ohýbejte a posouvejte pánev vpřed ke zdi.'
    ],
    cues: [
      'Špička zadní nohy musí směřovat přesně dopředu, nevytáčejte ji ven.',
      'Patou zadní nohy aktivně tlačte do podlahy.'
    ],
    breathing: 'Klidný a pravidelný dech, s výdechem mírně zvětšovat náklon pánve dopředu.',
    duration: '30–45 sekund u každé dolní končetiny',
    commonMistakes: [
      'Zvedání zadní paty ze země',
      'Vytáčení zadní špičky do vnější strany'
    ],
    difficulty: 'Lehká'
  },
  rhomboideus_minor: {
    name: 'Protažení horních mezilopatkových svalů (m. rhomboideus minor)',
    steps: [
      'Posaďte se vzpřímeně nebo se postavte s mírným pokrčením v kolenou.',
      'Propleťte prsty obou rukou před sebou a otočte dlaně směrem od těla.',
      'S hlubokým výdechem předpažte paže na maximum, zakulaťte horní část zad a přitáhněte bradu k hrudníku.',
      'Vytlačujte mezilopatkovou oblast (výš u krku) co nejvíce dozadu.'
    ],
    cues: [
      'Vnímejte tah spíše v horní části zad mezi lopatkami pod krkem.',
      'Uvolněte šíji a nechte hlavu těžce klesnout dopředu.'
    ],
    breathing: 'Dýchejte s důrazem na plný výdech a s nádechem směřujte dech do horních zad.',
    duration: '30–40 sekund',
    commonMistakes: [
      'Zvedání ramen k uším (aktivace horního trapézu)',
      'Zakulaťování celých zad včetně beder'
    ],
    difficulty: 'Lehká'
  },
  rhomboideus_major: {
    name: 'Protažení velkého svalu rombického (m. rhomboideus major)',
    steps: [
      'Předpažte pravou ruku, ohněte ji v lokti nahoru do úhlu 90 stupňů a levou ruku propleťte pod ní (pozice orlích rukou z jógy - garudasana).',
      'Zkuste dlaně nebo hřbety rukou přitisknout k sobě.',
      'S výdechem tlačte lokty dopředu a jemně nahoru od hrudníku, čímž roztáhnete dolní část lopatek od sebe.',
      'Případně se chytněte v předklonu oběma rukama zespodu za stehna pod koleny a vyvěste celá záda nahoru.'
    ],
    cues: [
      'Soustřeďte se na odtlačování lopatek od páteře směrem ven.',
      'Uvědomte si pocit roztažení dolních úhlů lopatek.'
    ],
    breathing: 'Hluboký nádech přímo mezi lopatky rozepne sval zevnitř, výdech uvolní napětí.',
    duration: '35–45 sekund (vystřídat paže)',
    commonMistakes: [
      'Nedostatečné oddálení ramen od uší',
      'Záklon hlavy a napínání krčních svalů'
    ],
    difficulty: 'Střední'
  }
};

// Generates fallback structured stretching exercise details for any other muscle dynamically
export function getStretchingExerciseForMuscle(muscleId: string, customStretchingText: string): StretchExercise {
  if (CUSTOM_STRETCHING_EXERCISES[muscleId]) {
    return CUSTOM_STRETCHING_EXERCISES[muscleId];
  }

  // Parse the custom text from database to form a uniform clean card structure
  return {
    name: `Metodické protažení svalu`,
    steps: [
      customStretchingText,
      'Zaujměte klidnou stabilní polohu a zaměřte se na cílenou zónu zvýrazněného svalu.',
      'S hlubokým výdechem zvolna zvětšete rozsah pohybu a uvolněte protahované svalové snopce.'
    ],
    cues: [
      'Udržujte stabilní postoj a netrhejte tělem.',
      'Nesnažte se jít přes ostrou odporovou bolest.'
    ],
    breathing: 'Soustřeďte se na dlouhý, tichý výdech o délce 5–6 sekund v protahované fázi.',
    duration: '30–40 sekund',
    commonMistakes: [
      'Zadržování dechu během protažení',
      'Hmitání v krajní poloze'
    ],
    difficulty: 'Lehká'
  };
}
