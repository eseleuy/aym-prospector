import Anthropic from "@anthropic-ai/sdk";

const AYM_CONTEXT = `
AyM Comunicacion es una agencia de comunicación y marketing digital fundada por 2 socios jóvenes recién licenciados.
Servicios: gestión de redes sociales, creación de contenido, comunicación estratégica, elaboración de estrategias de marketing, paid media (Meta Ads, Google Ads), influencers, reels con guiones atractivos.
Cliente ideal: dueño de negocio o emprendedor sin tiempo que quiere profesionalizar su presencia en redes, vender más y posicionar su marca.
Propuesta de valor: somos jóvenes, ágiles, entendemos las redes mejor que nadie y nos involucramos como si el negocio fuera nuestro.
`;

export async function POST(req) {
  try {
    const { business } = await req.json();

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Contexto de mi agencia:
${AYM_CONTEXT}

Me reúno con: ${business}

Preparame un briefing de reunión comercial con esta estructura:

**DOLOR PROBABLE**
Qué problemas de comunicación/marketing probablemente tiene este negocio.

**CÓMO POSICIONAR AYM**
Cómo presentar los servicios de AyM de forma relevante para este negocio específico.

**PREGUNTAS CLAVE PARA HACERLES**
5 preguntas que me ayuden a entender su situación y crear urgencia.

**OBJECIONES ESPERADAS Y RESPUESTAS**
Las 3 objeciones más comunes con cómo responderlas.

**CIERRE RECOMENDADO**
Cómo terminar la reunión para avanzar al siguiente paso.

Sé específico para este negocio. Sin generalidades.`,
        },
      ],
    });

    return Response.json({ brief: message.content[0].text });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
