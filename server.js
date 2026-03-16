// server.js - VERSIÓN FINAL: JAVA + PYTHON + C++
const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const db = require('./database'); 

const app = express();
const PORT = process.env.PORT || 3004;

// ==========================================
// 1. BIBLIOTECA TRILINGÜE
// ==========================================
const biblioteca = [
    { archivo: 'libro Java.txt', lenguaje: 'JAVA' },
    { archivo: 'Guia_Python_Basico.txt', lenguaje: 'PYTHON' }, // Nombre actualizado
    { archivo: 'GUIA BASICA DE C++.txt', lenguaje: 'C++' }      // Nuevo libro
];

let baseConocimiento = [];
let listaDeTemas = [];

function cargarCerebros() {
    baseConocimiento = [];
    listaDeTemas = [];
    
    console.log("\n--- INICIANDO CARGA DE CEREBROS ---");

    biblioteca.forEach(libro => {
        const ruta = path.join(__dirname, libro.archivo);
        try {
            if (fs.existsSync(ruta)) {
                const contenido = fs.readFileSync(ruta, 'utf-8');
                const lineas = contenido.split(/\r?\n/);
                let temaActual = null;
                let contadorTemas = 0;

                console.log(`> Leyendo: ${libro.lenguaje}...`);

                lineas.forEach(linea => {
                    const l = linea.trim();
                    if (!l) return; 
                    if (l.startsWith("===")) return; 

                    // Detectar título (Ej: "1. PRINT", "2. VARIABLES")
                    if (/^\d+/.test(l)) {
                        if (temaActual) baseConocimiento.push(temaActual);
                        
                        // Limpiar título
                        const tituloLimpio = l.replace(/^\d+[\.\-\)]?\s*/, '').trim();
                        
                        temaActual = {
                            titulo: tituloLimpio.toLowerCase(),
                            tituloOriginal: tituloLimpio.toUpperCase(),
                            contenido: l,
                            lenguaje: libro.lenguaje
                        };
                        listaDeTemas.push(`${tituloLimpio} (${libro.lenguaje})`);
                        contadorTemas++;
                    } else {
                        if (temaActual) temaActual.contenido += "\n" + l;
                    }
                });
                if (temaActual) baseConocimiento.push(temaActual);
                console.log(`  + ${contadorTemas} temas cargados.`);
            } else {
                console.error(`❌ ERROR: No encuentro '${libro.archivo}'`);
            }
        } catch (e) { console.error(e); }
    });
    console.log(`✅ CEREBRO CARGADO: ${baseConocimiento.length} temas totales.\n`);
}
cargarCerebros();

// --- FORMATEADOR DE CÓDIGO ---
function darFormatoCodigo(texto, lenguaje) {
    // Ajustamos la etiqueta para que highlight funcione bien
    let langTag = lenguaje.toLowerCase();
    if(langTag === 'c++') langTag = 'cpp'; // Markdown prefiere 'cpp'

    return texto.replace(/(Ejemplo(?:.*)?:)([\s\S]*?)(?=Actividad:|$)/gi, 
        (m, h, c) => `\n**${h}**\n\`\`\`${langTag}\n${c.trim()}\n\`\`\`\n`);
}

