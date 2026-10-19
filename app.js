/* ¡Hola! Spanish Flash Cards
 * Two toddler games: Spanish words + English sight words.
 * - Built-in word audio is pre-generated with ElevenLabs at build time (no key in client).
 * - Custom (LLM-added) words live in localStorage and use the device voice
 *   (speechSynthesis), since no ElevenLabs audio exists for them.
 * - Flip cards: front = word only, back = picture (+ translation).
 */

const GAMES = {
  spanish: {
    title: "¡Hola! Spanish",
    lang: "es",
    speakColor: "green",
    hint: "tap the green button to hear it!",
    categories: {
      "Animals": [
        { word: "el perro",    sub: "the dog",    emoji: "🐶", slug: "perro" },
        { word: "el gato",     sub: "the cat",    emoji: "🐱", slug: "gato" },
        { word: "el pez",      sub: "the fish",   emoji: "🐟", slug: "pez" },
        { word: "el pájaro",   sub: "the bird",   emoji: "🐦", slug: "pajaro" },
        { word: "el caballo",  sub: "the horse",  emoji: "🐴", slug: "caballo" },
        { word: "la vaca",     sub: "the cow",    emoji: "🐄", slug: "vaca" },
        { word: "el conejo",   sub: "the rabbit", emoji: "🐰", slug: "conejo" },
        { word: "el pato",     sub: "the duck",   emoji: "🦆", slug: "pato" },
        { word: "el león",     sub: "the lion",     emoji: "🦁", slug: "leon" },
        { word: "el elefante", sub: "the elephant", emoji: "🐘", slug: "elefante" },
        { word: "el mono",     sub: "the monkey",   emoji: "🐵", slug: "mono" },
        { word: "la jirafa",   sub: "the giraffe",  emoji: "🦒", slug: "jirafa" },
        { word: "el oso",      sub: "the bear",     emoji: "🐻", slug: "oso" },
        { word: "la rana",     sub: "the frog",     emoji: "🐸", slug: "rana" },
        { word: "el cerdo",    sub: "the pig",      emoji: "🐷", slug: "cerdo" },
        { word: "la oveja",    sub: "the sheep",    emoji: "🐑", slug: "oveja" },
      ],
      "Food": [
        { word: "la manzana",  sub: "the apple",  emoji: "🍎", slug: "manzana" },
        { word: "el pan",      sub: "the bread",  emoji: "🍞", slug: "pan" },
        { word: "la leche",    sub: "the milk",   emoji: "🥛", slug: "leche" },
        { word: "el queso",    sub: "the cheese", emoji: "🧀", slug: "queso" },
        { word: "el huevo",    sub: "the egg",    emoji: "🥚", slug: "huevo" },
        { word: "la banana",   sub: "the banana", emoji: "🍌", slug: "banana" },
        { word: "el jugo",     sub: "the juice",  emoji: "🧃", slug: "jugo" },
        { word: "la fresa",    sub: "the strawberry", emoji: "🍓", slug: "fresa" },
      ],
      "Colors": [
        { word: "rojo",     sub: "red",    emoji: "❤️", slug: "rojo" },
        { word: "azul",     sub: "blue",   emoji: "💙", slug: "azul" },
        { word: "verde",    sub: "green",  emoji: "💚", slug: "verde" },
        { word: "amarillo", sub: "yellow", emoji: "💛", slug: "amarillo" },
        { word: "naranja",  sub: "orange", emoji: "🧡", slug: "naranja" },
        { word: "morado",   sub: "purple", emoji: "💜", slug: "morado" },
        { word: "rosa",     sub: "pink",   emoji: "🩷", slug: "rosa" },
        { word: "negro",    sub: "black",  emoji: "🖤", slug: "negro" },
      ],
      "Shapes": [
        { word: "el círculo",    sub: "the circle",   emoji: "🔵", slug: "circulo" },
        { word: "el cuadrado",   sub: "the square",   emoji: "🟦", slug: "cuadrado" },
        { word: "el triángulo",  sub: "the triangle", emoji: "🔺", slug: "triangulo" },
        { word: "la estrella",   sub: "the star",     emoji: "⭐", slug: "estrella" },
        { word: "el corazón",    sub: "the heart",    emoji: "❤️", slug: "corazon" },
        { word: "el rombo",      sub: "the diamond",  emoji: "🔶", slug: "rombo" },
        { word: "la luna",       sub: "the moon",     emoji: "🌙", slug: "luna" },
        { word: "la cruz",       sub: "the cross",    emoji: "➕", slug: "cruz" },
      ],
      "Nature": [
        { word: "el sol",       sub: "the sun",      emoji: "☀️", slug: "sol" },
        { word: "la nube",      sub: "the cloud",    emoji: "☁️", slug: "nube" },
        { word: "la lluvia",    sub: "the rain",     emoji: "🌧️", slug: "lluvia" },
        { word: "la nieve",     sub: "the snow",     emoji: "❄️", slug: "nieve" },
        { word: "el árbol",     sub: "the tree",     emoji: "🌳", slug: "arbol" },
        { word: "la flor",      sub: "the flower",   emoji: "🌸", slug: "flor" },
        { word: "la montaña",   sub: "the mountain", emoji: "⛰️", slug: "montana" },
        { word: "el mar",       sub: "the sea",      emoji: "🌊", slug: "mar" },
      ],
      "Kitchen": [
        { word: "el plato",     sub: "the plate",  emoji: "🍽️", slug: "plato" },
        { word: "el vaso",      sub: "the glass",  emoji: "🥃", slug: "vaso" },
        { word: "la taza",      sub: "the cup",    emoji: "☕", slug: "taza" },
        { word: "la cuchara",   sub: "the spoon",  emoji: "🥄", slug: "cuchara" },
        { word: "el tenedor",   sub: "the fork",   emoji: "🍴", slug: "tenedor" },
        { word: "el cuchillo",  sub: "the knife",  emoji: "🔪", slug: "cuchillo" },
        { word: "la olla",      sub: "the pot",    emoji: "🍲", slug: "olla" },
        { word: "la sartén",    sub: "the pan",    emoji: "🍳", slug: "sarten" },
      ],
      "Fruits": [
        { word: "la naranja",   sub: "the orange",     emoji: "🍊", slug: "naranja" },
        { word: "la sandía",    sub: "the watermelon", emoji: "🍉", slug: "sandia" },
        { word: "las uvas",     sub: "the grapes",     emoji: "🍇", slug: "uvas" },
        { word: "la piña",      sub: "the pineapple",  emoji: "🍍", slug: "pina" },
        { word: "la lima",      sub: "the lime",       emoji: "🍋‍🟩", slug: "lima" },
        { word: "la pera",      sub: "the pear",       emoji: "🍐", slug: "pera" },
        { word: "el melón",     sub: "the melon",      emoji: "🍈", slug: "melon" },
        { word: "la cereza",    sub: "the cherry",     emoji: "🍒", slug: "cereza" },
      ],
      "Veggies": [
        { word: "la zanahoria", sub: "the carrot",   emoji: "🥕", slug: "zanahoria" },
        { word: "el brócoli",   sub: "the broccoli", emoji: "🥦", slug: "brocoli" },
        { word: "el tomate",    sub: "the tomato",   emoji: "🍅", slug: "tomate" },
        { word: "el maíz",      sub: "the corn",     emoji: "🌽", slug: "maiz" },
        { word: "la papa",      sub: "the potato",   emoji: "🥔", slug: "papa" },
        { word: "la cebolla",   sub: "the onion",    emoji: "🧅", slug: "cebolla" },
        { word: "la lechuga",   sub: "the lettuce",  emoji: "🥬", slug: "lechuga" },
        { word: "el pepino",    sub: "the cucumber", emoji: "🥒", slug: "pepino" },
      ],
      "Places": [
        { word: "la biblioteca", sub: "the library",  emoji: "📚", slug: "biblioteca" },
        { word: "la playa",      sub: "the beach",    emoji: "🏖️", slug: "playa" },
        { word: "el parque",     sub: "the park",     emoji: "🛝", slug: "parque" },
        { word: "la escuela",    sub: "the school",   emoji: "🏫", slug: "escuela" },
        { word: "la tienda",     sub: "the store",    emoji: "🏬", slug: "tienda" },
        { word: "el hospital",   sub: "the hospital", emoji: "🏥", slug: "hospital" },
        { word: "la casa",       sub: "the house",    emoji: "🏠", slug: "casa" },
        { word: "el zoológico",  sub: "the zoo",      emoji: "🦒", slug: "zoologico" },
      ],
      "Family": [
        { word: "mamá",       sub: "mom",         emoji: "👩", slug: "mama" },
        { word: "papá",       sub: "dad",         emoji: "👨", slug: "papa-dad" },
        { word: "el bebé",    sub: "the baby",    emoji: "👶", slug: "bebe" },
        { word: "la abuela",  sub: "the grandma", emoji: "👵", slug: "abuela" },
        { word: "el abuelo",  sub: "the grandpa", emoji: "👴", slug: "abuelo" },
        { word: "el hermano", sub: "the brother", emoji: "👦", slug: "hermano" },
        { word: "la hermana", sub: "the sister",  emoji: "👧", slug: "hermana" },
        { word: "el tío",     sub: "the uncle",   emoji: "🧔", slug: "tio" },
      ],
      "Body": [
        { word: "la cabeza", sub: "the head",  emoji: "🗣️", slug: "cabeza" },
        { word: "el ojo",    sub: "the eye",   emoji: "👁️", slug: "ojo" },
        { word: "la oreja",  sub: "the ear",   emoji: "👂", slug: "oreja" },
        { word: "la nariz",  sub: "the nose",  emoji: "👃", slug: "nariz" },
        { word: "la boca",   sub: "the mouth", emoji: "👄", slug: "boca" },
        { word: "la mano",   sub: "the hand",  emoji: "✋", slug: "mano" },
        { word: "el pie",    sub: "the foot",  emoji: "🦶", slug: "pie" },
        { word: "el diente", sub: "the tooth", emoji: "🦷", slug: "diente" },
      ],
      "Vehicles": [
        { word: "el carro",      sub: "the car",     emoji: "🚗", slug: "carro" },
        { word: "el autobús",    sub: "the bus",     emoji: "🚌", slug: "autobus" },
        { word: "el tren",       sub: "the train",   emoji: "🚂", slug: "tren" },
        { word: "el avión",      sub: "the plane",   emoji: "✈️", slug: "avion" },
        { word: "el barco",      sub: "the boat",    emoji: "⛵", slug: "barco" },
        { word: "la bicicleta",  sub: "the bike",    emoji: "🚲", slug: "bicicleta" },
        { word: "el camión",     sub: "the truck",   emoji: "🚚", slug: "camion" },
        { word: "el cohete",     sub: "the rocket",  emoji: "🚀", slug: "cohete" },
      ],
      "Ocean Animals": [
        { word: "el tiburón",   sub: "the shark",     emoji: "🦈", slug: "tiburon" },
        { word: "la ballena",   sub: "the whale",     emoji: "🐳", slug: "ballena" },
        { word: "el pulpo",     sub: "the octopus",   emoji: "🐙", slug: "pulpo" },
        { word: "el cangrejo",  sub: "the crab",      emoji: "🦀", slug: "cangrejo" },
        { word: "la medusa",    sub: "the jellyfish", emoji: "🪼", slug: "medusa" },
        { word: "la foca",      sub: "the seal",      emoji: "🦭", slug: "foca" },
        { word: "el delfín",    sub: "the dolphin",   emoji: "🐬", slug: "delfin" },
        { word: "la tortuga",   sub: "the turtle",    emoji: "🐢", slug: "tortuga" },
      ],
      "Insects": [
        { word: "la mariposa",  sub: "the butterfly", emoji: "🦋", slug: "mariposa" },
        { word: "la abeja",     sub: "the bee",       emoji: "🐝", slug: "abeja" },
        { word: "la hormiga",   sub: "the ant",       emoji: "🐜", slug: "hormiga" },
        { word: "la mariquita", sub: "the ladybug",   emoji: "🐞", slug: "mariquita" },
        { word: "la araña",     sub: "the spider",    emoji: "🕷️", slug: "arana" },
        { word: "el gusano",    sub: "the worm",      emoji: "🐛", slug: "gusano" },
        { word: "el caracol",   sub: "the snail",     emoji: "🐌", slug: "caracol" },
        { word: "la mosca",     sub: "the fly",       emoji: "🪰", slug: "mosca" },
      ],
      "Birds": [
        { word: "el pingüino", sub: "the penguin",    emoji: "🐧", slug: "pinguino" },
        { word: "el flamenco", sub: "the flamingo",   emoji: "🦩", slug: "flamenco" },
        { word: "el loro",     sub: "the parrot",     emoji: "🦜", slug: "loro" },
        { word: "el pavo",     sub: "the turkey",     emoji: "🦃", slug: "pavo" },
        { word: "el gallo",    sub: "the rooster",    emoji: "🐓", slug: "gallo" },
        { word: "la gallina",  sub: "the hen",        emoji: "🐔", slug: "gallina" },
        { word: "el cisne",    sub: "the swan",       emoji: "🦢", slug: "cisne" },
        { word: "el águila",   sub: "the eagle",      emoji: "🦅", slug: "aguila" },
      ],
      "Clothes": [
        { word: "la camisa",      sub: "the shirt",    emoji: "👕", slug: "camisa" },
        { word: "los pantalones", sub: "the pants",    emoji: "👖", slug: "pantalones" },
        { word: "el vestido",     sub: "the dress",    emoji: "👗", slug: "vestido" },
        { word: "el calcetín",    sub: "the sock",     emoji: "🧦", slug: "calcetin" },
        { word: "el abrigo",      sub: "the coat",     emoji: "🧥", slug: "abrigo" },
        { word: "la bota",        sub: "the boot",     emoji: "👢", slug: "bota" },
        { word: "el guante",      sub: "the glove",    emoji: "🧤", slug: "guante" },
        { word: "la bufanda",      sub: "the scarf",    emoji: "🧣", slug: "bufanda" },
      ],
      "Toys": [
        { word: "el osito",        sub: "the teddy bear", emoji: "🧸", slug: "osito" },
        { word: "la muñeca",       sub: "the doll",       emoji: "🪆", slug: "muneca" },
        { word: "el bloque",       sub: "the block",      emoji: "🧱", slug: "bloque" },
        { word: "la patineta",     sub: "the skateboard", emoji: "🛹", slug: "patineta" },
        { word: "el tambor",       sub: "the drum",       emoji: "🥁", slug: "tambor" },
        { word: "el rompecabezas", sub: "the puzzle",     emoji: "🧩", slug: "rompecabezas" },
        { word: "la cometa",       sub: "the kite",       emoji: "🪁", slug: "cometa" },
        { word: "el robot",        sub: "the robot",      emoji: "🤖", slug: "robot" },
      ],
      "Emotions": [
        { word: "feliz",       sub: "happy",     emoji: "😀", slug: "feliz" },
        { word: "triste",      sub: "sad",       emoji: "😢", slug: "triste" },
        { word: "enojado",     sub: "angry",     emoji: "😠", slug: "enojado" },
        { word: "asustado",    sub: "scared",    emoji: "😱", slug: "asustado" },
        { word: "sorprendido", sub: "surprised", emoji: "😲", slug: "sorprendido" },
        { word: "cansado",     sub: "tired",     emoji: "😴", slug: "cansado" },
        { word: "enfermo",     sub: "sick",      emoji: "🤒", slug: "enfermo" },
        { word: "contento",    sub: "glad",      emoji: "😊", slug: "contento" },
      ],
    },
  },
  sight: {
    title: "Sight Words",
    lang: "en",
    speakColor: "orange",
    hint: "tap the orange button to hear it!",
    categories: {
      "Animals": [
        { word: "dog",   emoji: "🐶", slug: "dog" },
        { word: "cat",   emoji: "🐱", slug: "cat" },
        { word: "duck",  emoji: "🦆", slug: "duck" },
        { word: "fish",  emoji: "🐟", slug: "fish" },
        { word: "bird",  emoji: "🐦", slug: "bird" },
        { word: "pig",   emoji: "🐷", slug: "pig" },
        { word: "cow",   emoji: "🐄", slug: "cow" },
        { word: "horse", emoji: "🐴", slug: "horse" },
        { word: "frog",  emoji: "🐸", slug: "frog" },
        { word: "bear",  emoji: "🐻", slug: "bear" },
        { word: "lion",  emoji: "🦁", slug: "lion" },
        { word: "bee",   emoji: "🐝", slug: "bee" },
      ],
      "Food": [
        { word: "apple",  emoji: "🍎", slug: "apple" },
        { word: "milk",   emoji: "🥛", slug: "milk" },
        { word: "egg",    emoji: "🥚", slug: "egg" },
        { word: "bread",  emoji: "🍞", slug: "bread" },
        { word: "cheese", emoji: "🧀", slug: "cheese" },
        { word: "juice",  emoji: "🧃", slug: "juice" },
        { word: "banana", emoji: "🍌", slug: "banana" },
        { word: "cake",   emoji: "🍰", slug: "cake" },
        { word: "cookie", emoji: "🍪", slug: "cookie" },
        { word: "pizza",  emoji: "🍕", slug: "pizza" },
        { word: "rice",   emoji: "🍚", slug: "rice" },
        { word: "corn",   emoji: "🌽", slug: "corn" },
      ],
      "Things": [
        { word: "ball",  emoji: "⚽", slug: "ball" },
        { word: "book",  emoji: "📖", slug: "book" },
        { word: "car",   emoji: "🚗", slug: "car" },
        { word: "cup",   emoji: "🥤", slug: "cup" },
        { word: "hat",   emoji: "🎩", slug: "hat" },
        { word: "shoe",  emoji: "👟", slug: "shoe" },
        { word: "bed",   emoji: "🛏️", slug: "bed" },
        { word: "toy",   emoji: "🧸", slug: "toy" },
        { word: "sun",   emoji: "☀️", slug: "sun" },
        { word: "moon",  emoji: "🌙", slug: "moon" },
        { word: "star",  emoji: "⭐", slug: "star" },
        { word: "tree",  emoji: "🌳", slug: "tree" },
      ],
      "Colors": [
        { word: "red",     emoji: "🔴", slug: "red" },
        { word: "blue",    emoji: "🔵", slug: "blue" },
        { word: "green",   emoji: "🟢", slug: "green" },
        { word: "yellow",  emoji: "🟡", slug: "yellow" },
        { word: "orange",  emoji: "🟠", slug: "orange" },
        { word: "purple",  emoji: "🟣", slug: "purple" },
        { word: "pink",    emoji: "🩷", slug: "pink" },
        { word: "black",   emoji: "⚫", slug: "black" },
        { word: "white",   emoji: "⚪", slug: "white" },
        { word: "brown",   emoji: "🟤", slug: "brown" },
        { word: "gray",    emoji: "🩶", slug: "gray" },
        { word: "rainbow", emoji: "🌈", slug: "rainbow" },
      ],
      "Actions": [
        { word: "run",   emoji: "🏃", slug: "run" },
        { word: "jump",  emoji: "🤸", slug: "jump" },
        { word: "eat",   emoji: "😋", slug: "eat" },
        { word: "drink", emoji: "🥤", slug: "drink" },
        { word: "sleep", emoji: "😴", slug: "sleep" },
        { word: "play",  emoji: "🪀", slug: "play" },
        { word: "read",  emoji: "📕", slug: "read" },
        { word: "sing",  emoji: "🎤", slug: "sing" },
        { word: "dance", emoji: "💃", slug: "dance" },
        { word: "swim",  emoji: "🏊", slug: "swim" },
        { word: "walk",  emoji: "🚶", slug: "walk" },
        { word: "stop",  emoji: "🛑", slug: "stop" },
      ],
      "Clothes": [
        { word: "shirt",    emoji: "👕", slug: "shirt" },
        { word: "pants",    emoji: "👖", slug: "pants" },
        { word: "dress",    emoji: "👗", slug: "dress" },
        { word: "sock",     emoji: "🧦", slug: "sock" },
        { word: "coat",     emoji: "🧥", slug: "coat" },
        { word: "boot",     emoji: "🥾", slug: "boot" },
        { word: "glove",    emoji: "🧤", slug: "glove" },
        { word: "scarf",    emoji: "🧣", slug: "scarf" },
        { word: "shorts",   emoji: "🩳", slug: "shorts" },
        { word: "swimsuit", emoji: "🩱", slug: "swimsuit" },
        { word: "sandal",   emoji: "🩴", slug: "sandal" },
        { word: "cap",      emoji: "🧢", slug: "cap" },
      ],
      "Ocean": [
        { word: "whale",     emoji: "🐳", slug: "whale" },
        { word: "shark",     emoji: "🦈", slug: "shark" },
        { word: "octopus",   emoji: "🐙", slug: "octopus" },
        { word: "crab",      emoji: "🦀", slug: "crab" },
        { word: "seal",      emoji: "🦭", slug: "seal" },
        { word: "dolphin",   emoji: "🐬", slug: "dolphin" },
        { word: "turtle",    emoji: "🐢", slug: "turtle" },
        { word: "shell",     emoji: "🐚", slug: "shell" },
        { word: "coral",     emoji: "🪸", slug: "coral" },
        { word: "wave",      emoji: "🌊", slug: "wave" },
        { word: "boat",      emoji: "⛵", slug: "boat" },
        { word: "jellyfish", emoji: "🪼", slug: "jellyfish" },
      ],
      "Insects": [
        { word: "butterfly",   emoji: "🦋", slug: "butterfly" },
        { word: "caterpillar", emoji: "🐛", slug: "caterpillar" },
        { word: "ant",         emoji: "🐜", slug: "ant" },
        { word: "beetle",      emoji: "🪲", slug: "beetle" },
        { word: "ladybug",     emoji: "🐞", slug: "ladybug" },
        { word: "cricket",     emoji: "🦗", slug: "cricket" },
        { word: "spider",      emoji: "🕷️", slug: "spider" },
        { word: "mosquito",    emoji: "🦟", slug: "mosquito" },
        { word: "fly",         emoji: "🪰", slug: "fly" },
        { word: "worm",        emoji: "🪱", slug: "worm" },
        { word: "snail",       emoji: "🐌", slug: "snail" },
        { word: "scorpion",    emoji: "🦂", slug: "scorpion" },
      ],
      "Vehicles": [
        { word: "bus",       emoji: "🚌", slug: "bus" },
        { word: "train",     emoji: "🚂", slug: "train" },
        { word: "plane",     emoji: "✈️", slug: "plane" },
        { word: "ship",      emoji: "🚢", slug: "ship" },
        { word: "bike",      emoji: "🚲", slug: "bike" },
        { word: "truck",     emoji: "🚚", slug: "truck" },
        { word: "rocket",    emoji: "🚀", slug: "rocket" },
        { word: "van",       emoji: "🚐", slug: "van" },
        { word: "taxi",      emoji: "🚕", slug: "taxi" },
        { word: "tractor",   emoji: "🚜", slug: "tractor" },
        { word: "ambulance", emoji: "🚑", slug: "ambulance" },
        { word: "subway",    emoji: "🚇", slug: "subway" },
      ],
      "Jobs": [
        { word: "doctor",          emoji: "🩺", slug: "doctor" },
        { word: "teacher",         emoji: "🧑‍🏫", slug: "teacher" },
        { word: "chef",            emoji: "🧑‍🍳", slug: "chef" },
        { word: "farmer",          emoji: "🧑‍🌾", slug: "farmer" },
        { word: "artist",          emoji: "🎨", slug: "artist" },
        { word: "pilot",           emoji: "🧑‍✈️", slug: "pilot" },
        { word: "builder",         emoji: "👷", slug: "builder" },
        { word: "nurse",           emoji: "🧑‍⚕️", slug: "nurse" },
        { word: "police officer",  emoji: "👮", slug: "police-officer" },
        { word: "firefighter",     emoji: "🧑‍🚒", slug: "firefighter" },
        { word: "vet",             emoji: "🐾", slug: "vet" },
        { word: "mail carrier",    emoji: "📬", slug: "mail-carrier" },
      ],
      "Sports": [
        { word: "soccer",     emoji: "⚽", slug: "soccer" },
        { word: "baseball",   emoji: "⚾", slug: "baseball" },
        { word: "tennis",     emoji: "🎾", slug: "tennis" },
        { word: "basketball", emoji: "🏀", slug: "basketball" },
        { word: "football",   emoji: "🏈", slug: "football" },
        { word: "volleyball", emoji: "🏐", slug: "volleyball" },
        { word: "golf",       emoji: "⛳", slug: "golf" },
        { word: "hockey",     emoji: "🏒", slug: "hockey" },
        { word: "bowling",    emoji: "🎳", slug: "bowling" },
        { word: "karate",     emoji: "🥋", slug: "karate" },
        { word: "yoga",       emoji: "🧘", slug: "yoga" },
        { word: "skating",    emoji: "⛸️", slug: "skating" },
      ],
      "School": [
        { word: "pencil",   emoji: "✏️", slug: "pencil" },
        { word: "crayon",   emoji: "🖍️", slug: "crayon" },
        { word: "desk",     emoji: "🪑", slug: "desk" },
        { word: "student",  emoji: "🧑‍🎓", slug: "student" },
        { word: "backpack", emoji: "🎒", slug: "backpack" },
        { word: "scissors", emoji: "✂️", slug: "scissors" },
        { word: "ruler",    emoji: "📏", slug: "ruler" },
        { word: "notebook", emoji: "📓", slug: "notebook" },
        { word: "paint",    emoji: "🖌️", slug: "paint" },
        { word: "marker",   emoji: "🖊️", slug: "marker" },
        { word: "school",   emoji: "🏫", slug: "school" },
        { word: "computer", emoji: "💻", slug: "computer" },
      ],
      "Emotions": [
        { word: "happy",     emoji: "😊", slug: "happy" },
        { word: "sad",       emoji: "😢", slug: "sad" },
        { word: "angry",     emoji: "😠", slug: "angry" },
        { word: "scared",    emoji: "😨", slug: "scared" },
        { word: "surprised", emoji: "😲", slug: "surprised" },
        { word: "tired",     emoji: "🥱", slug: "tired" },
        { word: "sick",      emoji: "🤒", slug: "sick" },
        { word: "excited",   emoji: "🤩", slug: "excited" },
        { word: "shy",       emoji: "😳", slug: "shy" },
        { word: "proud",     emoji: "😤", slug: "proud" },
        { word: "calm",      emoji: "😌", slug: "calm" },
        { word: "silly",     emoji: "🤪", slug: "silly" },
      ],
    },
  },
};

