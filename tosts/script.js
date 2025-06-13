gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother = ScrollSmoother.create({
    smooth: 2,
    effects: true
});

gsap.from('.draw', {
    drawSVG: "0%",
    ease: "expo.out",
    scrollTrigger: {
        trigger: '.heading',
        start: "clamp(top center)",
        scrub: true,
        pin: '.pin',
        pinSpacing: false,
    }
})

















// little setup - ignore
gsap.set(".logo svg", { opacity: 1 })
