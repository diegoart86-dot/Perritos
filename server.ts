import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('Warning: GEMINI_API_KEY environment variable is not set. AI translation features will fallback to client-side offline mock responses.');
}

// 1. Bark / Thought Translator endpoint
app.post('/api/gemini/translate-bark', async (req, res) => {
  try {
    const { petName, level, hunger, cleanliness, fun, behavior, accessory } = req.body;

    if (!ai) {
      return res.json({
        thought: `¡Guau! Me siento súper feliz de estar aquí contigo. ¡Sigamos jugando! (Sabor Local: Conéctame con Gemini en el panel de secretos para pensamientos personalizados)`,
        actionHint: '¡Intenta darle una caricia o lanzarle la pelota! 🎾'
      });
    }

    const prompt = `Estadísticas de ${petName}: 
- Nivel: ${level}
- Hambre: ${hunger}/100 (0 es famélico, 100 es lleno)
- Limpieza: ${cleanliness}/100
- Diversión: ${fun}/100
- Comportamiento actual: ${behavior}
- Accesorio equipado: ${accessory || 'Ninguno'}

Traduce su estado actual en su mente de Golden Retriever. Genera un pensamiento cómico, tierno, ingenuo y súper cariñoso en español.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Eres un adorable, travieso y extremadamente cariñoso Golden Retriever llamado ${petName || 'Buddy'}. 
Traduce lo que estás pensando basándote en tus estadísticas de juego. Los Golden Retriever aman robar calcetines, morder chancletas, comer galletas, dar cariño y mojarse pero odian que los dejen solos.
Tu tono debe ser súper alegre, tierno, gracioso y un poco despistado. Usa algunas palabras cortas en mayúsculas de la emoción (ej: "¡COMIDA!", "¡PATA!").
Devuelve la respuesta estrictamente en formato JSON con la estructura:
{
  "thought": "Tu pensamiento en español aquí (máximo 2 oraciones, muy alegre)",
  "actionHint": "Una pequeña sugerencia tierna de qué le gustaría que hicieras ahora (ej: '¡Lánzame la pelota ya mismo! 🎾')"
}`,
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error) {
    console.error('Error translating bark with Gemini:', error);
    res.status(500).json({
      thought: '¡Guau guau! (¡Te quiero mucho humano! A veces mis neuronas de perrito se cruzan, ¡pero mi colita no deja de moverse!) 🐕',
      actionHint: '¡Acaricia su pancita para hacerlo sonreír!'
    });
  }
});

// 2. Adventure Diary Generator endpoint
app.post('/api/gemini/generate-diary', async (req, res) => {
  try {
    const { petName, level, activities } = req.body;

    if (!ai) {
      return res.json({
        diary: `Querido Diario: Hoy fue un gran día. Jugué mucho, comí galletitas ricas y me acosté al lado del humano para que me rascara las orejitas. ¡Tener un humano es el mejor trabajo del mundo! 🐾`
      });
    }

    const activitiesStr = activities && activities.length > 0 
      ? activities.join(', ')
      : 'dar vueltas y mirar una mosca';

    const prompt = `Genera la página del diario secreto de hoy de ${petName} (Nivel ${level}). Actividades del día: ${activitiesStr}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Eres un dulce cachorro Golden Retriever llamado ${petName}. Estás escribiendo a escondidas de tu humano en tu diario perruno.
Narra de forma ultra tierna, divertida y fiel a la raza cómo estuvo tu día con las actividades suministradas. Todo para ti es increíble, maravilloso y emocionante, incluso equivocarte o robarte un calcetín.
Debes comenzar exactamente con "Querido Diario:" y finalizar con una firma adorable que incluya una patita (🐾).
Limítate a un párrafo de máximo 4 oraciones. Idioma: Español.`,
      }
    });

    const diaryText = response.text?.trim() || 'Querido Diario: Hoy fue un día lleno de amor y juegos. ¡Guau! 🐾';
    res.json({ diary: diaryText });
  } catch (error) {
    console.error('Error generating diary with Gemini:', error);
    res.status(500).json({
      diary: 'Querido Diario: Hoy estuve tan feliz corriendo de un lado a otro que olvidé cómo escribir con mis patitas peludas. ¡Solo sé que amo a mi humano más que a mis pelotas de tenis! 🐾'
    });
  }
});

// 3. Mount Vite server in development mode, or serve static assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GoldenLife Server] Running on http://0.0.0.0:${PORT} (Production: ${process.env.NODE_ENV === 'production'})`);
  });
}

startServer();