const $ = (id) => document.getElementById(id);
const player = $("player");
const CUSTOM_KEY = "musa-custom-words";
const MAX_CUSTOM_WORDS = 200;

let state = {
  game: null,        // 'spanish' | 'sight'
  category: null,
  index: 0,
  stars: Number(localStorage.getItem("musa-stars") || 0),
  shuffled: null,    // shuffled copy of the active category's cards
  shuffledKey: null, // "game|category" the shuffle belongs to
};

/* ---------- shuffle ---------- */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- what's new ---------- */
const NEW_DAYS = 7;
// Dates (YYYY-MM-DD) content was added. The weekday cron job updates this map
// when it bakes in new categories/words; badges show while <= NEW_DAYS old.
const NEW_CONTENT = {
  categories: {
    spanish: {
      "Nature": "2026-10-04", "Kitchen": "2026-10-04", "Fruits": "2026-10-04",
      "Veggies": "2026-10-04", "Places": "2026-10-04",
      "Family": "2026-10-09", "Body": "2026-10-09",
      "Vehicles": "2026-10-12",
      "Ocean Animals": "2026-10-13",
      "Insects": "2026-10-13",
      "Birds": "2026-10-14",
      "Clothes": "2026-10-15",
      "Toys": "2026-10-16",
      "Emotions": "2026-10-19",
    },
    sight: { "Actions": "2026-10-09", "Clothes": "2026-10-09", "Ocean": "2026-10-12", "Insects": "2026-10-13", "Vehicles": "2026-10-13", "Jobs": "2026-10-14", "Sports": "2026-10-15", "School": "2026-10-16", "Emotions": "2026-10-19" },
  },
  words: {
    spanish: {
      "leon": "2026-10-04", "elefante": "2026-10-04", "mono": "2026-10-04",
      "jirafa": "2026-10-04", "oso": "2026-10-04", "rana": "2026-10-04",
      "cerdo": "2026-10-04", "oveja": "2026-10-04",
    },
    sight: {},
  },
};

