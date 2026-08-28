import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../data/blogData';
import SectionTitle from '../common/SectionTitle';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogPreview() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Bilgi Merkezi & SEO Rehberleri"
          title="Kurumsal Etkinlik & Toplantı Rehberi"
          subtitle="Bayi toplantısı bütçelemesinden kongre mekânı seçimine, uzman ekibimiz tarafından hazırlanan sektörel rehberler."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/40 text-amber-400 text-[11px] font-bold">
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

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition font-display mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Rehberi Oku</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-sm hover:border-amber-400 transition"
          >
            <span>Tüm Makale ve Rehberleri İncele</span>
            <ArrowRight size={14} className="text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
}
