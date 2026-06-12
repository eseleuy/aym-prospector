import Anthropic from "@anthropic-ai/sdk";

const AYM_CONTEXT = `
AyM Comunicacion es una agencia de comunicación y marketing digital fundada por 2 socios jóvenes recién licenciados.
Servicios: gestión de redes sociales, creación de contenido, comunicación estratégica, elaboración de estrategias de marketing, paid media (Meta Ads, Google Ads), influencers, reels con guiones atractivos.
Cliente ideal: dueño de negocio o emprendedor sin tiempo que quiere profesionalizar su presencia en redes, vender más y posicionar su marca.
Propuesta de valor: somos jóvenes, ágiles, entendemos las redes mejor que nadie y nos involucramos como si el negocio fuera nuestro.
`;

export async function POST(req) {
  try {
    const { query } = await req.json();

    // Buscar con Google Custom Search
    const googleKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;

    let prospects = [];

    if (googleKey && cseId) {
      const googleRes = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${cseId}&q=${encodeURIComponent(query)}&num=8`
      );
      const googleData = await googleRes.json();

      if (googleData.items) {
        prospects = googleData.items.map((item) => ({
          name: item.title,
          website: item.link,
          description: item.snippet,
        }));
      }
    }

    // Análisis del rubro con Claude
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: `Contexto de mi agencia:
${AYM_CONTEXT}

Analizo el rubro: "${query}"

Dame un análisis comercial breve (máximo 5 puntos) que me ayude a venderle a este tipo de negocio:
1. Qué problemas de comunicación suelen tener
2. Qué les duele más (el pain point principal)
3. Cómo posicionar AyM para este rubro
4. Qué objeciones voy a encontrar y cómo responderlas
5. Frase de apertura recomendada para el primer contacto

Sé directo y accionable. Sin paja.`,
        },
      ],
    });

    return Response.json({
      prospects,
      analysis: message.content[0].text,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
