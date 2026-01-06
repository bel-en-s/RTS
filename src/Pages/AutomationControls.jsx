
// src/Pages/AutomationControls.jsx

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ApproachButton from "../Components/UI/ApproachButton";
import Accordeon from "../Components/UI/Accordeon";
import BannerText from "../Components/BannerText/BannerText";
import Table from "../Components/UI/Table";
import Banner from "../Components/Banner/Banner";

import bannerOne from "../assets/A&C1.png";
import bannerTwo from "../assets/A&C.png";
import bannerImg from "../assets/Content.png";

import iconPods from "../assets/hub/icon1.png";
import iconEmbedded from "../assets/hub/Pods.png";
import integrationsImg from "../assets/integrations.png";

import "./AutomationControls.css";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    id: "p1",
    title: "Process Automation & Control",
    body:
      "Our core capabilities include process automation, data management, programming and configuration, system design, implementation, and project management.",
  },
  {
    id: "p2",
    title: "Control System Design & Integration",
    body:
      "We provide expert guidance to help clients select, design, and integrate control systems that align with best industry practices. Our expertise covers all DCS and PLC platforms, robust system architectures, and network communications based on industry-standard protocols.",
  },
  {
    id: "p3",
    title: "System Migration & Virtualization",
    body:
      "We deliver migration strategies and virtualization solutions that extend system lifecycles, reduce risks, and optimize performance.",
  },
  {
    id: "p4",
    title: "HMI Design & Virtualization",
    body:
      "We design and implement high-performance HMI solutions tailored to the specific needs of each industry and process environment.",
  },
];

const tableRows = [
  {
    c1: "Experion Architecture\n& Control System",
    c2: "We provide expert guidance to help clients select, design, and ",
    c3: "From system design to logic configuration and safety integration, RTS engineers ensure seamless performance across PKS, TPS, and ControlEdge environments.",
    c4: ["Experion PKS", "TPS", "Control Edge", "Safety Manager"],
  },
  {
    c1: "System Migration\n& Virtualization",
    c2: "We modernize legacy Honeywell systems without losing their DNA.",
    c3: "RTS specializes in migration from TPS to PKS, virtualization of legacy nodes, and upgrade projects across all HPS layers — preserving knowledge while unlocking new performance.",
    c4: ["TPS migration", "Virtualization", "Experion upgrade", "Backup recovery"],
  },
  {
    c1: "Data Integration\n& Operational Intelligence",
    c2: "We extend the value of Honeywell Process Solutions into the digital layer.",
    c3: "Integrating Experion with PI System, Edge gateways, and cloud analytics, RTS connects process control to enterprise intelligence — making operations measurable, visible, and adaptive.",
    c4: [
      "Experion-to-PI integration",
      "Honeywell Digital Twin",
      "Edge/Historian",
      "Secure Remote Access",
    ],
  },
  {
    c1: "SCADA, Visualization\n& Field Implementation",
    c2: "We bring HPS technology to life in the field.",
    c3: "From SCADA configuration to commissioning and validation (FAT/SAT), RTS delivers end-to-end implementation aligned with Honeywell engineering standards and methodologies.",
    c4: ["Experion SCADA", "Honeywell RTU2020", "HC900", "Experion HS"],
  },
];

const engineeringCards = [
  {
    title: "Dedicated Pods",
    body:
      "Multidisciplinary RTS teams (automation, IT/OT, data analytics, commissioning) assigned to targeted objectives — from system migrations to full lifecycle projects.",
    icon: iconPods,
  },
  {
    title: "Embedded Engineers",
    body:
      "Individual RTS specialists integrated into client teams, supporting specific project tasks or long-term maintenance in hybrid or remote modes.",
    icon: iconEmbedded,
  },
  {
    title: "Hybrid Workforce\nas-a-Service",
    body:
      "A combined model with onsite engineers and remote RTS Global Operations support, ensuring 24/7 responsiveness and access to global expertise.",
    icon: iconPods,
  },
];

