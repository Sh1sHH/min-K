export function CallToAction() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-[#4c3b4d]/20 via-transparent to-transparent"
        style={{
          background: 'radial-gradient(circle at center, rgba(76, 59, 77, 0.2) 0%, transparent 70%)'
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-4xl font-semibold text-foreground mb-8">
          Ready to make your website stand out?
        </h2>
        
        {/* Button with glow effect */}
        <a
          href="#"
          className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium 
                   bg-[#e5fb79] text-black hover:bg-[#d8ee6c] transition-colors
                   rounded shadow-[0_0_30px_rgba(229,251,121,0.4)]"
        >
          WORK WITH ME
        </a>
      </div>
    </section>
  );
} 