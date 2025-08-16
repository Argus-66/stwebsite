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

            // Get container elements
            const middleContainer = section.querySelector(".middle-container");
            const leftContainer = section.querySelector(".left-container");
            const rightContainer = section.querySelector(".right-container");
            const middleText = section.querySelector(".middle-text");
            const leftText = section.querySelector(".left-text");
            const rightText = section.querySelector(".right-text");
            
            if (!middleContainer || !leftContainer || !rightContainer) return;

            const cardWidth = middleContainer.offsetWidth;
            const gap = 40; // spacing between cards
            const shift = (cardWidth + gap);

            // Middle grows: 0.22 -> 1 scale (slower, 0..0.5)
            const middleScale = mapRange(0, 0.5, 0.22, 1, p);
            const middleY = mapRange(0, 0.5, 0, 60, p);

            // Left/right come out only enough to sit side-by-side (slower timing)
            const sideOpacity = mapRange(0.3, 0.7, 0, 1, p);
            const leftX = mapRange(0.4, 0.8, 0, -shift, p);
            const rightX = mapRange(0.4, 0.8, 0, shift, p);

            // match middle’s scale while appearing
            const sideScale = Math.min(1, middleScale);

            // Text visibility logic (slower)
            const sideTextOpacity = mapRange(0.5, 0.8, 0, 1, p);
            
            // Middle text smooth transition from center to bottom
            const middleTextProgress = mapRange(0.5, 0.7, 0, 1, p); // Smooth transition over 50-70% scroll
            const middleTextY = middleTextProgress * 35; // Gradual movement percentage
            
            // Side text positioning - always at bottom when visible
            const sideTextToBottom = p > 0.5;

            // Apply transforms to containers - ensure all cards are on the same horizontal line
            middleContainer.style.transform = `translate(-50%,-50%) translateY(${middleY}px) scale(${middleScale})`;

            leftContainer.style.transform = `translate(-50%,-50%) translateX(${leftX}px) translateY(${middleY}px) scale(${sideScale})`;
            leftContainer.style.opacity = sideOpacity;

            rightContainer.style.transform = `translate(-50%,-50%) translateX(${rightX}px) translateY(${middleY}px) scale(${sideScale})`;
            rightContainer.style.opacity = sideOpacity;

            // Control text visibility and position - different logic for each
            if (leftText) {
                leftText.style.opacity = sideTextOpacity;
                // Side text uses CSS class for bottom positioning
                if (sideTextToBottom) {
                    leftText.classList.add('bottom');
                } else {
                    leftText.classList.remove('bottom');
                }
            }
            if (rightText) {
                rightText.style.opacity = sideTextOpacity;
                // Side text uses CSS class for bottom positioning
                if (sideTextToBottom) {
                    rightText.classList.add('bottom');
                } else {
                    rightText.classList.remove('bottom');
                }
            }
            if (middleText) {
                // Middle text flows DOWN smoothly with scroll
                const middleTextTop = 50 + (middleTextY * 0.8); // Move from 50% to ~78% (bottom area)
                middleText.style.top = `${middleTextTop}%`;
                middleText.style.transform = `translateX(-50%)`;
            }
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
                <div className="card-container left-container">
                    <img src={leftImg} alt="left" className="img left" draggable="false" />
                    <div className="card-text left-text">INTERNSHIPS</div>
                </div>
                <div className="card-container middle-container">
                    <img src={middleImg} alt="middle" className="img middle" draggable="false" />
                    <div className="card-text middle-text">JOB OPENINGS</div>
                </div>
                <div className="card-container right-container">
                    <img src={rightImg} alt="right" className="img right" draggable="false" />
                    <div className="card-text right-text">VOLUNTEER WORKS</div>
                </div>
            </div>
        </section>
    );
}
