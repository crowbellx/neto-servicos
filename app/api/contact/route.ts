import { NextResponse } from 'next/server';
import { submitContact } from '@/app/actions/contact';

/**
 * Rota de contato que persiste o lead e o cliente no banco.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Converte os nomes dos campos do formulário para o esperado pela action
    const result = await submitContact({
      nome: body.nome,
      email: body.email,
      whatsapp: body.whatsapp,
      empresa: body.empresa,
      servico: body.servico,
      preferencia: body.preferencia,
      mensagem: body.mensagem,
      origem: body.origem || 'API Route'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!', data: result.data },
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