function isNewDate(d) {
  if (!d) return false;
  const ageDays = (Date.now() - new Date(d + "T12:00:00Z").getTime()) / 864e5;
  return ageDays >= 0 && ageDays <= NEW_DAYS;
}

/* ---------- seen tracking: dismiss "new" once a category lap is done ---------- */
const SEEN_KEY = "musa-new-seen";
// shape: { cats: {"game|Category": "YYYY-MM-DD"}, words: {"game|slug": "YYYY-MM-DD"} }
// We store the dismissed NEW_CONTENT date; if content is later re-stamped with a
// NEWER date (fresh words baked in), the badge correctly reappears.
function loadSeen() {
  try {
    const s = JSON.parse(localStorage.getItem(SEEN_KEY)) || {};
    return { cats: s.cats || {}, words: s.words || {} };
  } catch {
    return { cats: {}, words: {} };
  }
}
function markCategorySeen(game, name) {
  if (!game || !name) return;
  const seen = loadSeen();
  const catDate = NEW_CONTENT.categories[game]?.[name];
  if (catDate) seen.cats[game + "|" + name] = catDate;
  const wmap = NEW_CONTENT.words[game] || {};
  (GAMES[game].categories[name] || []).forEach((c) => {
    if (wmap[c.slug]) seen.words[game + "|" + c.slug] = wmap[c.slug];
  });
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch {}
  renderWhatsNew();
  if (state.game === game) {
    renderTabs(Object.keys(GAMES[game].categories));
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.cat === name)
    );
  }
}

