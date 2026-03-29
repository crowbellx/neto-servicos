import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Here you would typically send an email using a service like Resend, SendGrid, or Nodemailer
    // Or save the data to a database like Supabase, Firebase, or Vercel Postgres
    
    console.log('Received contact form submission:', body);
    
    // Simulate processing time (reduced to meet < 200ms requirement)
    await new Promise((resolve) => setTimeout(resolve, 100));

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
