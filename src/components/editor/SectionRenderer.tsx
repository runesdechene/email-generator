import type { EmailSection } from '../../types';

interface SectionRendererProps {
  section: EmailSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.templateId) {
    case 'hero':
      return <HeroSection section={section} />;
    case 'text':
      return <TextSection section={section} />;
    case 'image':
      return <ImageSection section={section} />;
    case 'cta':
      return <CTASection section={section} />;
    case 'product':
      return <ProductSection section={section} />;
    case 'footer':
      return <FooterSection section={section} />;
    default:
      return <DefaultSection section={section} />;
  }
}

function HeroSection({ section }: SectionRendererProps) {
  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-12 text-center">
      <h1 className="text-3xl font-bold text-white mb-4">
        {(section.content.title as string) || 'Titre Principal'}
      </h1>
      <p className="text-violet-100 text-lg mb-6">
        {(section.content.subtitle as string) || 'Sous-titre de votre email'}
      </p>
      <button className="bg-white text-violet-600 px-8 py-3 rounded-full font-semibold hover:bg-violet-50 transition-colors">
        {(section.content.buttonText as string) || 'Découvrir'}
      </button>
    </div>
  );
}

function TextSection({ section }: SectionRendererProps) {
  return (
    <div className="bg-white p-8">
      <h2 className="text-xl font-semibold text-zinc-800 mb-4">
        {(section.content.title as string) || 'Titre de section'}
      </h2>
      <p className="text-zinc-600 leading-relaxed">
        {(section.content.text as string) ||
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
      </p>
    </div>
  );
}

function ImageSection({ section }: SectionRendererProps) {
  return (
    <div className="bg-zinc-100">
      {section.content.imageUrl ? (
        <img
          src={section.content.imageUrl as string}
          alt={section.content.alt as string || 'Image'}
          className="w-full h-auto"
        />
      ) : (
        <div className="h-64 flex items-center justify-center bg-zinc-200">
          <p className="text-zinc-400">Image placeholder</p>
        </div>
      )}
    </div>
  );
}

function CTASection({ section }: SectionRendererProps) {
  return (
    <div className="bg-zinc-900 p-10 text-center">
      <h2 className="text-2xl font-bold text-white mb-3">
        {(section.content.title as string) || 'Passez à l\'action'}
      </h2>
      <p className="text-zinc-400 mb-6">
        {(section.content.text as string) || 'Ne manquez pas cette opportunité'}
      </p>
      <button className="bg-emerald-500 text-white px-10 py-4 rounded-lg font-semibold hover:bg-emerald-400 transition-colors">
        {(section.content.buttonText as string) || 'Commander maintenant'}
      </button>
    </div>
  );
}

function ProductSection({ section }: SectionRendererProps) {
  return (
    <div className="bg-white p-8 flex gap-6">
      <div className="w-32 h-32 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {section.content.imageUrl ? (
          <img
            src={section.content.imageUrl as string}
            alt="Produit"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-zinc-400 text-xs">Image</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-zinc-800">
          {(section.content.productName as string) || 'Nom du produit'}
        </h3>
        <p className="text-zinc-500 text-sm mt-1">
          {(section.content.description as string) || 'Description du produit'}
        </p>
        <p className="text-xl font-bold text-violet-600 mt-3">
          {(section.content.price as string) || '29,99 €'}
        </p>
      </div>
    </div>
  );
}

function FooterSection({ section }: SectionRendererProps) {
  return (
    <div className="bg-zinc-800 p-8 text-center">
      <p className="text-zinc-400 text-sm">
        {(section.content.text as string) || '© 2024 Votre Entreprise. Tous droits réservés.'}
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <a href="#" className="text-zinc-500 hover:text-white text-sm">
          Mentions légales
        </a>
        <a href="#" className="text-zinc-500 hover:text-white text-sm">
          Se désabonner
        </a>
      </div>
    </div>
  );
}

function DefaultSection({ section }: SectionRendererProps) {
  return (
    <div className="bg-zinc-50 p-8 text-center">
      <p className="text-zinc-400">
        Section: {section.name} (Template: {section.templateId})
      </p>
    </div>
  );
}