function categoryIsNew(game, name) {
  const seen = loadSeen();
  const catDate = NEW_CONTENT.categories[game]?.[name];
  if (isNewDate(catDate) && seen.cats[game + "|" + name] !== catDate) return true;
  const wmap = NEW_CONTENT.words[game] || {};
  return (GAMES[game].categories[name] || []).some(
    (c) => isNewDate(wmap[c.slug]) && seen.words[game + "|" + c.slug] !== wmap[c.slug]
  );
}
function wordIsNew(game, slug) {
  const d = (NEW_CONTENT.words[game] || {})[slug];
  return isNewDate(d) && loadSeen().words[game + "|" + slug] !== d;
}
function renderWhatsNew() {
  const el = $("whats-new");
  if (!el) return;
  const parts = [];
  for (const game of Object.keys(GAMES)) {
    const names = Object.keys(GAMES[game].categories).filter((n) => categoryIsNew(game, n));
    if (names.length) parts.push(`${GAMES[game].title}: ${names.join(", ")}`);
  }
  el.textContent = parts.length ? `✨ New this week — ${parts.join("  ·  ")}` : "";
  el.classList.toggle("hidden", !parts.length);
}

/* ---------- navigation ---------- */
document.querySelectorAll(".game-card").forEach((btn) =>
  btn.addEventListener("click", () => { stopAudio(); openGame(btn.dataset.game); })
);
$("back-btn").addEventListener("click", () => {
  stopAudio();
  const game = $("game");
  if (!game.classList.contains("picking")) {
    showPicker();              // card view → category picker
    return;
  }
  game.classList.add("hidden"); // picker → home
  $("home").classList.remove("hidden");
});