// --- INTELIGENCIA DE 3 LENGUAJES ---
function procesarIntencion(pregunta) {
    const p = pregunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    // 1. HOLA MUNDO (Diferenciado por 3 lenguajes)
    if (p.includes("hola mundo") || (p.includes("estructura") && p.includes("basica"))) {
        if (p.includes("python")) {
            return `El "Hola Mundo" en **Python** es el más simple:\n\`\`\`python\nprint("Hola mundo")\n\`\`\``;
        }
        if (p.includes("c++") || p.includes("cpp")) {
            return `El "Hola Mundo" en **C++** usa cout:\n\`\`\`cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hola mundo";\n    return 0;\n}\n\`\`\``;
        }
        // Por defecto Java
        return `El "Hola Mundo" en **Java**:\n\`\`\`java\npublic class HolaMundo {\n    public static void main(String[] args) {\n        System.out.println("Hola mundo");\n    }\n}\n\`\`\``;
    }

    // 2. META-INFO
    if (p.match(/(que|cual|dime).*(temas|lista|informacion)/) || p.match(/^indice$/)) {
        if (listaDeTemas.length === 0) return "Error: No se cargaron los libros.";
        return `Soy experto en **Java**, **Python** y **C++**. Aquí mis temas:\n\n🔹 ${listaDeTemas.join("\n🔹 ")}`;
    }

    if (p.match(/(que|en que).*(puedes|sabes).*(hacer|ayudar)/)) {
        return "Soy tu tutor de programación trilingüe. Pregúntame sobre **Java**, **Python** o **C++**.";
    }

    // 3. BÚSQUEDA TÉCNICA
    const sinonimos = { 
        "bucle": ["for", "while"], "condicional": ["if", "else", "switch"], 
        "imprimir": ["print", "println", "cout", "salida"], 
        "leer": ["scanner", "input", "cin", "entrada"],
        "variable": ["int", "float", "string", "bool"]
    };
    
    let palabras = p.split(/\s+/);
    Object.keys(sinonimos).forEach(k => { if (p.includes(k)) palabras.push(...sinonimos[k]); });

    let mejorTema = null, maxPuntos = 0;

    baseConocimiento.forEach(tema => {
        let puntos = 0;
        
        // PUNTOS EXTRA POR CONTEXTO DE LENGUAJE
        if (p.includes("python") && tema.lenguaje === "PYTHON") puntos += 100;
        if (p.includes("java") && tema.lenguaje === "JAVA") puntos += 100;
        if ((p.includes("c++") || p.includes("cpp")) && tema.lenguaje === "C++") puntos += 100;

        palabras.forEach(w => {
            if (w.length > 1) {
                if (tema.titulo.includes(w)) puntos += 20;
                else if (tema.contenido.toLowerCase().includes(w)) puntos += 1;
            }
        });
        if (puntos > maxPuntos) { maxPuntos = puntos; mejorTema = tema; }
    });

    if (mejorTema && maxPuntos >= 3) {
        return `Referencia encontrada en **${mejorTema.lenguaje}**:\n\n` + 
               `**${mejorTema.tituloOriginal}**\n\n` + 
               `${darFormatoCodigo(mejorTema.contenido, mejorTema.lenguaje)}`;
    }

    // 4. SALUDO
    if (/\bhola\b/.test(p)) return "¡Hola! ¿Estudiamos Java, Python o C++?";

    return "No encontré eso. Intenta especificar el lenguaje, ej: 'Imprimir en C++' o 'Variables en Python'.";
}

// EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'key', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
const requireLogin = (req, res, next) => req.session.userId ? next() : res.redirect('/login.html');

app.get('/', requireLogin, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/index.html', requireLogin, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login.html', (req, res) => req.session.userId ? res.redirect('/') : res.sendFile(path.join(__dirname, 'public', 'login.html')));

app.post('/api/auth/register', async (req, res) => {
    const { matricula, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (matricula, password) VALUES (?, ?)`, [matricula, hash], (err) => {
            if(err) return res.status(400).json({error:"Error"});
            req.session.userId = this.lastID; res.json({success:true});
        });
    } catch(e) { res.status(500).json({error:"Error"}); }
});
app.post('/api/auth/login', (req, res) => {
    const { matricula, password } = req.body;
    db.get(`SELECT * FROM users WHERE matricula = ?`, [matricula], async (err, user) => {
        if(!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({error:"Error"});
        req.session.userId = user.id; res.json({success:true});
    });
});
app.post('/api/auth/logout', (req, res) => req.session.destroy(() => res.json({success:true})));

app.post('/api/gemini-chat', requireLogin, (req, res) => {
    setTimeout(() => res.json({ success: true, response: procesarIntencion(req.body.prompt) }), 500);
});

app.listen(PORT, () => console.log(`🚀 SERVIDOR TRILINGÜE OK: http://localhost:${PORT}`));