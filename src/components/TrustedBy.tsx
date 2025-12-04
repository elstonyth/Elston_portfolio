import React from 'react';
import { motion } from 'framer-motion';

// Tech icons as simple SVG components
const TechIcons: Record<string, React.FC<{ className?: string }>> = {
  React: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
      <path d="M12 21.35c-1.65 0-3.2-.15-4.55-.42-1.35-.27-2.5-.68-3.4-1.18-.9-.5-1.55-1.1-1.9-1.75-.35-.65-.35-1.35 0-2 .35-.65 1-1.25 1.9-1.75.9-.5 2.05-.9 3.4-1.18 1.35-.27 2.9-.42 4.55-.42s3.2.15 4.55.42c1.35.27 2.5.68 3.4 1.18.9.5 1.55 1.1 1.9 1.75.35.65.35 1.35 0 2-.35.65-1 1.25-1.9 1.75-.9.5-2.05.9-3.4 1.18-1.35.27-2.9.42-4.55.42Zm0-1.5c3.87 0 7-1.12 7-2.5s-3.13-2.5-7-2.5-7 1.12-7 2.5 3.13 2.5 7 2.5Z"/>
      <path d="M8.2 17.6c.82 1.43 1.8 2.7 2.85 3.7.52.5 1.05.92 1.55 1.25.5.33.97.55 1.4.65.43.1.8.05 1.1-.15.3-.2.5-.5.6-.9-.1-.4-.1-.9 0-1.45-.1-.55-.3-1.15-.6-1.8.3-.65.7-1.35 1.2-2.05.5-.7 1.1-1.4 1.8-2.1.7-.7 1.4-1.3 2.1-1.8.7-.5 1.4-.9 2.05-1.2.65-.3 1.25-.5 1.8-.6.55-.1 1.05-.1 1.45 0 .4.1.7.3.9.6.2.3.25.67.15 1.1.1.43.32.9.65 1.4.33.5.75 1.03 1.25 1.55 1 1.05 2.27 2.03 3.7 2.85Zm.75-1.3c-1.18-.68-2.2-1.48-3-2.28-.4-.4-.73-.78-.98-1.13-.25-.35-.42-.65-.5-.9-.08-.25-.07-.42.02-.52.1-.1.27-.1.52-.02.25.08.55.25.9.5.35.25.73.58 1.13.98.8.8 1.6 1.82 2.28 3 .68 1.18 1.2 2.4 1.48 3.4.14.5.2.93.2 1.27 0 .34-.08.58-.22.7-.14.12-.38.13-.72.02-.34-.11-.77-.35 1.27-.7 1-.5 2.22-1.3 3.4-2.28Z"/>
      <path d="M15.8 17.6c-.82 1.43-1.8 2.7-2.85 3.7-.52.5-1.05.92-1.55 1.25-.5.33-.97.55-1.4.65-.43.1-.8.05-1.1-.15-.3-.2-.5-.5-.6-.9-.1-.4-.1-.9 0-1.45.1-.55.3-1.15.6-1.8.3-.65.7-1.35 1.2-2.05.5-.7 1.1-1.4 1.8-2.1.7-.7 1.4-1.3 2.1-1.8.7-.5 1.4-.9 2.05-1.2.65-.3 1.25-.5 1.8-.6.55-.1 1.05-.1 1.45 0 .4.1.7.3.9.6.2.3.25.67.15 1.1-.1.43-.32.9-.65 1.4-.33.5-.75 1.03-1.25 1.55-1 1.05-2.27 2.03-3.7 2.85Zm-.75-1.3c1.18-.68 2.2-1.48 3-2.28.4-.4.73-.78.98-1.13.25-.35.42-.65.5-.9.08-.25.07-.42-.02-.52-.1-.1-.27-.1-.52-.02-.25.08-.55.25-.9.5-.35.25-.73.58-1.13.98-.8.8-1.6 1.82-2.28 3-.68 1.18-1.2 2.4-1.48 3.4-.14.5-.2.93-.2 1.27 0 .34.08.58.22.7.14.12.38.13.72.02.34-.11.77-.35 1.27-.7 1-.5 2.22-1.3 3.4-2.28Z"/>
    </svg>
  ),
  Python: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.913 0ZM8.708 1.85c.578 0 1.046.47 1.046 1.052 0 .58-.468 1.051-1.046 1.051-.579 0-1.046-.47-1.046-1.051 0-.582.467-1.052 1.046-1.052Z"/>
      <path d="M12.087 24c6.093 0 5.713-2.656 5.713-2.656l-.007-2.752h-5.814v-.826h8.121s3.9.445 3.9-5.735c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42H9.45s-3.24-.052-3.24 3.148v5.292S5.72 24 12.087 24Zm3.206-1.85c-.578 0-1.046-.47-1.046-1.052 0-.58.468-1.051 1.046-1.051.579 0 1.046.47 1.046 1.051 0 .582-.467 1.052-1.046 1.052Z"/>
    </svg>
  ),
  TypeScript: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 12v12h24V0H0v12Zm19.341-.956c.61.152 1.074.423 1.501.865.221.236.549.666.575.77.008.03-1.036.73-1.668 1.123-.023.015-.115-.084-.217-.236-.31-.45-.633-.644-1.128-.678-.728-.05-1.196.331-1.192.967a.88.88 0 0 0 .102.45c.16.331.458.53 1.39.933 1.719.74 2.454 1.227 2.911 1.92.51.773.625 2.008.278 2.926-.38 1.002-1.325 1.681-2.67 1.92-.415.073-1.399.062-1.836-.018-.95-.172-1.847-.628-2.443-1.241-.232-.238-.654-.837-.622-.9.013-.016.11-.076.216-.14l.873-.506.678-.39.141.204c.196.292.59.672.862.833.78.46 1.854.397 2.381-.116.224-.218.314-.455.314-.784 0-.301-.033-.439-.16-.648-.18-.293-.543-.506-1.64-.96-1.254-.52-1.794-.832-2.304-1.332a3.09 3.09 0 0 1-.659-1.073c-.112-.333-.138-.468-.138-.978 0-.502.022-.64.116-.937.36-1.14 1.27-1.907 2.526-2.131.415-.073 1.38-.048 1.793.048Zm-5.994 1.087.008 1.019h-3.22v9.14H7.283v-9.14H4.063v-.994c0-.55.012-1.007.026-1.023.012-.02 2.087-.031 4.604-.027l4.58.012.074 1.013Z"/>
    </svg>
  ),
  SQL: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4Zm0 2c4.42 0 8 1.12 8 2.5S16.42 9 12 9 4 7.88 4 6.5 7.58 4 12 4Zm8 14c0 1.38-3.58 2.5-8 2.5S4 19.38 4 18v-2.29c1.77 1.06 4.71 1.79 8 1.79s6.23-.73 8-1.79V18Zm0-5c0 1.38-3.58 2.5-8 2.5S4 14.38 4 13v-2.29c1.77 1.06 4.71 1.79 8 1.79s6.23-.73 8-1.79V13Zm0-5c0 1.38-3.58 2.5-8 2.5S4 9.38 4 8V6c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v2Z"/>
    </svg>
  ),
  Docker: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185Zm-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.186Zm0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186Zm-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186Zm-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186Zm5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185Zm-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185Zm-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186h-2.119a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185Zm-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185ZM23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.97-.087 2.944-.259a12.01 12.01 0 0 0 3.947-1.416 10.143 10.143 0 0 0 2.683-2.282c1.187-1.36 1.89-2.87 2.397-4.165h.206c1.29 0 2.086-.517 2.527-.952.29-.282.52-.621.676-.994l.093-.285-.314-.222Z"/>
    </svg>
  ),
  GCP: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-8.825-6.893Zm.11 2.272a7.127 7.127 0 0 1 6.737 5.473l.168.63.63.153a4.108 4.108 0 0 1-.233 8.04h-5.15l-.03-.03H9.196a4.473 4.473 0 0 1-2.715-.91l-.007.007c-2.332-1.726-2.299-5.373.247-7.082l.503-.379.082-.593A7.086 7.086 0 0 1 12.3 4.653Z"/>
    </svg>
  ),
  Git: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.546 10.93 13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.6 0 1.846 1.846 0 0 1-.404-2.019l-2.48-2.48v6.535a1.84 1.84 0 0 1 .495.297 1.838 1.838 0 0 1 0 2.6 1.838 1.838 0 0 1-2.6 0 1.838 1.838 0 0 1 0-2.6c.18-.18.39-.316.62-.403V9.203a1.838 1.838 0 0 1-1.001-2.406L7.636 4.045.452 11.23a1.55 1.55 0 0 0 0 2.188l10.48 10.477a1.55 1.55 0 0 0 2.186 0l10.428-10.428a1.55 1.55 0 0 0 0-2.537Z"/>
    </svg>
  ),
  Figma: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491ZM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51Zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981Zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148Zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98Zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.355 3.019 3.019 3.019h3.117V8.981H8.148Zm0 15.019c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.588 4.539Zm0-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.355 3.019 3.019 3.019c1.665 0 3.019-1.355 3.019-3.019v-3.02H8.148Zm7.704-7.509c-2.476 0-4.49 2.014-4.49 4.49s2.014 4.49 4.49 4.49 4.49-2.014 4.49-4.49-2.014-4.49-4.49-4.49Zm0 7.509c-1.665 0-3.019-1.355-3.019-3.019s1.355-3.019 3.019-3.019 3.019 1.355 3.019 3.019-1.354 3.019-3.019 3.019Z"/>
    </svg>
  ),
};