function openGame(key) {
  state.game = key;
  const game = GAMES[key];
  document.documentElement.lang = game.lang;
  $("game-title").textContent = game.title;
  $("hint").textContent = game.hint;
  $("speak-btn").className = "speak-btn " + game.speakColor;
  renderStars();
  renderTabs(Object.keys(game.categories));
  showPicker();               // browse categories first — no default deck
  $("home").classList.add("hidden");
  $("game").classList.remove("hidden");
}

function renderTabs(names) {
  const nav = $("tabs");
  nav.innerHTML = "";
  names.forEach((name) => {
    const b = document.createElement("button");
    b.className = "tab";
    b.dataset.cat = name;
    b.textContent = name;
    if (categoryIsNew(state.game, name)) {
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = "NEW";
      b.appendChild(badge);
    }
    b.addEventListener("click", () => selectCategory(name));
    nav.appendChild(b);
  });
}

/* ---------- category picker (browse-first) ---------- */
function renderCatPicker() {
  const grid = $("cat-grid");
  grid.innerHTML = "";
  const cats = GAMES[state.game].categories;
  Object.keys(cats).forEach((name) => {
    const cards = cats[name];
    const b = document.createElement("button");
    b.className = "cat-card";
    const emoji = document.createElement("span");
    emoji.className = "cat-card-emoji";
    emoji.textContent = (cards[0] && cards[0].emoji) || "✨";
    const label = document.createElement("strong");
    label.textContent = name;
    const count = document.createElement("small");
    count.textContent = `${cards.length} word${cards.length === 1 ? "" : "s"}`;
    b.append(emoji, label, count);
    if (categoryIsNew(state.game, name)) {
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = "NEW";
      b.appendChild(badge);
    }
    b.addEventListener("click", () => { stopAudio(); selectCategory(name); });
    grid.appendChild(b);
  });
}