export default function AutomationControls({ setNavMode }) {

  const whiteZoneRef = useRef(null);
  useEffect(() => {
    const el = whiteZoneRef.current;
    if (!el) return;
  
    const st = ScrollTrigger.create({
      trigger: el,
  
      // Activo EXACTO cuando el wrapper está en viewport (intersección)
      // Si querés que cambie "1 ms antes", le doy 1px de anticipación:
      start: "top bottom-=1",
      end: "bottom top+=1",
  
      invalidateOnRefresh: true,
      refreshPriority: 1,
  
      onToggle: (self) => {
        setNavMode?.(self.isActive ? "light" : "dark");
      },
  
      // Debug opcional:
      // markers: true,
    });
  
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
  
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      st.kill();
    };
  }, [setNavMode]);
  

  return (
    <main className="automation-page">
    
      <section className="layout-automation">
        <div className="automation-hero">
          <h1 className="display-lg">
            <span className="line">AUTOMATION </span>
            <br />
            <span className="line">& CONTROLS</span>
          </h1>

          <p className="title-medium subtitle-hero subtitle-hero--desktop">
            — provide expert guidance to <br />
            design and integrate control systems
          </p>

          <p className="title-small subtitle-hero subtitle-hero--mobile">
            — provide expert <br />
            guidance to design and <br />
            integrate control systems
          </p>
        </div>
      </section>


      <section className="automation-expertiseSection">
        <div className="automation-expertiseLeft">
          <p className="title-medium desktop">
            Devoted to maintaining, innovating,
            <br /> and enhancing industrial control <br />
            systems, we engineer projects across <br /> various industries.
          </p>

            <p className="title-medium mobile">
            Devoted to maintaining, innovating,
           and enhancing  <br /> industrial control 
            systems,<br /> we engineer projects across <br /> various industries.
          </p>

          <ApproachButton label="Book a meeting now" />
      
        </div>

        <div className="automation-expertiseRight">
          <p className="automation-kicker">Key areas of expertise</p>
          <Accordeon items={items} defaultOpen={0} allowCollapse />
        </div>
      </section>



        <BannerText
          imgOne={bannerOne}
          imgTwo={bannerTwo}
          nextLeftItems={[]}
          nextRightItems={[]}
        />
      <div ref={whiteZoneRef}>

        <section className="whiteTableWrap">
          <div className="honeywellElite__inner">
     
            <div className="honeywellElite__left">
              <h2 className="honeywellElite__title headline-medium">
                <span className="highlight-violet">HONEYWELL</span>
                <br />
                ELITE TEAM
                <br />
                WORLDWIDE
              </h2>

              <div className="honeywellElite__media">
                <img
                  className="honeywellElite__img"
                  src={integrationsImg}
                  alt="Honeywell integrations diagram"
                  loading="lazy"
                />
              </div>
            </div>

    
            <div className="honeywellElite__right">
              <p className="honeywellElite__lead title-medium">
                This team ensures that every customer using Honeywell technologies benefits from
                world-class expertise and global support.
              </p>

              <div className="honeywellElite__body">
                <p>
                  At RTS, we support end customers operating with Honeywell technologies by providing
                  integration, configuration, and lifecycle services that ensure safe, reliable, and
                  optimized operations.
                </p>

                <p>
                  To meet the highest quality standards, we established the Honeywell Elite Team — a
                  specialized group of engineers focused on Honeywell Process Solutions (HPS) and the
                  seamless integration of Honeywell platforms with third-party systems.
                </p>

                <h3 className="honeywellElite__subhead">Engineering Services Abroad Department</h3>

                <p>
                  To further extend our reach, we created the Engineering Services Abroad Department,
                  delivering high-performance back-office engineering and implementation support for
                  Honeywell-based operations around the world.
                </p>

                <p>
                  As a Value Added Reseller (VAR) for Honeywell Process Solutions, RTS is also
                  authorized to offer, distribute, and integrate HPS products and hardware, from
                  controllers and field instruments to advanced automation systems.
                </p>
              </div>

              <div className="honeywellElite__cta">
                <ApproachButton label="Book a meeting now" />
              </div>
            </div>
          </div>

          <Table
            title="Capabilities with Honeywell technologies"
            columns={["Service", "Focus", "Description", "Main technologies"]}
            rows={tableRows}
          />
        </section>
      </div>

  
      <section className="automation-expertiseSection automation-expertiseSection--cards">
        <div className="automation-expertiseLeft">
          <h2 className="title-body">RTS engineering Workforce</h2>

          <h1 className="headline-medium">
            AUGMENTED <br />
            <span className="highlight-violet">INDUSTRIAL</span> <br />
            INTELLIGENCE
          </h1>

          <p className="body-default">
            A flexible, cost-effective solution designed to expand your <br />
            operational and technical capabilities without increasing <br />
            permanent headcount.
          </p>

          <ApproachButton label="Book a meeting now" />
        </div>

        <div className="automation-expertiseRight">
          <Accordeon items={items} defaultOpen={0} allowCollapse />
        </div>

        <div className="engineeringSupport">
          <h2 className="engineeringSupport__title title-large">Engineering services with expert support</h2>

          <div className="engineeringSupport__grid">
            {engineeringCards.map((c) => (
              <article key={c.title} className="engineeringCard title-large">
                <img className="engineeringCard__icon" src={c.icon} alt="" aria-hidden="true" />

                <h3 className="engineeringCard__title title-small">
                  {c.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h3>

                <p className="engineeringCard__body">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      <Banner
        variant="glow"
        titleClassName="headline-medium"
        backgroundImage={bannerImg}
        actionsDirection="column"
        titleDesktop={"WOULD YOU LIKE TO KNOW\nMORE ABOUT OUR EXPERIENCE?"}
        titleMobile={"WOULD YOU LIKE TO KNOW\nMORE ABOUT OUR EXPERIENCE?"}
        buttons={[
          {
            label: "Download the full document",
            href: "/docs/experience.pdf",
            variant: "outline",
            download: true,
          },
          { label: "Book a meeting now", href: "#book", variant: "primary" },
        ]}
      />
    </main>
  );
}

