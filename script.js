// ==========================================
// 1. BASE DE DATOS LOCAL Y USUARIOS
// ==========================================
const versiculosPorAnimo = {
    triste: [
        { id: "t1", libro: "Salmos", cita: "Salmos 34:18", texto: "Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu." },
        { id: "t2", libro: "Mateo", cita: "Mateo 5:4", texto: "Bienaventurados los que lloran, porque ellos recibirán consolación." },
        { id: "t3", libro: "Isaías", cita: "Isaías 41:10", texto: "No temas, porque yo estoy contigo; no desmayes, porque yo estoy con tu Dios que te esfuerzo..." },
        { id: "t4", libro: "Salmos", cita: "Salmos 23:1", texto: "Jehová es mi pastor; nada me faltará." }
    ],
    ansioso: [
        { id: "a1", libro: "Filipenses", cita: "Filipenses 4:6", texto: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego..." },
        { id: "a2", libro: "1 Pedro", cita: "1 Pedro 5:7", texto: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." },
        { id: "a3", libro: "Salmos", cita: "Salmos 94:19", texto: "En la multitud de mis pensamientos dentro de mí, tus consolaciones alegraban mi alma." }
    ],
    feliz: [
        { id: "f1", libro: "Salmos", cita: "Salmos 103:1", texto: "Alaba, alma mía, al Señor; alabe todo mi ser su santo nombre." },
        { id: "f2", libro: "Salmos", cita: "Salmos 118:24", texto: "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." },
        { id: "f3", libro: "Proverbios", cita: "Proverbios 15:13", texto: "El corazón alegre hermosea el rostro; mas por el dolor del corazón el espíritu se abate." }
    ],
    cansado: [
        { id: "c1", libro: "Mateo", cita: "Mateo 11:28", texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
        { id: "c2", libro: "Isaías", cita: "Isaías 40:29", texto: "Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas." }
    ],
    temeroso: [
        { id: "m1", libro: "Salmos", cita: "Salmos 91:1", texto: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente." },
        { id: "m2", libro: "Salmos", cita: "Salmos 56:3", texto: "En el día que temo, yo en ti confío." },
        { id: "m3", libro: "2 Timoteo", cita: "2 Timoteo 1:7", texto: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio." }
    ]
};

// Variables globales del Estado del Usuario
let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioActivo')) || null;
let misFavoritos = [];

function cargarFavoritosUsuario() {
    if (usuarioLogueado && usuarioLogueado.email) {
        const key = 'favoritosApp_' + usuarioLogueado.email;
        misFavoritos = JSON.parse(localStorage.getItem(key)) || [];
    } else {
        misFavoritos = [];
    }
    const contador = document.getElementById('contador-favs');
    if (contador) contador.innerText = misFavoritos.length;
}

// ==========================================
// 2. LÓGICA DE USUARIOS (LOGIN / REGISTRO)
// ==========================================
function abrirModalAuth() {
    if (usuarioLogueado) {
        // Si ya está logueado, el botón sirve para cerrar sesión
        usuarioLogueado = null;
        misFavoritos = [];
        localStorage.removeItem('usuarioActivo');
        actualizarInterfazUsuario();
        actualizarVistaFavoritos();
        alert("Has cerrado sesión.");
    } else {
        document.getElementById('modal-auth').classList.remove('hidden');
    }
}

function cerrarModalAuth() {
    document.getElementById('modal-auth').classList.add('hidden');
}

function alternarFormularios() {
    document.getElementById('form-login').classList.toggle('hidden');
    document.getElementById('form-registro').classList.toggle('hidden');
}

function manejarAuth(event, tipo) {
    event.preventDefault();
    if (tipo === 'registro') {
        const nombre = document.getElementById('reg-nombre').value;
        const email = document.getElementById('reg-email').value;
        usuarioLogueado = { nombre: nombre, email: email };
    } else {
        const email = document.getElementById('login-email').value;
        usuarioLogueado = { nombre: email.split('@')[0], email: email };
    }
    
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioLogueado));
    cargarFavoritosUsuario();
    actualizarInterfazUsuario();
    cerrarModalAuth();
    alert(`¡Bienvenido de nuevo, ${usuarioLogueado.nombre}!`);
}

function actualizarInterfazUsuario() {
    const btnSesion = document.getElementById('btn-estado-sesion');
    const btnFavs = document.getElementById('btn-ver-favoritos');
    
    if (usuarioLogueado) {
        btnSesion.innerText = `Salir (${usuarioLogueado.nombre})`;
        btnFavs.classList.remove('hidden');
        // Asegurarnos de cargar favoritos del usuario activo
        cargarFavoritosUsuario();
    } else {
        btnSesion.innerText = "Iniciar Sesión";
        btnFavs.classList.add('hidden');
        document.getElementById('panel-favoritos').classList.add('hidden');
        const contador = document.getElementById('contador-favs');
        if (contador) contador.innerText = 0;
    }
    const contador = document.getElementById('contador-favs');
    if (contador) contador.innerText = misFavoritos.length;
}

// ==========================================
// 3. LÓGICA DE FAVORITOS
// ==========================================
function agregarAFavoritos(idVersiculo, texto, cita) {
    if (!usuarioLogueado) {
        // Intentar sincronizar desde localStorage si existe (corrección rápida)
        const almacen = localStorage.getItem('usuarioActivo');
        if (almacen) {
            try {
                usuarioLogueado = JSON.parse(almacen);
                cargarFavoritosUsuario();
            } catch (e) {
                usuarioLogueado = null;
            }
        }
    }

    if (!usuarioLogueado) {
        alert("🔒 Debes iniciar sesión para poder guardar tus versículos favoritos.");
        abrirModalAuth();
        return;
    }

    const existe = misFavoritos.some(fav => fav.id === idVersiculo);
    if (existe) {
        alert("Este versículo ya está en tu lista de favoritos.");
        return;
    }

    misFavoritos.push({ id: idVersiculo, texto: texto, cita: cita });
    const key = 'favoritosApp_' + usuarioLogueado.email;
    localStorage.setItem(key, JSON.stringify(misFavoritos));
    document.getElementById('contador-favs').innerText = misFavoritos.length;
    actualizarVistaFavoritos();
    alert("💖 Versículo guardado en tus favoritos.");
}

function eliminarFavorito(idVersiculo) {
    misFavoritos = misFavoritos.filter(fav => fav.id !== idVersiculo);
    if (usuarioLogueado && usuarioLogueado.email) {
        const key = 'favoritosApp_' + usuarioLogueado.email;
        localStorage.setItem(key, JSON.stringify(misFavoritos));
    }
    document.getElementById('contador-favs').innerText = misFavoritos.length;
    actualizarVistaFavoritos();
}

function toggleFavoritosPanel() {
    document.getElementById('panel-favoritos').classList.toggle('hidden');
}

function actualizarVistaFavoritos() {
    const contenedor = document.getElementById('lista-favoritos');
    if (misFavoritos.length === 0) {
        contenedor.innerHTML = '<p class="sin-favoritos">Aún no has guardado ningún versículo.</p>';
        return;
    }

    contenedor.innerHTML = "";
    misFavoritos.forEach(fav => {
        const div = document.createElement('div');
        div.className = "item-favorito";
        div.innerHTML = `
            <div>
                <p style="margin:0; font-style:italic;">"${fav.texto}"</p>
                <small style="color: #6b8e23; font-weight:bold;">${fav.cita}</small>
            </div>
            <button class="btn-eliminar-fav" onclick="eliminarFavorito('${fav.id}')">🗑️</button>
        `;
        contenedor.appendChild(div);
    });
}

// ==========================================
// 4. DESPLIEGUE DINÁMICO POR ESTADOS DE ÁNIMO
// ==========================================
function mostrarVersiculo(animo) {
    const lista = versiculosPorAnimo[animo];
    const boxVersiculo = document.getElementById('box-versiculo');
    const tituloAnimo = document.getElementById('titulo-animo');
    const contenedorLibros = document.getElementById('contenedor-libros-animo');
    const pantallaVersiculo = document.getElementById('pantalla-versiculo');
    const textoVersiculo = document.getElementById('texto-versiculo');
    const citaVersiculo = document.getElementById('cita-versiculo');

    if (!lista || !contenedorLibros || !boxVersiculo) return;

    tituloAnimo.innerText = `Libros recomendados para cuando estás: ${animo}`;
    contenedorLibros.innerHTML = "";
    pantallaVersiculo.classList.add('hidden');
    textoVersiculo.innerHTML = "";
    citaVersiculo.innerText = "";

    // Agrupar libros repetidos
    const librosAgrupados = {};
    lista.forEach((item) => {
        if (!librosAgrupados[item.libro]) {
            librosAgrupados[item.libro] = [];
        }
        librosAgrupados[item.libro].push(item);
    });

    // Ajustar paleta de colores para el estado de ánimo
    boxVersiculo.classList.remove('mood-triste', 'mood-ansioso', 'mood-feliz', 'mood-cansado', 'mood-temeroso');
    boxVersiculo.classList.add(`mood-${animo}`);

    // Marcar el botón de ánimo activo
    document.querySelectorAll('.btn-animo').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.animo === animo);
    });

    // Crear un único botón por libro (sin HTML inline, con eventListeners seguros)
    Object.keys(librosAgrupados).forEach((nombreLibro) => {
        const boton = document.createElement('button');
        boton.className = "btn-libro-animo";
        boton.innerText = nombreLibro;

        boton.addEventListener('click', function() {
            textoVersiculo.innerHTML = "";
            citaVersiculo.innerText = "";

            librosAgrupados[nombreLibro].forEach((item) => {
                const bloqueVersiculo = document.createElement('div');
                bloqueVersiculo.className = 'versiculo-card';

                const p = document.createElement('p');
                p.textContent = `"${item.texto}"`;

                const strong = document.createElement('strong');
                strong.textContent = `- ${item.cita}`;

                const favBtn = document.createElement('button');
                favBtn.className = 'btn-fav-card';
                favBtn.textContent = '💖 Guardar en favoritos';
                favBtn.addEventListener('click', function() {
                    agregarAFavoritos(item.id, item.texto, item.cita);
                });

                bloqueVersiculo.appendChild(p);
                bloqueVersiculo.appendChild(strong);
                bloqueVersiculo.appendChild(favBtn);

                textoVersiculo.appendChild(bloqueVersiculo);
            });

            pantallaVersiculo.classList.remove('hidden');
        });

        contenedorLibros.appendChild(boton);
    });

    boxVersiculo.classList.remove('hidden');
    boxVersiculo.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 5. BASE DE DATOS DE LOS 66 LIBROS (Biblia Online)
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
    "LAM": { nombre: "Lamentaciones", caps: 5, apiKey: "Lamentations" },
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

let bibliaLocal = null;

// Cargar la Biblia local en español
async function cargarBibliaLocal() {
    try {
        const res = await fetch('biblia-rvr1960.json');
        bibliaLocal = await res.json();
    } catch (err) {
        console.warn("No se pudo cargar la Biblia local:", err);
        bibliaLocal = null;
    }
}

function inicializarLibros() {
    const selectLibro = document.getElementById('select-libro');
    if (!selectLibro) return;
    selectLibro.innerHTML = ""; 
    Object.keys(infoLibros).forEach((clave) => {
        const option = document.createElement('option');
        option.value = clave; 
        option.text = infoLibros[clave].nombre; 
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
    const selectTraduccion = document.getElementById('select-traduccion');
    const visor = document.getElementById('visor-texto');
    if (!visor) return;
    if (!selectLibro || !selectCap || selectCap.options.length === 0) return;
    const libroClave = selectLibro.value;
    const capitulo = selectCap.value;
    const traduccion = selectTraduccion ? selectTraduccion.value : 'spanish';
    
    visor.innerHTML = "<p class='cargando-biblia'>📖 Buscando en las Escrituras...</p>";
    
    // Si es español, usar la Biblia local
    if (traduccion === 'spanish') {
        if (!bibliaLocal) {
            visor.innerHTML = "<p class='error-biblia'>❌ No se pudo cargar la Biblia local.</p>";
            return;
        }
        
        // Buscar el libro en la Biblia local
        let libroEncontrado = null;
        for (const key in bibliaLocal.libros) {
            if (key === libroClave) {
                libroEncontrado = bibliaLocal.libros[key];
                break;
            }
        }
        
        if (!libroEncontrado || !libroEncontrado.capitulos[capitulo]) {
            visor.innerHTML = "<p class='error-biblia'>❌ Este capítulo no está disponible en la Biblia local. Usa la versión en inglés.</p>";
            return;
        }
        
        const versos = libroEncontrado.capitulos[capitulo];
        visor.innerHTML = "";
        versos.forEach((ver) => {
            const p = document.createElement('p');
            p.className = "versiculo-linea";
            p.innerHTML = `<span class="num-ver">${ver.verso}</span> ${ver.texto}`;
            visor.appendChild(p);
        });
        visor.scrollTop = 0;
        return;
    }
    
    // Si es inglés, usar la API
    try {
        const nombreApi = infoLibros[libroClave].apiKey;
        let url = `https://bible-api.com/${encodeURIComponent(nombreApi)}+${capitulo}?translation=rvr1960`;
        let respuesta = await fetch(url);
        
        // Si falla con rvr1960, intentar sin parámetro de traducción
        if (!respuesta.ok) {
            url = `https://bible-api.com/${encodeURIComponent(nombreApi)}+${capitulo}`;
            respuesta = await fetch(url);
        }
        
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

// Al cargar el documento, dejamos activa la interfaz según la sesión guardada
document.addEventListener("DOMContentLoaded", async function() {
    await cargarBibliaLocal();
    inicializarLibros();
    cargarFavoritosUsuario();
    actualizarInterfazUsuario();
    actualizarVistaFavoritos();
});