function showPicker() {
  state.category = null;
  state.shuffled = null;
  renderCatPicker();
  $("game").classList.add("picking");
}

function selectCategory(name) {
  state.category = name;
  state.index = 0;
  state.shuffled = null;   // force a fresh shuffle in currentCards()
  $("game").classList.remove("picking");
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.cat === name)
  );
  showCard();
}

/* ---------- flip card ---------- */
function currentCards() {
  const src = GAMES[state.game].categories[state.category];
  const key = state.game + "|" + state.category;
  if (!state.shuffled || state.shuffledKey !== key || state.shuffled.length !== src.length) {
    state.shuffled = shuffle(src.slice());
    state.shuffledKey = key;
  }
  return state.shuffled;
}

function showCard() {
  const card = currentCards()[state.index];
  const isSpanish = state.game === "spanish";
  const fc = $("flashcard");
  fc.classList.remove("flipped");          // always land front-side up

  // Spanish: front = image + English word, back = Spanish word (the answer).
  // Sight words: front = English word, back = image (+ word for reinforcement).
  const frontEmoji = $("card-front-emoji");
  frontEmoji.style.display = isSpanish ? "" : "none";
  frontEmoji.textContent = card.emoji;
  $("card-word").textContent = isSpanish ? (card.sub || card.word) : card.word;

  const backEmoji = $("card-emoji");
  backEmoji.style.display = isSpanish ? "none" : "";
  backEmoji.textContent = card.emoji;
  const backWord = $("card-back-word");
  backWord.textContent = card.word;
  backWord.classList.toggle("card-word-small", !isSpanish);
  const sub = $("card-sub");
  sub.style.display = "none";

  const newChip = $("card-new");
  if (newChip) newChip.classList.toggle("hidden", !wordIsNew(state.game, card.slug));

  $("progress").textContent = `${state.index + 1} / ${currentCards().length}`;
  fc.classList.remove("deal");
  void fc.offsetWidth; // restart deal animation
  fc.classList.add("deal");
}

$("flashcard").addEventListener("click", () => {
  $("flashcard").classList.toggle("flipped");
  speak();   // flipping the card voices the word — no separate speak tap needed
});

