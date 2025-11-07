import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';
import ScrollToPlugin from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

const ENABLE_CONFIG_UI = false;

const config = {
  theme: 'system',
  animate: true,
  snap: false,
  start: gsap.utils.random(0, 100, 1),
  end: gsap.utils.random(900, 1000, 1),
  scroll: true,
  debug: false };


let ctrl;
if (ENABLE_CONFIG_UI) {
  ctrl = new Pane({
    title: 'Config',
    expanded: false
  });
}


let items;
let scrollerScrub;
let dimmerScrub;
let chromaEntry;
let chromaExit;

const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.syncScrollbar = config.scroll;
  document.documentElement.dataset.animate = config.animate;
  document.documentElement.dataset.snap = config.snap;
  document.documentElement.dataset.debug = config.debug;
  document.documentElement.style.setProperty('--start', config.start);
  document.documentElement.style.setProperty('--hue', config.start);
  document.documentElement.style.setProperty('--end', config.end);

  if (!config.animate) {var _chromaEntry, _chromaExit, _dimmerScrub, _scrollerScrub;
    (_chromaEntry = chromaEntry) === null || _chromaEntry === void 0 ? void 0 : _chromaEntry.scrollTrigger.disable(true, false);
    (_chromaExit = chromaExit) === null || _chromaExit === void 0 ? void 0 : _chromaExit.scrollTrigger.disable(true, false);
    (_dimmerScrub = dimmerScrub) === null || _dimmerScrub === void 0 ? void 0 : _dimmerScrub.disable(true, false);
    (_scrollerScrub = scrollerScrub) === null || _scrollerScrub === void 0 ? void 0 : _scrollerScrub.disable(true, false);
    gsap.set(items, { opacity: 1 });
    gsap.set(document.documentElement, { '--chroma': 0 });
  } else {
    if (items) {
      gsap.set(items, { opacity: i => i !== 0 ? 0.2 : 1 });
    }
    if (dimmerScrub) dimmerScrub.enable(true, true);
    if (scrollerScrub) scrollerScrub.enable(true, true);
    if (chromaEntry) chromaEntry.scrollTrigger.enable(true, true);
    if (chromaExit) chromaExit.scrollTrigger.enable(true, true);
  }
};

const sync = event => {
  if (
  !document.startViewTransition ||
  event.target.controller.view.labelElement.innerText !== 'Theme')

  return update();
  document.startViewTransition(() => update());
};
if (ENABLE_CONFIG_UI) {
  ctrl.addBinding(config, 'animate', {
    label: 'Animate' });

  ctrl.addBinding(config, 'snap', {
    label: 'Snap' });

  ctrl.addBinding(config, 'start', {
    label: 'Hue Start',
    min: 0,
    max: 1000,
    step: 1 });

  ctrl.addBinding(config, 'end', {
    label: 'Hue End',
    min: 0,
    max: 1000,
    step: 1 });

  ctrl.addBinding(config, 'scroll', {
    label: 'Scrollbar' });

  ctrl.addBinding(config, 'debug', {
    label: 'Debug' });

  ctrl.addBinding(config, 'theme', {
    label: 'Theme',
    options: {
      System: 'system',
      Light: 'light',
      Dark: 'dark' } });

  ctrl.on('change', sync);
}

// backfill the scroll functionality with GSAP
if (
!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)'))
{
  gsap.registerPlugin(ScrollTrigger);

  // animate the items with GSAP if there's no CSS support
  items = gsap.utils.toArray('ul li');

  gsap.set(items, { opacity: i => i !== 0 ? 0.2 : 1 });

  const dimmer = gsap.
  timeline().
  to(items.slice(1), {
    opacity: 1,
    stagger: 0.5 }).

  to(
  items.slice(0, items.length - 1),
  {
    opacity: 0.2,
    stagger: 0.5 },

  0);


  dimmerScrub = ScrollTrigger.create({
    trigger: items[0],
    endTrigger: items[items.length - 1],
    start: 'center center',
    end: 'center center',
    animation: dimmer,
    scrub: 0.2 });


  // register scrollbar changer
  const scroller = gsap.timeline().fromTo(
  document.documentElement,
  {
    '--hue': config.start },

  {
    '--hue': config.end,
    ease: 'none' });



  scrollerScrub = ScrollTrigger.create({
    trigger: items[0],
    endTrigger: items[items.length - 1],
    start: 'center center',
    end: 'center center',
    animation: scroller,
    scrub: 0.2 });


  chromaEntry = gsap.fromTo(
  document.documentElement,
  {
    '--chroma': 0 },

  {
    '--chroma': 0.3,
    ease: 'none',
    scrollTrigger: {
      scrub: 0.2,
      trigger: items[0],
      start: 'center center+=40',
      end: 'center center' } });



  chromaExit = gsap.fromTo(
  document.documentElement,
  {
    '--chroma': 0.3 },

  {
    '--chroma': 0,
    ease: 'none',
    scrollTrigger: {
      scrub: 0.2,
      trigger: items[items.length - 2],
      start: 'center center',
      end: 'center center-=40' } });



}

// Force scroll to top on page load/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Automatic scroll to vuosq title on page load
window.addEventListener('load', () => {
  // Ensure we're at the top before starting animation
  window.scrollTo(0, 0);
  
  // Wait 1 second before starting the scroll animation
  setTimeout(() => {
    // Calculate the maximum scrollable distance (bottom of the page)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Custom smooth scroll animation using GSAP
    gsap.to(window, {
      duration: 22,
      scrollTo: { y: maxScroll, autoKill: false },
      ease: 'power2.inOut',
      onStart: () => console.log('Scroll animation started'),
      onComplete: () => console.log('Scroll complete')
    });
  }, 1000);
});

// run it
update();