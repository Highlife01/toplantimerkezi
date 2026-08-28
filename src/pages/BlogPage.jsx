import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export default function BlogPage({ onOpenQuoteModal }) {
  useEffect(() => {
    updatePageSeo({
      title: 'Kurumsal Etkinlik & Toplantı Rehberi | Toplantı Merkezi Blog',
      description: 'Bayi toplantısı nasıl organize edilir, maliyet nasıl hesaplanır, kongre mekânı seçimi ve şirket organizasyonu püf noktaları.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/blog'
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">Rehber & Blog</span>
        </div>

        <SectionTitle
          badge="Bilgi Merkezi & Sektörel Rehberler"
          title="Kurumsal Etkinlik ve Toplantı Kılavuzu"
          subtitle="Toplantı bütçelemesinden sahne tasarımına, kurumsal organizasyonlarınızı başarıya ulaştıracak profesyonel ipuçları ve analizler."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {BLOG_POSTS.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-amber-600" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-amber-600" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition font-display mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Rehberi Okuyun</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
