"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export function PortfolioHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
    const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

    const maskImage = useMotionTemplate`radial-gradient(circle 800px at ${springX}px ${springY}px, black 0%, transparent 100%)`;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <section className="relative w-full min-h-screen flex flex-col md:flex-row border-b border-border/10 overflow-hidden bg-background">
            {/* Left Column: Typography & Info */}
            <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-24 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="mb-12 flex flex-col gap-2 md:gap-4">
                        <span className="font-oswald text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white/80">
                            HI THERE,
                        </span>
                        <h1 className="font-oswald text-6xl md:text-8xl lg:text-[10rem] uppercase leading-[0.85] tracking-tighter">
                            I'M JOSEF!
                        </h1>
                    </div>
                    <div className="max-w-xl">
                        <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed mb-16 tracking-wide">
                            A <span className="text-white font-medium">UI/UX Engineer</span> dedicated to crafting intuitive, visually-driven digital experiences. Fueled by a growth mindset and an adaptable approach to emerging technologies, I transform complex challenges into elegant solutions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <Link
                                href="#work"
                                className="group flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest py-4 px-8 border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto whitespace-nowrap"
                            >
                                View Selected Works
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/about"
                                className="group flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest py-4 px-8 border border-transparent hover:border-white/20 hover:bg-white/5 text-muted-foreground hover:text-white transition-all duration-300 w-full sm:w-auto whitespace-nowrap"
                            >
                                About Me
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Connect Section (Inspired by yiannifive) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-24 md:mt-auto pt-16 border-t border-border/5"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8 block">Connect</span>
                    <div className="flex flex-col gap-4">
                        {[
                            { name: "+63-977-738-9118", icon: <Phone className="w-4 h-4" />, href: "tel:+639777389118" },
                            { name: "andreinicolas0816@gmail.com", icon: <Mail className="w-4 h-4" />, href: "mailto:andreinicolas0816@gmail.com" },
                            { name: "linkedin.com/in/andreinclas", icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/in/andreinclas" },
                            { name: "instagram.com/sitcho_pages", icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com/sitcho_pages" },
                        ].map((link, i) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="group flex items-center justify-between border-b border-border/5 py-2 hover:border-white/20 transition-colors"
                            >
                                <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                                <span className="opacity-30 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Imagery */}
            <div className="flex-1 relative flex items-center justify-center p-8 md:p-16 lg:p-24 bg-zinc-950/50">
                <div
                    className="relative w-full h-[60vh] md:h-full max-h-[800px] rounded-2xl overflow-hidden cursor-crosshair group shadow-2xl border border-white/5"
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                >
                    {/* Default Image (Bottom layer) */}
                    <Image
                        src="/hero_image/default.avif"
                        alt="End of Day Default"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                        priority
                    />

                    {/* Jedi Image (Top layer, revealed by spotlight) */}
                    <motion.div
                        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                            WebkitMaskImage: maskImage,
                            maskImage: maskImage,
                        }}
                    >
                        <Image
                            src="/hero_image/jedi.avif"
                            alt="End of Day Reveal"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                            priority
                        />
                    </motion.div>

                    {/* Subtle noise/slit-scan overlay placeholder or simple gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-40 pointer-events-none z-20" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />

                    {/* Floating Tag */}
                    <div className="absolute bottom-6 right-6 mix-blend-difference z-30 pointer-events-none">
                        <span className="text-[10px] uppercase tracking-widest text-white/50">Yes, I am a Jedi</span>
                    </div>

                    {/* Hover Hint Label */}
                    <motion.div
                        className="absolute top-6 left-6 z-30 pointer-events-none bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hidden sm:block"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Hover to Reveal
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
