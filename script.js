// ==========================================
// 1. BASE DE DATOS LOCAL Y USUARIOS
// ==========================================
const versiculosPorAnimo = {
    triste: [
        { id: "t1", libro: "Salmos", cita: "Salmos 34:18", texto: "Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu." },
        { id: "t2", libro: "Mateo", cita: "Mateo 5:4", texto: "Bienaventurados los que lloran, porque ellos recibirán consolación." },
        { id: "t3", libro: "Isaías", cita: "Isaías 41:10", texto: "No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia." },
        { id: "t4", libro: "Salmos", cita: "Salmos 23:1", texto: "Jehová es mi pastor; nada me faltará." }
    ],
    ansioso: [
        { id: "a1", libro: "Filipenses", cita: "Filipenses 4:6", texto: "Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego, con hacimiento de gracias." },
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
    ],
    esperanza: [
        { id: "e1", libro: "Romanos", cita: "Romanos 15:13", texto: "Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo." },
        { id: "e2", libro: "Salmos", cita: "Salmos 39:7", texto: "Y ahora, Señor, ¿qué esperaré? Mi esperanza está en ti." }
    ],
    gratitud: [
        { id: "g1", libro: "1 Tesalonicenses", cita: "1 Tesalonicenses 5:18", texto: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús." },
        { id: "g2", libro: "Salmos", cita: "Salmos 107:1", texto: "Dad gracias a Jehová, porque él es bueno; porque para siempre es su misericordia." }
    ],
    fortaleza: [
        { id: "fo1", libro: "Isaías", cita: "Isaías 40:31", texto: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán." },
        { id: "fo2", libro: "Filipenses", cita: "Filipenses 4:13", texto: "Todo lo puedo en Cristo que me fortalece." }
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
let __lastFocusedBeforeModal = null;
let __modalKeydownHandler = null;

function abrirModalAuth() {
    if (usuarioLogueado) {
        // Si ya está logueado, el botón sirve para cerrar sesión
        usuarioLogueado = null;
        misFavoritos = [];
        localStorage.removeItem('usuarioActivo');
        actualizarInterfazUsuario();
        actualizarVistaFavoritos();
        alert("Has cerrado sesión.");
        return;
    }

    const modal = document.getElementById('modal-auth');
    if (!modal) return;

    __lastFocusedBeforeModal = document.activeElement;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    // Establecer aria-labelledby según el formulario visible
    const visibleTitle = document.getElementById('form-login').classList.contains('hidden') ? document.getElementById('reg-title') : document.getElementById('login-title');
    if (visibleTitle) modal.setAttribute('aria-labelledby', visibleTitle.id);

    // Foco al primer control del formulario visible
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) firstInput.focus();

    // Handler para Escape y trap de foco
    __modalKeydownHandler = function(e) {
        if (e.key === 'Escape') {
            cerrarModalAuth();
        } else if (e.key === 'Tab') {
            // simple focus trap
            const focusables = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select');
            const focusArray = Array.prototype.slice.call(focusables).filter(el => el.offsetParent !== null);
            if (focusArray.length === 0) return;
            const first = focusArray[0];
            const last = focusArray[focusArray.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    document.addEventListener('keydown', __modalKeydownHandler);
}

function cerrarModalAuth() {
    const modal = document.getElementById('modal-auth');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (__modalKeydownHandler) {
        document.removeEventListener('keydown', __modalKeydownHandler);
        __modalKeydownHandler = null;
    }
    if (__lastFocusedBeforeModal && __lastFocusedBeforeModal.focus) {
        try { __lastFocusedBeforeModal.focus(); } catch (e) {}
        __lastFocusedBeforeModal = null;
    }
}

function alternarFormularios(event) {
    if (event) event.preventDefault();
    const login = document.getElementById('form-login');
    const reg = document.getElementById('form-registro');
    if (!login || !reg) return;
    login.classList.toggle('hidden');
    reg.classList.toggle('hidden');

    // Actualizar aria-labelledby del modal
    const modal = document.getElementById('modal-auth');
    const visibleTitle = login.classList.contains('hidden') ? document.getElementById('reg-title') : document.getElementById('login-title');
    if (modal && visibleTitle) modal.setAttribute('aria-labelledby', visibleTitle.id);

    // Mover foco al primer input del formulario mostrado
    const firstInput = (login.classList.contains('hidden') ? reg : login).querySelector('input');
    if (firstInput) firstInput.focus();
}

function manejarAuth(event, tipo) {
    event.preventDefault();
    if (tipo === 'registro') {
        const nombre = document.getElementById('reg-nombre').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        if (!nombre || !email) return;
        usuarioLogueado = { nombre, email };
    } else {
        const email = document.getElementById('login-email').value.trim();
        if (!email) return;
        usuarioLogueado = { nombre: email.split('@')[0], email };
    }

    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioLogueado));
    cargarFavoritosUsuario();
    actualizarInterfazUsuario();
    cerrarModalAuth();
    const mensaje = tipo === 'registro'
        ? `¡Bienvenido, ${usuarioLogueado.nombre}! Tu perfil local está listo.`
        : `¡Bienvenido de nuevo, ${usuarioLogueado.nombre}!`;
    alert(mensaje);
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
function obtenerLibroDeCita(cita) {
    if (!cita) return 'Libro desconocido';
    const sinVersiculo = cita.replace(/:\d+(-\d+)?$/, '').trim();
    return sinVersiculo || 'Libro desconocido';
}

function agregarAFavoritos(idVersiculo, texto, cita, notaPersonal = '') {
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

    const libro = obtenerLibroDeCita(cita);
    misFavoritos.push({ id: idVersiculo, texto: texto, cita: cita, libro: libro, nota: notaPersonal });
    const key = 'favoritosApp_' + usuarioLogueado.email;
    localStorage.setItem(key, JSON.stringify(misFavoritos));
    const contador = document.getElementById('contador-favs');
    if (contador) contador.innerText = misFavoritos.length;
    actualizarVistaFavoritos();
    alert("💖 Versículo guardado en tus favoritos.");
}

function eliminarFavorito(idVersiculo) {
    if (!confirm('¿Eliminar este versículo de tus favoritos?')) return;
    misFavoritos = misFavoritos.filter(fav => fav.id !== idVersiculo);
    if (usuarioLogueado && usuarioLogueado.email) {
        const key = 'favoritosApp_' + usuarioLogueado.email;
        localStorage.setItem(key, JSON.stringify(misFavoritos));
    }
    const contador = document.getElementById('contador-favs');
    if (contador) contador.innerText = misFavoritos.length;
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

    const libros = {};
    misFavoritos.forEach(fav => {
        const libro = fav.libro || obtenerLibroDeCita(fav.cita);
        if (!libro) return;
        if (!libros[libro]) libros[libro] = [];
        libros[libro].push(fav);
    });

    contenedor.innerHTML = "";

    Object.keys(libros).forEach((nombreLibro) => {
        const grupo = libros[nombreLibro];
        const card = document.createElement('div');
        card.className = 'item-favorito libro-favorito';

        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'favorito-libro-header';
        header.textContent = `${nombreLibro} (${grupo.length}) — Ver / Ocultar`;
        header.addEventListener('click', () => {
            detalles.classList.toggle('hidden');
            card.classList.toggle('abierto');
        });

        const detalles = document.createElement('div');
        detalles.className = 'favorito-versiculos hidden';

        grupo.forEach((fav) => {
            const fila = document.createElement('div');
            fila.className = 'favorito-versiculo-item';
            const texto = document.createElement('div');
            texto.className = 'favorito-verse-text';

            const parrafo = document.createElement('p');
            parrafo.textContent = `"${fav.texto}"`;

            const cita = document.createElement('small');
            cita.textContent = fav.cita;

            texto.appendChild(parrafo);
            texto.appendChild(cita);

            if (fav.nota) {
                const nota = document.createElement('span');
                nota.className = 'favorito-verse-note';
                nota.textContent = `Nota: ${fav.nota}`;
                texto.appendChild(nota);
            }

            const eliminarBtn = document.createElement('button');
            eliminarBtn.type = 'button';
            eliminarBtn.className = 'btn-eliminar-fav';
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => {
                eliminarFavorito(fav.id);
                header.focus();
            });

            fila.appendChild(texto);
            fila.appendChild(eliminarBtn);
            detalles.appendChild(fila);
        });

        card.appendChild(header);
        card.appendChild(detalles);
        contenedor.appendChild(card);
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
    boxVersiculo.classList.remove('mood-triste', 'mood-ansioso', 'mood-feliz', 'mood-cansado', 'mood-temeroso', 'mood-esperanza', 'mood-gratitud', 'mood-fortaleza');
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

                const notaInput = document.createElement('textarea');
                notaInput.className = 'nota-personal-input';
                notaInput.placeholder = 'Escribe una nota personal para este versículo...';
                notaInput.rows = 2;

                const favBtn = document.createElement('button');
                favBtn.className = 'btn-fav-card';
                favBtn.textContent = '💖 Guardar en favoritos';
                favBtn.addEventListener('click', function() {
                    agregarAFavoritos(item.id, item.texto, item.cita, notaInput.value);
                });

                bloqueVersiculo.appendChild(p);
                bloqueVersiculo.appendChild(strong);
                bloqueVersiculo.appendChild(notaInput);
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

const clavesBibliaLocal = {
    "GEN": "GEN",
    "EXO": "EXO",
    "LEV": "LEV",
    "NUM": "NUM",
    "DEU": "DEU",
    "JOS": "JOS",
    "JDG": "JDG",
    "RUT": "RUT",
    "1SA": "1SA",
    "2SA": "2SA",
    "1KI": "1KI",
    "2KI": "2KI",
    "1CH": "1CH",
    "2CH": "2CH",
    "EZR": "EZR",
    "NEH": "NEH",
    "EST": "EST",
    "JOB": "JOB",
    "PSA": "SAL",
    "PRO": "PRO",
    "ECC": "ECC",
    "SNG": "SNG",
    "ISA": "ISA",
    "JER": "JER",
    "LAM": "LAM",
    "EZK": "EZK",
    "DAN": "DAN",
    "HOS": "HOS",
    "JOL": "JOL",
    "AMO": "AMO",
    "OBA": "OBA",
    "JON": "JON",
    "MIC": "MIC",
    "NAM": "NAM",
    "HAB": "HAB",
    "ZEP": "ZEP",
    "HAG": "HAG",
    "ZEC": "ZEC",
    "MAL": "MAL",
    "MAT": "MAT",
    "MRK": "MRK",
    "LUK": "LUK",
    "JHN": "JHN",
    "ACT": "ACT",
    "ROM": "ROM",
    "1CO": "1CO",
    "2CO": "2CO",
    "GAL": "GAL",
    "EPH": "EPH",
    "PHP": "FLP",
    "COL": "COL",
    "1TH": "1TH",
    "2TH": "2TH",
    "1TI": "1TI",
    "2TI": "2TI",
    "TIT": "TIT",
    "PHM": "PHM",
    "HEB": "HEB",
    "JAS": "JAS",
    "1PE": "1PE",
    "2PE": "2PE",
    "1JN": "1JN",
    "2JN": "2JN",
    "3JN": "3JN",
    "JUD": "JUD",
    "REV": "REV"
};

function obtenerClaveBibliaLocal(libroClave) {
    return clavesBibliaLocal[libroClave] || libroClave;
}

let bibliaLocal = null;
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

async function actualizarTextoCapituloActual() {
    const selectLibro = document.getElementById('select-libro');
    const selectCap = document.getElementById('select-capitulo');
    const textoActual = document.getElementById('texto-capitulo-actual');
    if (!selectLibro || !selectCap || !textoActual) return;
    const libroNombre = infoLibros[selectLibro.value]?.nombre || 'Libro';
    textoActual.textContent = `${libroNombre} ${selectCap.value}`;
}

async function cargarCapitulo() {
    const selectLibro = document.getElementById('select-libro');
    const selectCap = document.getElementById('select-capitulo');
    const selectTraduccion = document.getElementById('select-traduccion');
    const visor = document.getElementById('visor-texto');
    actualizarTextoCapituloActual();
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
        
        const claveLocal = obtenerClaveBibliaLocal(libroClave);
        const libroEncontrado = bibliaLocal.libros[claveLocal];
        
        if (!libroEncontrado || !libroEncontrado.capitulos[capitulo]) {
            visor.innerHTML = "<p class='error-biblia'>❌ Este capítulo no está disponible en la Biblia local.</p>";
            return;
        }
        
        const versos = libroEncontrado.capitulos[capitulo];
        visor.innerHTML = "";
        versos.forEach((ver) => {
            const p = document.createElement('p');
            p.className = "versiculo-linea";
            const numSpan = document.createElement('span');
            numSpan.className = "num-ver";
            numSpan.textContent = ver.verso;
            p.appendChild(numSpan);
            p.appendChild(document.createTextNode(' ' + ver.texto));
            visor.appendChild(p);
        });
        visor.scrollTop = 0;
        return;
    }
    
    // Si es inglés, usar la API
    try {
        const nombreApi = infoLibros[libroClave].apiKey;
        let url = `https://bible-api.com/${encodeURIComponent(nombreApi)}+${capitulo}?translation=web`;
        let respuesta = await fetch(url);
        
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
                const numSpan = document.createElement('span');
                numSpan.className = "num-ver";
                numSpan.textContent = ver.verse;
                p.appendChild(numSpan);
                p.appendChild(document.createTextNode(' ' + ver.text));
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

function cambiarCapitulo(delta) {
    const selectLibro = document.getElementById('select-libro');
    const selectCap = document.getElementById('select-capitulo');
    if (!selectLibro || !selectCap) return;
    const actual = Number(selectCap.value);
    const maximo = infoLibros[selectLibro.value]?.caps || 1;
    let siguiente = actual + delta;
    if (siguiente < 1) siguiente = 1;
    if (siguiente > maximo) siguiente = maximo;
    if (siguiente === actual) return;
    selectCap.value = siguiente;
    cargarCapitulo();
}

function filtrarVersiculosCapitulo() {
    const filtro = document.getElementById('input-buscar').value.toLowerCase();
    const visor = document.getElementById('visor-texto');
    if (!visor) return;
    const versos = Array.from(visor.querySelectorAll('.versiculo-linea'));
    let coincidencias = 0;

    versos.forEach((verso) => {
        const texto = verso.textContent.toLowerCase();
        if (texto.includes(filtro)) {
            verso.classList.remove('hidden');
            coincidencias += 1;
        } else {
            verso.classList.add('hidden');
        }
    });

    const mensaje = visor.querySelector('.mensaje-busqueda');
    if (filtro && coincidencias === 0) {
        if (!mensaje) {
            const mensajeNodo = document.createElement('p');
            mensajeNodo.className = 'mensaje-busqueda';
            mensajeNodo.textContent = 'No se encontraron resultados para esa búsqueda.';
            visor.appendChild(mensajeNodo);
        }
    } else if (mensaje) {
        mensaje.remove();
    }
}

function limpiarBusquedaBiblia() {
    const campo = document.getElementById('input-buscar');
    if (campo) campo.value = '';
    filtrarVersiculosCapitulo();
}

function obtenerVersiculoDelDia() {
    const opciones = [];
    Object.keys(versiculosPorAnimo).forEach((animo) => {
        versiculosPorAnimo[animo].forEach((item) => opciones.push(item));
    });
    if (opciones.length === 0) return null;
    const dias = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const indice = dias % opciones.length;
    return opciones[indice];
}

function mostrarVersiculoDelDia() {
    const versiculo = obtenerVersiculoDelDia();
    const texto = document.getElementById('versiculo-dia-texto');
    const cita = document.getElementById('versiculo-dia-cita');
    if (!texto || !cita) return;
    if (!versiculo) {
        texto.textContent = 'Encuentra un versículo que te acompañe hoy.';
        cita.textContent = '';
        return;
    }
    texto.textContent = `"${versiculo.texto}"`;
    cita.textContent = versiculo.cita;
}

// Al cargar el documento, dejamos activa la interfaz según la sesión guardada
document.addEventListener("DOMContentLoaded", async function() {
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModalAuth();
        });
    }

    await cargarBibliaLocal();
    inicializarLibros();
    cargarFavoritosUsuario();
    actualizarInterfazUsuario();
    actualizarVistaFavoritos();
    mostrarVersiculoDelDia();
});