// Tech categories with items
const categories = [
  {
    name: "Data & Analytics",
    color: "from-blue-500 to-cyan-400",
    items: [
      { name: "Python", icon: "Python" },
      { name: "SQL", icon: "SQL" },
      { name: "Pandas", icon: "Python" },
      { name: "NumPy", icon: "Python" },
    ]
  },
  {
    name: "Frontend",
    color: "from-cyan-400 to-blue-500",
    items: [
      { name: "React", icon: "React" },
      { name: "TypeScript", icon: "TypeScript" },
      { name: "Tailwind", icon: "React" },
      { name: "Next.js", icon: "React" },
    ]
  },
  {
    name: "Backend & APIs",
    color: "from-emerald-400 to-teal-500",
    items: [
      { name: "Node.js", icon: "Python" },
      { name: "FastAPI", icon: "Python" },
      { name: "REST APIs", icon: "SQL" },
    ]
  },
  {
    name: "DevOps & Cloud",
    color: "from-orange-400 to-rose-500",
    items: [
      { name: "Docker", icon: "Docker" },
      { name: "GCP", icon: "GCP" },
      { name: "Git", icon: "Git" },
      { name: "Linux", icon: "Docker" },
    ]
  },
  {
    name: "Tools",
    color: "from-purple-400 to-pink-500",
    items: [
      { name: "VS Code", icon: "Figma" },
      { name: "Figma", icon: "Figma" },
      { name: "Notion", icon: "Figma" },
    ]
  }
];

