import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { Calendar, Clock, Tag, ArrowRight, Sparkles, BookOpen, Share2 } from 'lucide-react';

export default function BlogDetailPage({ onOpenQuoteModal }) {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      updatePageSeo({
        title: `${post.title} | Toplantı Merkezi Rehber`,
        description: post.summary,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/blog/${post.slug}`,
        schemaType: 'BlogPosting',
        schemaData: {
          headline: post.title,
          description: post.summary,
          image: post.image,
          datePublished: '2026-08-20',
          author: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi Kurumsal Masası'
          }
        }
      });
      window.scrollTo(0, 0);
    }
  }, [post, slug]);

  if (!post) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Makale Bulunamadı</h2>
        <p className="text-sm text-slate-600 mt-2">Aradığınız rehber yazısı mevcut değil.</p>
        <Link to="/blog" className="mt-6 inline-block px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs">
          Tüm Rehberleri Gör
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-amber-700">Rehber & Blog</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold truncate">{post.title}</span>
        </div>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Tag size={12} />
            <span>{post.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-display leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-amber-600" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-600" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200 max-h-[460px]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-md mb-12">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 font-display pt-4 border-t border-slate-100">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display pt-6 border-t border-slate-100">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={idx} className="text-slate-700 leading-relaxed font-normal">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-8 mt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Etiketler:</span>
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* In-Article Fast CTA */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-white font-display">
              Organizasyonunuzu Birlikte Planlayalım
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              81 ilde profesyonel bayi toplantısı ve şirket organizasyonlarınız için hemen fiyat teklifi alın.
            </p>
          </div>

          <button
            onClick={() => onOpenQuoteModal({ initialOrgType: post.category })}
            className="shrink-0 px-7 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition"
          >
            Hızlı Teklif Al
          </button>
        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
