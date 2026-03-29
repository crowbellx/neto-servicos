# AI Rules & Tech Stack - Neto Serviços

## Tech Stack
- **Framework**: Next.js 15 (App Router) com React 19.
- **Linguagem**: TypeScript para tipagem estática em todo o projeto.
- **Banco de Dados**: PostgreSQL hospedado no Supabase.
- **ORM**: Prisma para modelagem e consultas ao banco.
- **Autenticação**: NextAuth.js (Auth.js) v5 para gestão de sessões e RBAC.
- **Estilização**: Tailwind CSS 4 para design responsivo e utilitário.
- **Animações**: Motion (framer-motion) para interações fluidas.
- **Formulários**: React Hook Form com validação via Zod.
- **Editor de Texto**: TipTap para edição de conteúdo rico no painel admin.
- **Upload**: Supabase Storage integrado via API Routes personalizadas.

## Regras de Desenvolvimento
- **Componentes**: Prefira componentes funcionais e pequenos (menos de 100 linhas). Use a pasta `components/admin` para o painel e `components/layout` ou pastas específicas para o site público.
- **Estilo**: Use exclusivamente classes do Tailwind. Evite CSS inline ou módulos CSS, a menos que estritamente necessário.
- **Dados**: Use **Server Components** para busca de dados (fetching) e **Server Actions** para mutações (POST/PUT/DELETE).
- **Validação**: Sempre defina schemas Zod para formulários e entradas de API.
- **Ícones**: Use a biblioteca `lucide-react`.
- **Rich Text**: Para qualquer campo de conteúdo longo, utilize o componente `TipTapEditor` já configurado.
- **Imagens**: Utilize o componente `ImageUploadDropzone` para uploads no admin, que já lida com a API de upload e Supabase.
- **Segurança**: Verifique permissões usando `hasRequiredRole` ou `canAccessAdminPath` em rotas e componentes sensíveis.