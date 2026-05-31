import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, signal, afterNextRender, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Project {
  id: string;
  title: string;
  shortDesc: string;
  tech: string[];
  deepDive: {
    problem: string;
    solution: string;
    learnings: string;
  };
  icon: string;
}

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  details: string;
  type: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  @ViewChild('scrollyContainer') scrollyContainer!: ElementRef<HTMLElement>;
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  activeYear = signal(2024);
  selectedProject = signal<Project | null>(null);
  expandedTimelineItem = signal<string | null>(null);
  theme = signal<'dark' | 'light'>('dark');

  constructor() {
    afterNextRender(async () => {
      const { animate, scroll, stagger, inView } = await import('motion');
      this.initHeroAnimations(animate, stagger);
      this.initScrollytelling(scroll, animate);
      this.initParallax(scroll);
      this.initTechStackAnimations(inView, animate, stagger);

      // Initialize theme from client local storage or system preference
      if (isPlatformBrowser(this.platformId)) {
        const savedTheme = localStorage.getItem('portfolio-theme') as 'dark' | 'light';
        if (savedTheme === 'light' || savedTheme === 'dark') {
          this.setTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          this.setTheme('light');
        } else {
          this.setTheme('dark');
        }
      }
    });
  }

  setTheme(theme: 'dark' | 'light') {
    this.theme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('light');
        localStorage.setItem('portfolio-theme', 'light');
      } else {
        root.classList.remove('light');
        localStorage.setItem('portfolio-theme', 'dark');
      }
    }
  }

  toggleTheme() {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initParallax(scroll: any) {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach((el) => {
      const speed = parseFloat((el as HTMLElement).dataset['speed'] || '0.1');
      
      scroll(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (info: any) => {
          // Handle both progress (number) and info object, fallback to window.scrollY
          let yOffset = 0;
          if (typeof info === 'number') {
            yOffset = window.scrollY;
          } else if (info && info.y && typeof info.y.current === 'number') {
            yOffset = info.y.current;
          } else {
            yOffset = window.scrollY;
          }
          
          (el as HTMLElement).style.transform = `translateY(${yOffset * speed}px)`;
        }
      );
    });
  }

  expertise = [
    { title: 'Embedded Systems', desc: 'Firmware development, Secure Boot, and robust OTA update architectures.', icon: 'memory' },
    { title: 'Hardware Engineering', desc: 'Complex circuit design, sensor integration, and PCB prototyping.', icon: 'developer_board' },
    { title: 'Security Architecture', desc: 'Threat modeling, encryption at the edge, and resilient systems.', icon: 'security' },
    { title: 'Leadership', desc: 'Scaling engineering teams and fostering a culture of reliability.', icon: 'groups' },
  ];

  projects = [
    {
      id: 'robotics-agri',
      title: 'AI-Powered Agricultural Robotics',
      shortDesc: 'Autonomous systems for precision farming and crop monitoring.',
      tech: ['Python', 'C++', 'Arduino', 'Raspberry Pi', 'MySQL'],
      deepDive: {
        problem: 'Traditional farming methods are labor-intensive and lack precision in resource allocation, leading to waste and lower yields.',
        solution: 'Developed a fleet of autonomous robots equipped with multi-spectral sensors and AI models to identify crop health and automate targeted spraying.',
        learnings: 'Real-world hardware reliability is the biggest hurdle; edge computing optimization is critical for low-latency decision making.'
      },
      icon: 'precision_manufacturing'
    },
    {
      id: 'cyber-drone',
      title: 'Secure Drone Ecosystem',
      shortDesc: 'Hardened firmware and OTA update architecture for industrial drones.',
      tech: ['C', 'Security Architecture', 'Firmware', 'Encryption'],
      deepDive: {
        problem: 'Industrial drones are vulnerable to signal hijacking and unauthorized firmware modifications, posing significant security risks.',
        solution: 'Implemented a Secure Boot chain and encrypted OTA update mechanism using hardware-based root of trust.',
        learnings: 'Security must be integrated at the hardware level; software-only solutions are insufficient for edge devices.'
      },
      icon: 'security'
    },
    {
      id: 'ai-smart-systems',
      title: 'Smart Monitoring Systems',
      shortDesc: 'AI-driven analytics platform for real-time hardware telemetry.',
      tech: ['TypeScript', 'NodeJS', 'React', 'Nginx', 'SQLite'],
      deepDive: {
        problem: 'Monitoring large-scale hardware deployments manually is impossible, leading to delayed maintenance and system failures.',
        solution: 'Built a centralized dashboard that processes real-time telemetry from thousands of sensors using predictive AI models.',
        learnings: 'Data normalization across diverse hardware platforms is a major challenge; scalability requires a robust event-driven architecture.'
      },
      icon: 'analytics'
    }
  ];

  timeline: TimelineItem[] = [
    {
      year: '2024',
      title: 'CTO @ Hariyalikart',
      desc: 'Leading engineering and security strategy for agricultural transformation.',
      details: 'Spearheading technical architecture, scaling engineering teams, and fostering a culture of reliability and precision.',
      type: 'career'
    },
    {
      year: '2023',
      title: 'CA @ Technex IIT BHU',
      desc: 'Campus Ambassador for the annual technical festival.',
      details: 'Led technical communities, managed large-scale outreach, and acted as a bridge between top-tier technical institutions.',
      type: 'leadership'
    },
    {
      year: '2022',
      title: 'CA @ E-cell IIT BHU',
      desc: 'Promoting entrepreneurship and innovation within the student ecosystem.',
      details: 'Organized workshops, startup competitions, and networking events for aspiring student entrepreneurs.',
      type: 'leadership'
    },
    {
      year: '2021',
      title: 'CA @ Techkriti IITK',
      desc: 'Representing Asia\'s largest technical and entrepreneurial festival.',
      details: 'Coordinated regional events and outreach programs to foster deep-tech leadership among students.',
      type: 'leadership'
    },
    {
      year: 'Cert',
      title: 'Autodesk Certified Professional',
      desc: 'Fusion 360 & AutoCAD certification.',
      details: 'Validation of advanced proficiency in 2D drafting and 3D modeling for complex mechanical systems.',
      type: 'certification'
    },
    {
      year: 'Cert',
      title: 'Geomagic Design X Expert',
      desc: 'Specialized in Reverse Engineering workflows.',
      details: 'Expertise in transforming physical objects into digital CAD models for drone and robotic hardware development.',
      type: 'certification'
    }
  ];

  certifications = [
    { title: 'Autodesk Certified Professional', desc: 'Fusion 360 & AutoCAD. Advanced proficiency in 2D drafting and 3D modeling.', type: 'Engineering' },
    { title: 'Expert in Reverse Engineering', desc: 'Geomagic Design X & Artec Workflows. Physical prototyping to digital optimization.', type: 'Specialized' },
    { title: 'SolidWorks Certified Professional', desc: 'Mechanical design and manufacturing knowledge.', type: 'Engineering' },
  ];

  honors = [
    { title: 'Technical Innovator Award', desc: 'CTO @ Hariyalikart. Agricultural transformation through scalable software.', type: 'Leadership' },
    { title: 'Robotics Systems Architect', desc: 'Integration of AI-powered solutions in agricultural robotics.', type: 'Technical' },
    { title: 'Community Lead & Elite Ambassador', desc: 'Representing E-CELL & Technex (IIT BHU) and Techkriti (IIT Kanpur).', type: 'Community' },
  ];

  liveProjects = [
    {
      title: 'Ignizia Tech',
      url: 'https://www.ignizia.in',
      thumbnail: 'https://image.thum.io/get/width/800/crop/600/https://www.ignizia.in',
      desc: 'An innovative tech development and solutions platform offering robust digital experiences and custom web engineering.',
      tech: ['Web Development', 'UI/UX Design', 'Cloud Solutions']
    },
    {
      title: 'Campus Lens',
      url: 'https://campus-lens-v2.vercel.app/',
      thumbnail: 'https://image.thum.io/get/width/800/crop/600/https://campus-lens-v2.vercel.app/',
      desc: 'An advanced web platform designed to streamline campus navigation, student hubs, and real-time community engagement.',
      tech: ['Next.js', 'Tailwind CSS', 'React']
    },
    {
      title: 'StyleSync',
      url: 'https://style-sync-self.vercel.app/',
      thumbnail: 'https://image.thum.io/get/width/800/crop/600/https://style-sync-self.vercel.app/',
      desc: 'A sophisticated fashion synchronization platform bridging style and technology.',
      tech: ['Next.js', 'Tailwind CSS', 'AI Integration']
    },
    {
      title: 'Aravalli Intelligence',
      url: 'https://aravalli-intelligence.vercel.app/',
      thumbnail: 'https://image.thum.io/get/width/800/crop/600/https://aravalli-intelligence.vercel.app/',
      desc: 'Advanced intelligence systems for terrain analysis and strategic monitoring.',
      tech: ['React', 'Data Visualization', 'Intelligence Systems']
    },
    {
      title: 'Krishi Mitra AI',
      url: 'https://krishi-miitra-ai.vercel.app/',
      thumbnail: 'https://image.thum.io/get/width/800/crop/600/https://krishi-miitra-ai.vercel.app/',
      desc: 'An AI-powered agricultural companion providing real-time insights and crop management solutions.',
      tech: ['Gemini AI', 'Next.js', 'Agriculture Tech']
    }
  ];

  techStack = [
    { name: 'C', icon: 'https://i.ibb.co/Fbp2ybvj/abc40721-b26b-4c02-be74-3a44096ea398.png' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Next JS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'NodeJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'NPM', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Apache', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg' },
    { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'Arduino', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
    { name: 'Raspberry Pi', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg' },
    { name: 'SolidWorks', icon: 'https://i.ibb.co/4ZxdXXSH/png-clipart-solidworks-simulation-logo-computer-aided-design-solidworks-corp-technology-electronics.png' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Gemini AI', icon: 'https://i.ibb.co/N224BWSk/5debc7a5-eb83-4ec7-b58e-b373fa5f92b1.png' },
    { name: 'Salesforce', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg' },
    { name: 'Google Cloud', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
    { name: 'Google Skills', icon: 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png' },
    { name: 'Vertex AI', icon: 'https://i.ibb.co/svvVTBZw/3e5b376c-fab7-4fe1-a522-018a7fa22ea8.png' },
    { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' }
  ];

  professionalCertificates = [
    { title: 'Udemy Certificate 1', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-de595112-acef-4f47-baea-52fdaf1ba6dc.jpg', isImage: true },
    { title: 'Udemy Certificate 2', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-fd6f6da1-e1c3-488b-8661-4ffebebd0d57.jpg', isImage: true },
    { title: 'Udemy Certificate 3', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-937eaee6-3d56-4870-b3dc-6d4214bbca47.jpg', isImage: true },
    { title: 'Udemy Certificate 4', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-381dfd6f-9cb5-427a-9f15-a37bea64bc96.jpg', isImage: true },
    { title: 'Udemy Certificate 5', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-e609eac2-96a9-436e-a3d7-02dce85705b2.jpg', isImage: true },
    { title: 'Udemy Certificate 6', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-0e81e760-abc2-4fe5-8cd0-0ca8eda79195.jpg', isImage: true },
    { title: 'Udemy Certificate 7', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-307c043f-2283-43a5-8e8b-ddea3b6d5fae.jpg', isImage: true },
    { title: 'Udemy Certificate 8', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-844322ee-5fea-4339-89a7-775bdd0a0144.jpg', isImage: true },
    { title: 'Udemy Certificate 9', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-5eb0d16e-7991-43a9-9ea1-6f2d1350de69.jpg', isImage: true },
    { title: 'Udemy Certificate 10', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-f0eb7d1e-f56e-4be6-a9b3-5e2f9fb27da9.jpg', isImage: true },
    { title: 'Udemy Certificate 11', issuer: 'Udemy', link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-33cf396a-146c-487e-b5a1-1e98d85d6c32.jpg', isImage: true },
    { title: 'C Programming', issuer: 'GUVI HCL', link: 'https://i.ibb.co/TMnHQr8V/c-programming.png', isImage: true },
    { title: 'OOPS Using C++', issuer: 'GUVI HCL', link: 'https://i.ibb.co/Kc7PJcGR/HCL-GUVI-Certification-77-P52-IVw816410j6g-L.png', isImage: true },
    { title: 'International Physics Quiz', issuer: 'IPhyC Certification', link: 'https://i.ibb.co/jv45pbkz/Certificate-QR-2025-1017-C8388279-d0126d7432265e9cad69bb2a8b5513c0-page-0001.jpg', isImage: true },
    { title: 'InfoSec Awareness', issuer: 'ISEA', link: 'https://infosecawareness.in/validate-certificate?certid=MeitY/ISEA/WCHP/029371', isImage: false },
  ];

  toggleTimeline(title: string) {
    if (this.expandedTimelineItem() === title) {
      this.expandedTimelineItem.set(null);
    } else {
      this.expandedTimelineItem.set(title);
    }
  }

  selectProject(project: Project) {
    this.selectedProject.set(project);
    
    if (isPlatformBrowser(this.platformId)) {
      // Smooth scroll to deep dive if needed
      setTimeout(() => {
        const element = document.getElementById('deep-dive');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initHeroAnimations(animate: any, stagger: any) {
    animate(
      '.hero-reveal',
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.1), duration: 0.8, ease: 'easeOut' }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initScrollytelling(scroll: any, animate: any) {
    const container = this.scrollyContainer.nativeElement;
    const items = container.querySelectorAll('.scrolly-item');
    const progressLine = container.querySelector('.progress-line') as HTMLElement;

    scroll(
      (progress: number) => {
        if (progressLine) {
          progressLine.style.transform = `scaleY(${progress})`;
        }
      },
      { target: container }
    );

    items.forEach((item) => {
      scroll(
        animate(item, { opacity: [0, 1, 1, 0], y: [50, 0, 0, -50] }),
        {
          target: item as HTMLElement,
          offset: ["start end", "start center", "end center", "end start"]
        }
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initTechStackAnimations(inView: any, animate: any, stagger: any) {
    if (isPlatformBrowser(this.platformId)) {
      const container = document.getElementById('techStackContainer');
      if (container) {
        inView(container, () => {
          animate(
            '.tech-stack-card',
            { opacity: [0, 1], y: [20, 0], scale: [0.95, 1] },
            { delay: stagger(0.04), duration: 0.6, ease: 'easeOut' }
          );
        });
      }
    }
  }
}
