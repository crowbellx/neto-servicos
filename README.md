<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Neto Servicos - Setup local

Aplicacao Next.js com painel administrativo e backend Prisma.

## Prerequisitos

- Node.js 20+
- Projeto Supabase com banco Postgres ativo

## Configuracao de ambiente

1. Instale dependencias:
   `npm install`
2. Crie o arquivo `.env.local` baseado em `.env.example`.
3. Crie um projeto no [Supabase](https://supabase.com/dashboard), copie o `PROJECT_REF` e gere as chaves em `Project Settings > API`.
4. Preencha as variaveis:
   - `DATABASE_URL`: string com pooler do Supabase (`:6543`)
   - `DIRECT_URL`: conexao direta do Supabase (`:5432`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (apenas backend)
   - `SUPABASE_STORAGE_BUCKET` (ex.: `media`)
   - `AUTH_SECRET`
   - `GEMINI_API_KEY` (se usar recursos IA)
5. Crie o bucket no `Supabase Storage` com o mesmo nome definido em `SUPABASE_STORAGE_BUCKET` e habilite como público para uso de `publicUrl`.
6. Perfis com permissao para upload/exclusao de mídia: `EDITOR`, `ADMIN`, `SUPER_ADMIN`.

## Prisma + Supabase

1. Gere o client Prisma:
   `npm run prisma:generate`
2. Aplique migrations no banco:
   `npm run prisma:migrate`
3. (Opcional) Abrir Prisma Studio:
   `npm run prisma:studio`

Para deploy em producao:

- Rode `npm run prisma:deploy` no pipeline antes de subir a aplicacao.

## Rodar aplicacao

`npm run dev`

## Cliente Supabase no codigo

Helpers prontos em:

- `lib/supabase/client.ts` (browser/client components)
- `lib/supabase/server.ts` (server actions/server components)
- `lib/supabase/admin.ts` (uso server-only com service role)

## Upload de mídia (Supabase Storage)

- Endpoint: `POST /api/upload`
- Limites: até `10` arquivos por request, `10MB` por arquivo
- Tipos aceitos: `image/jpeg`, `image/png`, `image/webp`
- Exclusao: `DELETE /api/media/:id` remove banco + storage

## Politicas SQL (producao)

Para configurar bucket + policies no Supabase:

1. Abra `SQL Editor` no dashboard do Supabase.
2. Execute o script `supabase/storage-policies.sql`.
3. Verifique se o bucket criado bate com `SUPABASE_STORAGE_BUCKET` no `.env.local`.

Observacoes:

- O app usa `service_role` no backend para upload/exclusao, entao operacoes server-side funcionam mesmo com RLS restrita.
- As policies garantem leitura publica do bucket `media` e escrita/exclusao apenas para usuarios autenticados.
