"use server"

import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDbConnection from "@/lib/database"

const db = getDbConnection();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// --- LÓGICA DE LOGIN EN DOS PASOS ---

/**
 * PASO 1 DEL LOGIN: Verifica email y contraseña. Si son correctos, devuelve las preguntas de seguridad.
 */
export async function verifyPasswordAndGetQuestions(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email y contraseña son requeridos" };
    }

    try {
        const userStmt = db.prepare<[string]>(`SELECT password_hash FROM usuarios WHERE email = ? AND activo = 1`);
        const user = userStmt.get(email) as { password_hash: string } | undefined;

        if (!user) {
            return { error: "Credenciales inválidas" };
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return { error: "Credenciales inválidas" };
        }

        const questionsStmt = db.prepare(`
            SELECT p1.texto_pregunta as q1, p2.texto_pregunta as q2, p3.texto_pregunta as q3
            FROM usuarios u
            JOIN preguntas_seguridad p1 ON u.pregunta_1_id = p1.id
            JOIN preguntas_seguridad p2 ON u.pregunta_2_id = p2.id
            JOIN preguntas_seguridad p3 ON u.pregunta_3_id = p3.id
            WHERE u.email = ?
        `);
        const questions = questionsStmt.get(email) as { q1: string; q2: string; q3: string; } | undefined;

        if (!questions) {
             return { error: "No se pudieron encontrar las preguntas de seguridad para este usuario." };
        }

        return { success: true, questions: [questions.q1, questions.q2, questions.q3] };

    } catch (error) {
        console.error("Error en verifyPasswordAndGetQuestions:", error);
        return { error: "Error interno del servidor." };
    }
}

/**
 * PASO 2 DEL LOGIN: Verifica las respuestas de seguridad. Si son correctas, inicia la sesión.
 */
export async function verifyAnswersAndLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const answer1 = formData.get("answer1") as string;
    const answer2 = formData.get("answer2") as string;
    const answer3 = formData.get("answer3") as string;

    if (!email || !answer1 || !answer2 || !answer3) {
        return { error: "Debe responder a todas las preguntas de seguridad." };
    }

    try {
        const userStmt = db.prepare<[string]>(
            `SELECT id, email, rol, nombre_completo, respuesta_1_hash, respuesta_2_hash, respuesta_3_hash 
             FROM usuarios WHERE email = ? AND activo = 1`
        );
        const user = userStmt.get(email) as {
            id: string;
            email: string;
            rol: 'administrador' | 'director' | 'docente';
            nombre_completo: string;
            respuesta_1_hash: string;
            respuesta_2_hash: string;
            respuesta_3_hash: string;
        } | undefined;

        if (!user) {
            return { error: "Usuario no encontrado." };
        }

        const isAnswer1Valid = await bcrypt.compare(answer1.toLowerCase(), user.respuesta_1_hash);
        const isAnswer2Valid = await bcrypt.compare(answer2.toLowerCase(), user.respuesta_2_hash);
        const isAnswer3Valid = await bcrypt.compare(answer3.toLowerCase(), user.respuesta_3_hash);

        if (!isAnswer1Valid || !isAnswer2Valid || !isAnswer3Valid) {
            return { error: "Una o más respuestas de seguridad son incorrectas." };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol, nombre_completo: user.nombre_completo },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        cookies().set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        let redirectUrl = "/dashboard";
        if (user.rol === "docente") redirectUrl = "/dashboard/estudiantes";
        else if (user.rol === "director") redirectUrl = "/dashboard/reportes";

        return { success: "Login exitoso", redirect: redirectUrl };

    } catch (error) {
        console.error("Error en verifyAnswersAndLogin:", error);
        return { error: "Error interno del servidor." };
    }
}



// --- LÓGICA PARA PÁGINA 'OLVIDÉ MI CONTRASEÑA' (AQUÍ ESTÁN LAS FUNCIONES QUE FALTABAN) ---

/**
 * Obtiene las preguntas de seguridad de un usuario específico usando su email o cédula.
 * Usado por la página /olvide-mi-contrasena.
 */
export async function getSecurityQuestionsForUser(identifier: string) {
    try {
        const stmt = db.prepare(`
            SELECT p1.texto_pregunta as pregunta1_texto,
                   p2.texto_pregunta as pregunta2_texto,
                   p3.texto_pregunta as pregunta3_texto
            FROM usuarios u
            JOIN preguntas_seguridad p1 ON u.pregunta_1_id = p1.id
            JOIN preguntas_seguridad p2 ON u.pregunta_2_id = p2.id
            JOIN preguntas_seguridad p3 ON u.pregunta_3_id = p3.id
            WHERE (u.email = ? OR u.cedula = ?) AND u.activo = 1
        `);
        const result = stmt.get(identifier, identifier) as { pregunta1_texto: string; pregunta2_texto: string; pregunta3_texto: string } | undefined;

        if (!result) {
            return { error: "Usuario no encontrado o inactivo. Verifica el correo o la cédula." };
        }

        return {
            questions: [result.pregunta1_texto, result.pregunta2_texto, result.pregunta3_texto]
        };
    } catch (error) {
        console.error("Error obteniendo preguntas de seguridad:", error);
        return { error: "Error interno del servidor." };
    }
}

