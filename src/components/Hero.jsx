import React, { useEffect, useRef } from "react";
import leftImg from "../assets/left.png";
import middleImg from "../assets/middle.png";
import rightImg from "../assets/right.png";
import "./Hero.css";

export default function Hero() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
        const lerp = (a, b, t) => a + (b - a) * t;
        const mapRange = (inMin, inMax, outMin, outMax, value) => {
            if (inMax === inMin) return outMin;
            let t = (value - inMin) / (inMax - inMin);
            t = clamp(t, 0, 1);
            return lerp(outMin, outMax, t);
        };

        let ticking = false;

        function update() {
            const rect = section.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const maxScroll = rect.height - window.innerHeight;
            const raw = clamp(window.scrollY - sectionTop, 0, Math.max(0, maxScroll));
            const p = maxScroll > 0 ? raw / maxScroll : 0; // progress 0..1

            // Get actual card width from CSS (middle element)
            const middleEl = section.querySelector(".middle");
            const leftEl = section.querySelector(".left");
            const rightEl = section.querySelector(".right");
            if (!middleEl || !leftEl || !rightEl) return;

            const cardWidth = middleEl.offsetWidth;
            const gap = 40; // spacing between cards
            const shift = (cardWidth + gap);

            // Middle grows: 0.28 -> 1 scale (0..0.35)
            const middleScale = mapRange(0, 0.35, 0.28, 1, p);
            const middleY = mapRange(0, 0.35, 0, 60, p);

            // Left/right come out only enough to sit side-by-side
            const sideOpacity = mapRange(0.25, 0.45, 0, 1, p);
            const leftX = mapRange(0.35, 0.6, 0, -shift, p);
            const rightX = mapRange(0.35, 0.6, 0, shift, p);

            // match middle’s scale while appearing
            const sideScale = Math.min(1, middleScale);

            // Apply transforms
            middleEl.style.transform = `translate(-50%,-50%) translateY(${middleY}px) scale(${middleScale})`;

            leftEl.style.transform = `translate(-50%,-50%) translateX(${leftX}px) scale(${sideScale})`;
            leftEl.style.opacity = sideOpacity;

            rightEl.style.transform = `translate(-50%,-50%) translateX(${rightX}px) scale(${sideScale})`;
            rightEl.style.opacity = sideOpacity;
        }

        function onScroll() {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
            }
        }

        update(); // set initial state
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <section ref={sectionRef} className="hero-section">
            <div className="hero-stage">
                <img src={leftImg} alt="left" className="img left" draggable="false" />
                <img src={middleImg} alt="middle" className="img middle" draggable="false" />
                <img src={rightImg} alt="right" className="img right" draggable="false" />
            </div>
        </section>
    );
}