const CategoryCard: React.FC<{
  category: typeof categories[0];
  index: number;
}> = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-500 ease-out bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] backdrop-blur-sm overflow-hidden"
    >
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 rounded-2xl`} />
      
      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Category header */}
      <div className="relative flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gradient-to-r ${category.color} shadow-lg group-hover:scale-125 transition-transform duration-300`} 
          style={{ boxShadow: `0 0 12px rgba(34, 211, 238, 0.3)` }}
        />
        <h3 className="text-[10px] md:text-xs font-mono uppercase tracking-[0.1em] md:tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors duration-300">
          {category.name}
        </h3>
      </div>
      
      {/* Tech items */}
      <div className="relative flex flex-wrap gap-2">
        {category.items.map((item, itemIndex) => {
          const IconComponent = TechIcons[item.icon];
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + itemIndex * 0.05 }}
              whileHover={{ scale: 1.08, y: -3 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-default transition-all duration-300 ease-out bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.2] hover:shadow-[0_4px_20px_rgba(34,211,238,0.15)]"
            >
              {IconComponent && (
                <IconComponent className="w-4 h-4 text-white/50 group-hover:text-cyan-400/80 transition-colors duration-300" />
              )}
              <span className="text-xs md:text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors duration-300">
                {item.name}
              </span>
            </motion.div>
          );
        })}
      </div>
      
      {/* Corner accent */}
      <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-tl ${category.color} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity duration-500`} />
    </motion.div>
  );
};

export const TrustedBy: React.FC = () => {
  return (
    <section className="py-16 md:py-32 overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-xs font-mono uppercase tracking-[0.2em] mb-6 text-cyan-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Technical Expertise
          </motion.p>
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight mb-4 md:mb-5 text-white">
            Tech Stack & Tools
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-white/50 leading-relaxed">
            The technologies I use to build data pipelines, automations, and full-stack applications.
          </p>
        </motion.div>
        
        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.name} 
              category={category} 
              index={index}
            />
          ))}
        </div>
        
        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        />
      </div>
    </section>
  );
};