/**
 * Verifica las respuestas de seguridad y, si son correctas, devuelve la contraseña.
 * Usado por la página /olvide-mi-contrasena.
 */
export async function verifyAnswersAndGetPassword(formData: FormData) {
    const identifier = formData.get("identifier") as string;
    const answer1 = formData.get("answer1") as string;
    const answer2 = formData.get("answer2") as string;
    const answer3 = formData.get("answer3") as string;

    if (!identifier || !answer1 || !answer2 || !answer3) {
        return { error: "Debes responder las tres preguntas." };
    }

    try {
        const stmt = db.prepare<[string, string]>(
            `SELECT password_hash, respuesta_1_hash, respuesta_2_hash, respuesta_3_hash
             FROM usuarios WHERE email = ? OR cedula = ?`
        );
        const user = stmt.get(identifier, identifier) as {
            password_hash: string;
            respuesta_1_hash: string;
            respuesta_2_hash: string;
            respuesta_3_hash: string;
        } | undefined;

        if (!user) {
            return { error: "Usuario no encontrado." };
        }
        
        const isAnswer1Valid = await bcrypt.compare(answer1.toLowerCase(), user.respuesta_1_hash);
        const isAnswer2Valid = await bcrypt.compare(answer2.toLowerCase(), user.respuesta_2_hash);
        const isAnswer3Valid = await bcrypt.compare(answer3.toLowerCase(), user.respuesta_3_hash);

        if (!isAnswer1Valid || !isAnswer2Valid || !isAnswer3Valid) {
            return { error: "Una o más respuestas son incorrectas." };
        }

        let passwordToShow = "Tu contraseña está encriptada. Se recomienda cambiarla al iniciar sesión.";
        
        if (!user.password_hash.startsWith('$2a$') && !user.password_hash.startsWith('$2b$')) {
            passwordToShow = user.password_hash;
        }

        return { success: "¡Verificación exitosa!", password: passwordToShow };
    } catch (error) {
        console.error("Error verificando respuestas:", error);
        return { error: "Error interno del servidor." };
    }
}



// --- LÓGICA DE REGISTRO Y CIERRE DE SESIÓN ---

/**
 * Cierra la sesión del usuario eliminando la cookie.
 */
export async function logout() {
    console.log("🚪 Cerrando sesión...")
    cookies().delete("auth-token")
    return { success: "Sesión cerrada" }
}

/**
 * Obtiene la lista de preguntas de seguridad disponibles para el formulario de registro.
 */
export async function getAvailableSecurityQuestions() {
    try {
        const stmt = db.prepare("SELECT id, texto_pregunta FROM preguntas_seguridad");
        const questions = stmt.all() as { id: number; texto_pregunta: string }[];
        return { questions };
    } catch (error) {
        console.error("Error al obtener preguntas:", error);
        return { error: "No se pudieron cargar las preguntas de seguridad." };
    }
}

/**
 * Registra un nuevo usuario en la base de datos.
 */
export async function registerUser(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const { email, cedula, nombre_completo, password, pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3 } = data;
    if (!email || !cedula || !nombre_completo || !password || !pregunta1 || !respuesta1 || !pregunta2 || !respuesta2 || !pregunta3 || !respuesta3) {
        return { error: "Todos los campos son obligatorios." };
    }
    try {
        const checkStmt = db.prepare("SELECT id FROM usuarios WHERE email = ? OR cedula = ?");
        const existingUser = checkStmt.get(email, cedula) as { id: string } | undefined;
        if (existingUser) {
            return { error: "El correo electrónico o la cédula ya están registrados." };
        }
        const passwordHash = await bcrypt.hash(password as string, 10);
        const respuesta1Hash = await bcrypt.hash((respuesta1 as string).toLowerCase(), 10);
        const respuesta2Hash = await bcrypt.hash((respuesta2 as string).toLowerCase(), 10);
        const respuesta3Hash = await bcrypt.hash((respuesta3 as string).toLowerCase(), 10);
        const insertStmt = db.prepare(`
            INSERT INTO usuarios (email, cedula, nombre_completo, password_hash, rol, pregunta_1_id, respuesta_1_hash, pregunta_2_id, respuesta_2_hash, pregunta_3_id, respuesta_3_hash)
            VALUES (?, ?, ?, ?, 'docente', ?, ?, ?, ?, ?, ?)
        `);
        insertStmt.run(email, cedula, nombre_completo, passwordHash, pregunta1, respuesta1Hash, pregunta2, respuesta2Hash, pregunta3, respuesta3Hash);
        return { success: "¡Usuario registrado con éxito! Ahora puedes iniciar sesión." };
    } catch (error: any) {
        console.error("Error en registro:", error);
        return { error: "Error interno del servidor al registrar el usuario." };
    }
}