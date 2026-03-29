import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPublishedPostBySlug } from '@/app/actions/blog';
import PostViewTracker from '@/components/blog/PostViewTracker';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { success, data: post } = await getPublishedPostBySlug(slug);
  if (!success || !post) {
    return { title: 'Artigo | Neto Serviços' };
  }
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    openGraph: post.coverImage ? { images: [{ url: post.coverImage }] } : undefined,
  };
}

function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { success, data: post } = await getPublishedPostBySlug(slug);

  if (!success || !post) {
    notFound();
  }

  const tags = parseTags(post.tags);
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : null;

  return (
    <article className="bg-branco min-h-screen pb-16">
      <PostViewTracker postId={post.id} />

      <section className="bg-grafite text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10 max-w-4xl">
          <div className="text-sm text-t-white-70 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Início
            </Link>{' '}
            /{' '}
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>{' '}
            / <span className="text-white/90 line-clamp-1">{post.title}</span>
          </div>
          <p className="text-laranja text-sm font-bold uppercase tracking-wide mb-3">{post.category}</p>
          <h1 className="text-4xl md:text-5xl font-titulo font-bold mb-6 leading-tight">{post.title}</h1>
          <p className="text-xl text-t-white-70 mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap gap-4 text-sm text-t-white-70">
            <span>{post.author?.name || 'Equipe'}</span>
            {published && <span>{published}</span>}
            <span>{post.readTime} min de leitura</span>
            <span>{post.views} visualizações</span>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((t) => (
                <span key={t} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {post.coverImage && (
        <div className="container-custom max-w-4xl -mt-8 relative z-10 mb-10">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-xl border border-black/5">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 896px"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      <div className="container-custom max-w-3xl">
        <div
          className="prose prose-lg max-w-none prose-headings:font-titulo prose-a:text-laranja text-t-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <div className="container-custom max-w-3xl mt-12 pt-8 border-t border-black/5">
        <Link href="/blog" className="text-laranja font-medium hover:underline">
          ← Voltar ao blog
        </Link>
      </div>
    </article>
  );
}