$("next-btn").addEventListener("click", () => {
  addStar();
  const cards = currentCards();
  state.index = (state.index + 1) % cards.length;
  if (state.index === 0 && cards.length > 1) {
    state.shuffled = shuffle(cards.slice());  // reshuffle each lap
    markCategorySeen(state.game, state.category); // lap done → dismiss "new"
    celebrate();
  } else if (cards.length === 1) {
    markCategorySeen(state.game, state.category); // single-card category: viewed = gone through
  }
  showCard();
});

$("speak-btn").addEventListener("click", speak);

/* ---------- audio ---------- */
let fallbackFired = false;
// One word at a time: while audio is playing, extra taps of the speak button
// are ignored so the word always plays to completion before it can restart.
let speakLocked = false;

function setSpeakLocked(locked) {
  speakLocked = locked;
  const btn = $("speak-btn");
  if (btn) btn.classList.toggle("speaking", locked);
}

function stopAudio() {
  player.pause();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  setSpeakLocked(false);
}

function speak() {
  if (speakLocked) return;   // already talking — let the word finish
  const card = currentCards()[state.index];
  const lang = GAMES[state.game].lang;
  const src = `audio/${lang}-${card.slug}.mp3`;

  fallbackFired = false;
  const onFail = () => {
    if (fallbackFired) return;
    fallbackFired = true;
    synthFallback(card.word, lang);
  };
  setSpeakLocked(true);
  player.onended = () => setSpeakLocked(false);
  player.onerror = () => { setSpeakLocked(false); onFail(); };
  player.src = src;
  player.currentTime = 0;
  player.play().catch(onFail);
}

function synthFallback(text, lang) {
  if (!("speechSynthesis" in window)) { setSpeakLocked(false); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "es" ? "es-ES" : "en-US";
  u.rate = 0.85;
  u.onend = () => setSpeakLocked(false);
  u.onerror = () => setSpeakLocked(false);
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}


/* ---------- stars ---------- */
function renderStars() {
  $("star-count").textContent = state.stars;
}

function addStar() {
  state.stars += 1;
  localStorage.setItem("musa-stars", String(state.stars));
  renderStars();
  const el = document.querySelector(".stars");
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

/* ---------- celebration (own page) ---------- */
function celebrate() {
  $("celebrate-title").textContent = state.game === "spanish" ? "¡Muy bien!" : "Great job!";
  $("celebrate-sub").textContent = `You finished ${state.category}!`;
  $("celebrate-count").textContent = state.stars;
  $("celebrate").classList.remove("hidden");
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(
      state.game === "spanish" ? "¡Muy bien!" : "Great job!"
    );
    u.lang = state.game === "spanish" ? "es-ES" : "en-US";
    speechSynthesis.speak(u);
  }
}

$("celebrate-next").addEventListener("click", () => {
  $("celebrate").classList.add("hidden");
});

/* ============================================================
 * Add-more-words: LLM chat that expands categories/word counts.
 * The LLM key lives only in this browser's localStorage and is
 * sent only to the configured API base URL (Authorization header).
 * LLM-provided text is rendered exclusively via textContent.
 * ============================================================ */

function slugify(word) {
  return word
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")   // strip accents
    .replace(/^(el|la|los|las|un|una|the)\s+/, "") // strip leading article
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 32);
}

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || {}; }
  catch { return {}; }
}

function saveCustom(custom) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
}

function countCustom(custom) {
  let n = 0;
  for (const g of Object.values(custom))
    for (const cards of Object.values(g)) n += cards.length;
  return n;
}

/* Merge custom words into GAMES. Returns {added, skipped} counts.
 * Accepts shape { spanish: {Cat: [{word, sub?, emoji}]}, sight: {...} }
 * Limits: MAX_CUSTOM_WORDS enforced per word; reserved/prototype-chain
 * category names rejected; slugs deduped across the whole game (audio URLs
 * are slug-keyed, so a cross-category dup would collide). */
const RESERVED_NAMES = new Set(["__proto__", "constructor", "prototype", "hasOwnProperty", "toString", "valueOf"]);

function graphemes(s) {
  if (typeof Intl !== "undefined" && Intl.Segmenter)
    return [...new Intl.Segmenter().segment(s)].map((x) => x.segment);
  return [...s];
}

function slugInGame(gameKey, slug) {
  return Object.values(GAMES[gameKey].categories).some((cards) =>
    Array.isArray(cards) && cards.some((c) => c.slug === slug)
  );
}

function mergeWords(payload, custom) {
  let added = 0, skipped = 0;
  for (const gameKey of ["spanish", "sight"]) {
    const cats = payload[gameKey];
    if (!cats || typeof cats !== "object" || Array.isArray(cats)) continue;
    for (const [catName, words] of Object.entries(cats)) {
      if (!Array.isArray(words)) continue;
      const cleanCat = String(catName).slice(0, 24).trim();
      if (!cleanCat || RESERVED_NAMES.has(cleanCat)) { skipped += words.length; continue; }
      if (!Object.hasOwn(GAMES[gameKey].categories, cleanCat)) GAMES[gameKey].categories[cleanCat] = [];
      if (!Object.hasOwn(custom, gameKey)) custom[gameKey] = {};
      if (!Object.hasOwn(custom[gameKey], cleanCat)) custom[gameKey][cleanCat] = [];
      for (const w of words) {
        if (countCustom(custom) >= MAX_CUSTOM_WORDS) { skipped++; continue; }
        if (!w || typeof w.word !== "string" || typeof w.emoji !== "string") { skipped++; continue; }
        const word = w.word.trim().slice(0, 40);
        const emoji = graphemes(w.emoji.trim()).slice(0, 4).join("");
        const sub = typeof w.sub === "string" ? w.sub.trim().slice(0, 40) : undefined;
        const slug = slugify(word);
        if (!word || !emoji || !slug) { skipped++; continue; }
        if (slugInGame(gameKey, slug)) { skipped++; continue; }
        const card = gameKey === "spanish"
          ? { word, sub: sub || "", emoji, slug }
          : { word, emoji, slug };
        GAMES[gameKey].categories[cleanCat].push(card);
        custom[gameKey][cleanCat].push(gameKey === "spanish" ? { word, sub: card.sub, emoji } : { word, emoji });
        added++;
      }
      // an all-duplicate/invalid response must not leave an empty tab behind
      if (GAMES[gameKey].categories[cleanCat].length === 0) delete GAMES[gameKey].categories[cleanCat];
      if (custom[gameKey][cleanCat].length === 0) delete custom[gameKey][cleanCat];
    }
  }
  return { added, skipped };
}

