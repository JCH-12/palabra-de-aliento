const versiculosPorAnimo = {
    triste: [
        { libro: "Salmos", cita: "Salmos 34:18", texto: "Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu."  },
        { libro: "Mateo", cita: "Mateo 5:4", texto: "Bienaventurados los que lloran, porque ellos recibirán consolación." },
        { libro: "Isaías", cita: "Isaías 41:10", texto: "No temas, porque yo estoy contigo; no desmayes, porque yo estoy con tu Dios que te esfuerzo..." },
    ],
    ansioso: [
        { libro: "Filipenses", cita: "Filipenses 4:6", texto: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego..." },
        { libro: "1 Pedro", cita: "1 Pedro 5:7", texto: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." },
        { libro: "Salmos", cita: "Salmos 94:19", texto: "En la multitud de mis pensamientos dentro de mí, tus consolaciones alegraban mi alma." }
    ],
    feliz: [
        { libro: "Salmos", cita: "Salmos 103:1", texto: "Alaba, alma mía, al Señor; alabe todo mi ser su santo nombre." },
        { libro: "Salmos", cita: "Salmos 118:24", texto: "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." },
        { libro: "Proverbios", cita: "Proverbios 15:13", texto: "El corazón alegre hermosea el rostro; mas por el dolor del corazón el espíritu se abate." }
    ],
    cansado: [
        { libro: "Mateo", cita: "Mateo 11:28", texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
        { libro: "Isaías", cita: "Isaías 40:29", texto: "Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas." }
    ],
    temeroso: [
        { libro: "Salmos", cita: "Salmos 91:1", texto: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente." },
        { libro: "Salmos", cita: "Salmos 56:3", texto: "En el día que temo, yo en ti confío." },
        { libro: "2 Timoteo", cita: "2 Timoteo 1:7", texto: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio." }
    ]
};

// Función principal que se activa al hacer clic en un estado de ánimo
function mostrarVersiculo(animo) {
    const lista = versiculosPorAnimo[animo];
    const boxVersiculo = document.getElementById('box-versiculo');
    const tituloAnimo = document.getElementById('titulo-animo');
    const contenedorLibros = document.getElementById('contenedor-libros-animo');
    const pantallaVersiculo = document.getElementById('pantalla-versiculo');
    const textoVersiculo = document.getElementById('texto-versiculo');
    const citaVersiculo = document.getElementById('cita-versiculo');

    if (!lista || !contenedorLibros || !boxVersiculo) return;

    // 1. Configurar título indicativo
    tituloAnimo.innerText = `Libros recomendados para cuando estás: ${animo}`;

    // 2. Limpiar el contenedor de libros anterior y ocultar versículos previos
    contenedorLibros.innerHTML = "";
    pantallaVersiculo.classList.add('hidden');
    textoVersiculo.innerText = "";
    citaVersiculo.innerText = "";

    // 3. Generar la botonera dinámica de libros recomendados
    lista.forEach((item) => {
        const boton = document.createElement('button');
        boton.className = "btn-libro-animo";
        boton.innerText = item.libro;

        // Evento al presionar el libro específico
        boton.onclick = function() {
            textoVersiculo.innerText = `"${item.texto}"`;
            citaVersiculo.innerText = `- ${item.cita}`;
            pantallaVersiculo.classList.remove('hidden'); // Mostrar el texto sagrado
        };

        contenedorLibros.appendChild(boton);
    });

    // 4. Mostrar bloque global y desplazar la ventana elegantemente
    boxVersiculo.classList.remove('hidden');
    boxVersiculo.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 2. BASE DE DATOS DE LOS 66 LIBROS (Mapeo de la Biblia)
// ==========================================
const infoLibros = {
    "GEN": { nombre: "Génesis", caps: 50, apiKey: "Genesis" },
    "EXO": { nombre: "Éxodo", caps: 40, apiKey: "Exodus" },
    "LEV": { nombre: "Levítico", caps: 27, apiKey: "Leviticus" },
    "NUM": { nombre: "Números", caps: 36, apiKey: "Numbers" },
    "DEU": { nombre: "Deuteronomio", caps: 34, apiKey: "Deuteronomy" },
    "JOS": { nombre: "Josué", caps: 24, apiKey: "Joshua" },
    "JDG": { nombre: "Jueces", caps: 21, apiKey: "Judges" },
    "RUT": { nombre: "Rut", caps: 4, apiKey: "Ruth" },
    "1SA": { nombre: "1 Samuel", caps: 31, apiKey: "1 Samuel" },
    "2SA": { nombre: "2 Samuel", caps: 24, apiKey: "2 Samuel" },
    "1KI": { nombre: "1 Reyes", caps: 22, apiKey: "1 Kings" },
    "2KI": { nombre: "2 Reyes", caps: 25, apiKey: "2 Kings" },
    "1CH": { nombre: "1 Crónicas", caps: 29, apiKey: "1 Chronicles" },
    "2CH": { nombre: "2 Crónicas", caps: 36, apiKey: "2 Chronicles" },
    "EZR": { nombre: "Esdras", caps: 10, apiKey: "Ezra" },
    "NEH": { nombre: "Nehemías", caps: 13, apiKey: "Nehemiah" },
    "EST": { nombre: "Ester", caps: 10, apiKey: "Esther" },
    "JOB": { nombre: "Job", caps: 42, apiKey: "Job" },
    "PSA": { nombre: "Salmos", caps: 150, apiKey: "Psalms" },
    "PRO": { nombre: "Proverbios", caps: 31, apiKey: "Proverbs" },
    "ECC": { nombre: "Eclesiastés", caps: 12, apiKey: "Ecclesiastes" },
    "SNG": { nombre: "Cantares", caps: 8, apiKey: "Song of Solomon" },
    "ISA": { nombre: "Isaías", caps: 66, apiKey: "Isaiah" },
    "JER": { nombre: "Jeremías", caps: 52, apiKey: "Jeremiah" },
    "LAM": { module: "Lamentaciones", caps: 5, apiKey: "Lamentations" },
    "EZK": { nombre: "Ezequiel", caps: 48, apiKey: "Ezekiel" },
    "DAN": { nombre: "Daniel", caps: 12, apiKey: "Daniel" },
    "HOS": { nombre: "Oseas", caps: 14, apiKey: "Hosea" },
    "JOL": { nombre: "Joel", caps: 3, apiKey: "Joel" },
    "AMO": { nombre: "Amós", caps: 9, apiKey: "Amos" },
    "OBA": { nombre: "Abdías", caps: 1, apiKey: "Obadiah" },
    "JON": { nombre: "Jonás", caps: 4, apiKey: "Jonah" },
    "MIC": { nombre: "Miqueas", caps: 7, apiKey: "Micah" },
    "NAM": { nombre: "Nahúm", caps: 3, apiKey: "Nahum" },
    "HAB": { nombre: "Habacuc", caps: 3, apiKey: "Habakkuk" },
    "ZEP": { nombre: "Sofonías", caps: 3, apiKey: "Zephaniah" },
    "HAG": { nombre: "Hageo", caps: 2, apiKey: "Haggai" },
    "ZEC": { nombre: "Zacarías", caps: 14, apiKey: "Zechariah" },
    "MAL": { nombre: "Malaquías", caps: 4, apiKey: "Malachi" },
    "MAT": { nombre: "Mateo", caps: 28, apiKey: "Matthew" },
    "MRK": { nombre: "Marcos", caps: 16, apiKey: "Mark" },
    "LUK": { nombre: "Lucas", caps: 24, apiKey: "Luke" },
    "JHN": { nombre: "Juan", caps: 21, apiKey: "John" },
    "ACT": { nombre: "Hechos", caps: 28, apiKey: "Acts" },
    "ROM": { nombre: "Romanos", caps: 16, apiKey: "Romans" },
    "1CO": { nombre: "1 Corintios", caps: 16, apiKey: "1 Corinthians" },
    "2CO": { nombre: "2 Corintios", caps: 13, apiKey: "2 Corinthians" },
    "GAL": { nombre: "Gálatas", caps: 6, apiKey: "Galatians" },
    "EPH": { nombre: "Efesios", caps: 6, apiKey: "Ephesians" },
    "PHP": { nombre: "Filipenses", caps: 4, apiKey: "Philippians" },
    "COL": { nombre: "Colosenses", caps: 4, apiKey: "Colossians" },
    "1TH": { nombre: "1 Tesalonicenses", caps: 5, apiKey: "1 Thessalonians" },
    "2TH": { nombre: "2 Tesalonicenses", caps: 3, apiKey: "2 Thessalonians" },
    "1TI": { nombre: "1 Timoteo", caps: 6, apiKey: "1 Timothy" },
    "2TI": { nombre: "2 Timoteo", caps: 4, apiKey: "2 Timothy" },
    "TIT": { nombre: "Tito", caps: 3, apiKey: "Titus" },
    "PHM": { nombre: "Filemón", caps: 1, apiKey: "Philemon" },
    "HEB": { nombre: "Hebreos", caps: 13, apiKey: "Hebrews" },
    "JAS": { nombre: "Santiago", caps: 5, apiKey: "James" },
    "1PE": { nombre: "1 Pedro", caps: 5, apiKey: "1 Peter" },
    "2PE": { nombre: "2 Pedro", caps: 3, apiKey: "2 Peter" },
    "1JN": { nombre: "1 Juan", caps: 5, apiKey: "1 John" },
    "2JN": { nombre: "2 Juan", caps: 1, apiKey: "2 John" },
    "3JN": { nombre: "3 Juan", caps: 1, apiKey: "3 John" },
    "JUD": { nombre: "Judas", caps: 1, apiKey: "Jude" },
    "REV": { nombre: "Apocalipsis", caps: 22, apiKey: "Revelation" }
};

// ==========================================
// 3. CONTROL DEL LECTOR BÍBLICO ONLINE
// ==========================================

function inicializarLibros() {
    const selectLibro = document.getElementById('select-libro');
    if (!selectLibro) return;

    selectLibro.innerHTML = ""; 

    Object.keys(infoLibros).forEach((clave) => {
        const option = document.createElement('option');
        option.value = clave; 
        option.text = infoLibros[clave].nombre || infoLibros[clave].module; 
        selectLibro.appendChild(option);
    });

    selectLibro.value = "GEN";
    actualizarCapitulos();
}

function actualizarCapitulos() {
    const selectLibro = document.getElementById('select-libro');
    const selectCap = document.getElementById('select-capitulo');
    
    if (!selectLibro || !selectCap) return;

    const libroClave = selectLibro.value;
    if (!libroClave || !infoLibros[libroClave]) return;

    selectCap.innerHTML = ""; 
    const totalCapitulos = infoLibros[libroClave].caps;

    for (let i = 1; i <= totalCapitulos; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = `Capítulo ${i}`;
        selectCap.appendChild(option);
    }
    
    selectCap.value = 1;
    cargarCapitulo(); 
}

async function cargarCapitulo() {
    const selectLibro = document.getElementById('select-libro');
    const selectCap = document.getElementById('select-capitulo');
    const visor = document.getElementById('visor-texto');
    
    if (!visor) return;
    if (!selectLibro || !selectCap || selectCap.options.length === 0) return;

    const libroClave = selectLibro.value;
    const capitulo = selectCap.value;
    const nombreApi = infoLibros[libroClave].apiKey;
    
    visor.innerHTML = "<p class='cargando-biblia'>📖 Buscando en las Escrituras...</p>"; 

    try {
        const url = `https://bible-api.com/${encodeURIComponent(nombreApi)}+${capitulo}?translation=rvr1960`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) throw new Error("Error en el servidor de datos.");
        
        const datos = await respuesta.json();
        visor.innerHTML = ""; 

        if (datos.verses && datos.verses.length > 0) {
            datos.verses.forEach((ver) => {
                const p = document.createElement('p');
                p.className = "versiculo-linea";
                p.innerHTML = `<span class="num-ver">${ver.verse}</span> ${ver.text}`;
                visor.appendChild(p);
            });
            visor.scrollTop = 0; 
        } else {
            visor.innerHTML = "<p class='error-biblia'>❌ No se encontraron textos disponibles.</p>";
        }

    } catch (error) {
        console.error("Error al consultar la API:", error);
        visor.innerHTML = "<p class='error-biblia'>❌ Hubo un problema de conexión al descargar este capítulo. Inténtalo de nuevo.</p>";
    }
}

// Iniciar la carga coordinada al estructurar el árbol DOM
document.addEventListener("DOMContentLoaded", function() {
    inicializarLibros();
});