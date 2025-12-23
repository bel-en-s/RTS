// src/Components/Transition/Transition.jsx
import { useRef, useImperativeHandle, forwardRef, useContext, createContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TransitionContext = createContext();
export const useTransition = () => useContext(TransitionContext);

const Transition = forwardRef(({ children, enabled, lenisRef }, ref) => {
  const curtainRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAnimating = useRef(false);
  const lastPathname = useRef(location.pathname);

  // Función principal de navegación
  const go = (to, callback) => {
    if (isAnimating.current || to === location.pathname) return;
    
    isAnimating.current = true;
    if (lenisRef.current) lenisRef.current.stop();

    const tl = gsap.timeline();
    tl.to(curtainRef.current, {
      y: '0%',
      duration: 0.6,
      ease: 'power4.inOut',
    })
    .add(() => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      lastPathname.current = to; // Actualizamos la referencia antes de navegar
      navigate(to);
      window.scrollTo(0, 0);
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    })
    .to(curtainRef.current, {
      y: '-100%',
      duration: 0.7,
      ease: 'power3.out',
      delay: 0.3,
      onComplete: () => {
        if (lenisRef.current) lenisRef.current.start();
        ScrollTrigger.refresh();
        isAnimating.current = false;
        callback?.();
      },
    });
  };

  // EFECTO PARA DETECTAR BOTÓN ATRÁS/ADELANTE
  useEffect(() => {
    // Si la ruta cambió pero NO fue a través de la función go()
    if (location.pathname !== lastPathname.current) {
      // Opcional: Si quieres que el botón atrás TAMBIÉN tenga telón,
      // la lógica es compleja porque el cambio de URL ya ocurrió.
      // Lo más limpio es sincronizar la referencia:
      lastPathname.current = location.pathname;
      
      // Forzamos limpieza de ScrollTrigger en cambios de historial
      ScrollTrigger.getAll().forEach(t => t.kill());
      ScrollTrigger.refresh();
    }
  }, [location.pathname]);

  useImperativeHandle(ref, () => ({ go }));

  return (
    <TransitionContext.Provider value={{ go }}>
      <div className="transition-wrapper" style={{ position: 'relative' }}>
        {children}
        <div
          ref={curtainRef}
          className="page-transition-curtain"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000102',
            transform: 'translateY(-100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      </div>
    </TransitionContext.Provider>
  );
});

export default Transition;