/* Re-apply persisted custom words on load */
(function applyStoredCustom() {
  const stored = loadCustom();
  if (!stored || typeof stored !== "object") return;
  const fresh = {};
  mergeWords(stored, fresh); // rebuilds GAMES; 'fresh' mirrors stored (dedup vs built-ins)
  saveCustom(fresh);
})();
renderWhatsNew(); // after custom words merge, so home reflects final GAMES

/* ---------- sheet UI ---------- */
$("addwords-btn").addEventListener("click", () => {
  openSheet();
});
$("sheet-close").addEventListener("click", closeSheet);
$("sheet").addEventListener("click", (e) => { if (e.target === $("sheet")) closeSheet(); });

function openSheet() {
  const unlocked = !!sessionStorage.getItem("musa-pw");
  $("pw-gate").classList.toggle("hidden", unlocked);
  $("chat-ui").classList.toggle("hidden", !unlocked);
  $("pw-error").classList.add("hidden");
  $("pw-input").value = "";
  if (unlocked && !$("chat-log").children.length) {
    botSay('Tell me what words to add! For example:\n• "add 6 ocean animals in Spanish"\n• "add 8 more sight words about home"\n• "make a new Spanish category for family members"');
  }
  $("sheet").classList.remove("hidden");
}

function closeSheet() {
  $("sheet").classList.add("hidden");
  // if words were added while a game was open, refresh the tab bar / picker
  if (!$("game").classList.contains("hidden") && state.game) {
    renderTabs(Object.keys(GAMES[state.game].categories));
    if ($("game").classList.contains("picking")) {
      renderCatPicker();
    } else {
      document.querySelectorAll(".tab").forEach((t) =>
        t.classList.toggle("active", t.dataset.cat === state.category)
      );
    }
  }
}

function chatMsg(text, cls) {
  const div = document.createElement("div");
  div.className = "chat-msg " + cls;
  div.textContent = text;   // textContent only — LLM output is never injected as HTML
  $("chat-log").appendChild(div);
  $("chat-log").scrollTop = $("chat-log").scrollHeight;
  return div;
}
const botSay = (t) => chatMsg(t, "bot");

/* ---------- password gate (enforced server-side by /api/words) ---------- */
$("pw-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pw = $("pw-input").value;
  if (!pw) return;
  try {
    const res = await fetch("/api/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw, check: true }),
    });
    if (res.ok) {
      sessionStorage.setItem("musa-pw", pw);
      openSheet();
    } else {
      $("pw-error").classList.remove("hidden");
    }
  } catch {
    $("pw-error").textContent = "couldn't reach the server — try again";
    $("pw-error").classList.remove("hidden");
  }
});

$("lock-btn").addEventListener("click", () => {
  sessionStorage.removeItem("musa-pw");
  openSheet();
});

/* ---------- LLM chat (via /api/words — Kimi key stays server-side) ---------- */
$("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("chat-input");
  const text = input.value.trim();
  if (!text) return;
  const pw = sessionStorage.getItem("musa-pw");
  if (!pw) { openSheet(); return; }

  input.value = "";
  chatMsg(text, "user");
  const thinking = botSay("thinking… 🤔");

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 70000);
    const res = await fetch("/api/words", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw, message: text }),
    });
    clearTimeout(timer);
    if (res.status === 401) {
      sessionStorage.removeItem("musa-pw");
      thinking.remove();
      openSheet();
      $("pw-error").classList.remove("hidden");
      return;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `server error ${res.status}`);
    }
    const data = await res.json();
    const content = data.content || "";

    // tolerate the model wrapping JSON in prose or fences
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("The model didn't return JSON. Try rephrasing.");
    const payload = JSON.parse(match[0]);

    const custom = loadCustom();
    if (countCustom(custom) >= MAX_CUSTOM_WORDS) {
      thinking.remove();
      botSay(`You've hit the ${MAX_CUSTOM_WORDS}-word custom limit. Copy your words to Spock to bake them in, then reset.`);
      return;
    }
    const { added, skipped } = mergeWords(payload, custom);
    saveCustom(custom);
    thinking.remove();

    if (added === 0) {
      botSay(skipped > 0
        ? `Nothing new to add — ${skipped} word(s) were duplicates or invalid. Try a different theme!`
        : "I couldn't find any words in that reply. Try again?");
    } else {
      const names = [];
      for (const g of ["spanish", "sight"])
        for (const [cat, words] of Object.entries(payload[g] || {}))
          if (Array.isArray(words) && words.length) names.push(`${cat} (${GAMES[g].title})`);
      botSay(`Added ${added} new word(s) ✅${names.length ? "\nCategories: " + names.join(", ") : ""}${skipped ? `\n(${skipped} duplicates skipped)` : ""}\nThey use the device voice — copy them to Spock for ElevenLabs audio.`);
    }
  } catch (err) {
    thinking.remove();
    const msg = err.name === "AbortError"
      ? "The request timed out — the model is busy, try again."
      : `Couldn't add words: ${err.message}`;
    chatMsg(msg, "bot error");
  }
});

/* ---------- export / reset ---------- */
$("export-words").addEventListener("click", async () => {
  const custom = loadCustom();
  const json = JSON.stringify(custom, null, 2);
  if (countCustom(custom) === 0) { botSay("No custom words yet — ask me to add some first!"); return; }
  try {
    await navigator.clipboard.writeText(json);
    botSay("Copied! 📋 Paste it to Spock (or in the repo) to bake these words in with ElevenLabs audio.");
  } catch {
    botSay("Clipboard blocked. Here is your JSON — long-press to copy:\n" + json.slice(0, 1500));
  }
});

$("reset-words").addEventListener("click", () => {
  localStorage.removeItem(CUSTOM_KEY);
  botSay("Custom words cleared 🗑 Reloading…");
  setTimeout(() => location.reload(), 900);
});
