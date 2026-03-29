import Link from 'next/link';
import Image from 'next/image';
import { getCachedPublishedPostsList } from '@/lib/cache/blog-public';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Neto Serviços',
  description: 'Artigos sobre gráfica, design e presença digital.',
};

function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getCachedPublishedPostsList();

  return (
    <div className="bg-branco min-h-screen">
      <section className="bg-grafite text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-center">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Início
            </Link>{' '}
            / Blog
          </div>
          <h1 className="text-5xl lg:text-6xl font-titulo font-bold mb-6">Blog</h1>
          <p className="text-xl text-t-white-70 max-w-2xl mx-auto">
            Conteúdo sobre comunicação, design e tecnologia.
          </p>
        </div>
      </section>

      <div className="container-custom py-16">
        {!posts?.length ? (
          <p className="text-center text-t-secondary text-lg">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const tags = parseTags(post.tags);
              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] bg-grafite-soft/10">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 33vw"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-t-muted text-sm">
                        Sem imagem
                      </div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wide text-laranja">{post.category}</span>
                      {tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs bg-grafite-soft/10 text-t-secondary px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-titulo font-bold text-t-primary mb-2 line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-laranja transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-t-secondary text-sm line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-t-muted pt-4 border-t border-black/5">
                      <span>{post.author?.name || 'Equipe'}</span>
                      <span>{post.readTime} min leitura</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
