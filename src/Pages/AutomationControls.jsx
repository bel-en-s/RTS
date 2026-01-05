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
      "We design robust architectures, panel layouts, IO strategies, and integration plans—ensuring reliable operation across the entire control stack.",
  },
  {
    id: "p3",
    title: "System Migration & Virtualization",
    body:
      "We modernize legacy systems, migrate platforms safely, and implement virtualization strategies to improve resiliency, maintainability, and scalability.",
  },
  {
    id: "p4",
    title: "HMI Design & Virtualization",
    body:
      "We craft clean, operator-friendly HMIs and deploy virtualization solutions for consistent access, easier maintenance, and standardized operations.",
  },
];

const tableRows = [
  {
    c1: "Experion Architecture\n& Control System",
    c2: "We build, expand, and sustain control architectures across the entire Honeywell Experion ecosystem.",
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
  const tableWrapRef = useRef(null);

  useEffect(() => {
    const el = tableWrapRef.current;
    if (!el) return;

    const NAV_ON_WHITE = "light";

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 25%",
      onEnter: () => setNavMode?.(NAV_ON_WHITE),
      onEnterBack: () => setNavMode?.(NAV_ON_WHITE),
      onLeaveBack: () => setNavMode?.("dark"),
      // onLeave: () => setNavMode?.("dark"),
    });

    return () => st.kill();
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

    <p className="title-small subtitle-hero subtitle-hero--desktop">
      — provide expert guidance to <br />design and integrate control systems
    </p>

    <p className="title-medium subtitle-hero subtitle-hero--mobile">
      — provide expert <br />guidance to 
      design and <br />integrate control systems
    </p>
  </div>
</section>


      <section className="automation-expertiseSection">
        <div className="automation-expertiseLeft">
          <p className="title-medium">
            Devoted to maintaining, innovating,
            <br /> and enhancing industrial control <br />
            systems, we engineer projects across <br /> various industries.
          </p>

          <ApproachButton label="Book a meeting now" />
        </div>

        <div className="automation-expertiseRight">
          <p className="automation-kicker">Key areas of expertise</p>
          <Accordeon items={items} defaultOpen={0} allowCollapse />
        </div>
      </section>

      <BannerText imgOne={bannerOne} imgTwo={bannerTwo} />

      <section ref={tableWrapRef} className="whiteTableWrap">
        <Table
          title="Capabilities with Honeywell technologies"
          columns={["Service", "Focus", "Description", "Main technologies"]}
          rows={tableRows}
        />
      </section>

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
          <h2 className="engineeringSupport__title">Engineering services with expert support</h2>

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
