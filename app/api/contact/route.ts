import { NextResponse } from 'next/server';

/**
 * Edge Runtime — sem cold start, não consome GB-hora serverless.
 * Rota de contato que persiste o lead no banco via Server Action indiretamente.
 * TODO: Integrar com Resend/SendGrid para envio real de email.
 */
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: Persistir como Lead no banco via fetch para a API interna
    // ou mover esta lógica para uma Server Action diretamente no formulário
    console.log('Received contact form submission:', body);

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação.' },
      { status: 500 }
    );
  }
}
