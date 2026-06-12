import Anthropic from "@anthropic-ai/sdk";

const AYM_CONTEXT = `
AyM Comunicacion es una agencia de comunicación y marketing digital fundada por 2 socios jóvenes recién licenciados.
Servicios: gestión de redes sociales, creación de contenido, comunicación estratégica, elaboración de estrategias de marketing, paid media (Meta Ads, Google Ads), influencers, reels con guiones atractivos.
Cliente ideal: dueño de negocio o emprendedor sin tiempo que quiere profesionalizar su presencia en redes, vender más y posicionar su marca.
Propuesta de valor: somos jóvenes, ágiles, entendemos las redes mejor que nadie y nos involucramos como si el negocio fuera nuestro.
`;

export async function POST(req) {
  try {
    const { business, context } = await req.json();

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: `Contexto de mi agencia:
${AYM_CONTEXT}

Negocio al que quiero contactar: ${business}
${context ? `Contexto adicional: ${context}` : ""}

Escribime un mail frío para este negocio. El mail debe:
- Ser corto (máximo 150 palabras)
- Empezar con algo específico del negocio (no genérico)
- Hablar de su problema, no de nosotros
- Tener una propuesta de valor clara de AyM
- Terminar con un CTA concreto (llamada, reunión, respuesta)
- Tono: profesional pero cercano, no corporativo

Después del mail, dame 2 variantes del asunto (subject line).`,
        },
      ],
    });

    return Response.json({ email: message.content[0].text });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
