import {
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  Clock,
  Layers,
  Lightbulb,
  MapPin,
  Plug,
  Smile,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { ImageMetadata } from "astro";
import safeImg from "../assets/safe.jpg";
import namfinanceImg from "../assets/namfinance.png";
import thananutImg from "../assets/thananut.png";
import g1 from "../assets/gallery/1.jpg";
import g2 from "../assets/gallery/2.jpg";
import g3 from "../assets/gallery/3.jpg";
import g4 from "../assets/gallery/4.jpg";
import g5 from "../assets/gallery/5.jpg";
import g6 from "../assets/gallery/6.jpg";
import g7 from "../assets/gallery/7.jpg";
import g8 from "../assets/gallery/8.jpg";
import g9 from "../assets/gallery/9.jpg";
import g10 from "../assets/gallery/10.jpg";
import g11 from "../assets/gallery/11.jpg";
import g12 from "../assets/gallery/12.jpg";

export const workshop = {
  batch: "Claude Cowork Workshop รุ่นที่ 7",
  date: "เสาร์ 26 กันยายน 2569",
  time: "09:00 - 17:30 น.",
  location: "Knowledge Exchange Center (KX)",
  locationHref:
    "https://www.google.com/maps/place/Knowledge+Exchange+Center+(KX)/@13.7204117,100.4983579,1190m/data=!3m2!1e3!4b1!4m6!3m5!1s0x30e298ee5d02d0a3:0xe2511ae461733d57!8m2!3d13.7204117!4d100.4983579!16s%2Fg%2F11b822gl9x",
  registerHref:
    "https://buy.stripe.com/cNi8wO0AP7W3fs597W3wQ06?prefilled_promo_code=ECHO1700",
  contactHref: "https://line.me/R/ti/p/@dataechooo",
  contactLabel: "LINE: @dataechooo",
};

export type PricingBonus = {
  name: string;
  value: number;
  description: string;
};

export type PricingTier = {
  name: string;
  badge?: string;
  highlight?: boolean;
  regular?: number;
  price: number;
  priceSuffix?: string;
  note?: string;
  includes?: string[];
  limit?: string;
  bonus?: PricingBonus;
  registerHref?: string;
};

export const pricingMeta = {
  currency: "บาท",
  promoCode: "ECHO1700",
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Solo",
    badge: "ราคาพิเศษ",
    highlight: true,
    regular: 6990,
    price: 5290,
    note: `กรอกโค้ด ${pricingMeta.promoCode} รับส่วนลด 1,700 บาท`,
    includes: [
      "ผู้เรียน 1 ที่นั่ง",
      "Workshop เต็มวัน (09:00 - 17:30 น.)",
      "ใบประกาศนียบัตร (Certificate)",
      "สรุปเนื้อหา + Resource หลังคลาส",
    ],
  },
  {
    name: "Pack คู่",
    badge: "ราคาพิเศษ",
    regular: 13980,
    price: 9999,
    note: "กรอกโค้ด ECHO3981 รับส่วนลด 3,981 บาท",
    registerHref:
      "https://buy.stripe.com/5kQ6oG6Zd2BJ1Bfac03wQ07?prefilled_promo_code=ECHO3981",
    includes: [
      "ผู้เรียน 2 ที่นั่ง (ตกท่านละไม่ถึง 5,000 บาท)",
      "Workshop เต็มวัน (09:00 - 17:30 น.)",
      "ใบประกาศนียบัตร (Certificate)",
      "สรุปเนื้อหา + Resource หลังคลาส",
    ],
    bonus: {
      name: "Private Consult 60 นาที",
      value: 2000,
      description:
        "เซสชันให้คำปรึกษาระดับผู้เชี่ยวชาญแบบส่วนตัว เจาะลึกประเด็นสำคัญในการนำ AI เข้าไปในองค์กร/ธุรกิจ ช่วยวิเคราะห์สถานการณ์ และให้แนวทางเชิงกลยุทธ์ที่นำไปใช้ได้ทันที เหมาะสำหรับผู้บริหาร ผู้ประกอบการ ที่ต้องการผลลัพธ์ที่แม่นยำ",
    },
    limit: "ชุดละ 2 ที่นั่ง จำกัดจำนวน 5 ชุดเท่านั้น",
  },
];

export const meta: Array<{ icon: LucideIcon; label: string; href?: string }> = [
  { icon: Calendar, label: workshop.date },
  { icon: Clock, label: workshop.time },
  { icon: MapPin, label: workshop.location, href: workshop.locationHref },
];

export const navLinks = [
  { href: "#content", label: "สิ่งที่จะได้รับ" },
  { href: "#agenda", label: "ตารางเวลา" },
  { href: "#audience", label: "เหมาะกับใคร" },
  { href: "#instructor", label: "ผู้สอน" },
];

export type HeroCard = {
  title: string;
  body: string;
  leftSrc: string;
  leftAlt: string;
  rightSrc: string;
  rightAlt: string;
  rotate: number;
  offsetY: number;
  offsetX: number;
};

export const heroCards: HeroCard[] = [
  {
    title: "Google Drive → Notion",
    body: "อ่านไฟล์จาก Google Drive แล้วนำไปสร้าง Documents บน Notion",
    leftSrc: "/claude-cowork/icons/google-drive.svg",
    leftAlt: "Google Drive",
    rightSrc: "/claude-cowork/icons/notion.svg",
    rightAlt: "Notion",
    rotate: -2,
    offsetY: 40,
    offsetX: -300,
  },
  {
    title: "Gmail → ClickUp",
    body: "อ่านอีเมลล์ในช่วงสัปดาห์ที่ผ่านมา แล้วนำรายการที่ต้องทำ ไปสร้างเป็น task ใหม่บน ClickUp",
    leftSrc: "/claude-cowork/icons/gmail.svg",
    leftAlt: "Gmail",
    rightSrc: "/claude-cowork/icons/clickup.svg",
    rightAlt: "ClickUp",
    rotate: 0,
    offsetY: 0,
    offsetX: 0,
  },
  {
    title: "GitHub → Slack",
    body: "สรุป PR และ CI updates เป็นข้อความสั้นๆ ให้ทีมเข้าใจง่าย",
    leftSrc: "/claude-cowork/icons/github.svg",
    leftAlt: "GitHub",
    rightSrc: "/claude-cowork/icons/slack.svg",
    rightAlt: "Slack",
    rotate: 2,
    offsetY: 40,
    offsetX: 300,
  },
];

export const problemPills = [
  { label: "แชตลูกค้า", x: -380, y: 106 },
  { label: "สรุปประชุม", x: 0, y: 0 },
  { label: "ทำ report", x: 380, y: 106 },
  { label: "จัด Data", x: -380, y: 437 },
  { label: "ตอบอีเมล", x: 380, y: 437 },
  { label: "หาไอเดีย", x: 0, y: 538 },
];

export const features: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: TrendingUp,
    title: "อัปเดตเทรนด์ AI",
    body: "เทรนด์ที่คนทำงานต้องรู้ในปี 2569",
  },
  {
    icon: Bot,
    title: "สร้าง AI Agent ส่วนตัว",
    body: "Step-by-step ตั้งแต่พื้นฐาน เน้นใช้งานจริง",
  },
  {
    icon: Layers,
    title: "Workshop Use Case",
    body: "ตะลุยการใช้งานจริงตามสายงานของคุณ",
  },
  {
    icon: Plug,
    title: "สร้าง Skills & Plugins",
    body: "ให้ AI เก่งขึ้น โดยไม่ต้องเขียนโค้ด",
  },
];

export type AgendaRow = {
  time: string;
  tag: string | null;
  title: string;
  body: string | null;
};

export const agendaPre: AgendaRow[] = [
  {
    time: "09.00 – 09.30",
    tag: null,
    title: "AI Trend Update + Meet Claude Cowork",
    body: "ทำความรู้จักโลกของ Agentic ทำไม Claude Cowork ถึงเป็นจุดเปลี่ยนการทำงาน + เรียนรู้ว่า Claude Cowork มีความสามารถอะไรบ้าง",
  },
  {
    time: "09.30 – 10.30",
    tag: null,
    title: "Prompting Framework + Workshop #1",
    body: "พาทุกคนเรียนรู้เทคนิค prompt แบบปลดล็อกศักยภาพ Claude ที่ได้ผลลัพธ์แบบโดนใจ ผ่าน Usecase Workflow #1 ที่ช่วยธุรกิจและคนทำงานได้จริง ได้รายงาน เอกสาร สไลด์นำเสนอ คอนเทนต์แพลน หรือเว็บไซต์",
  },
  {
    time: "10.40 – 12.00",
    tag: null,
    title: "สร้าง Claude Cowork System + Workshop #2",
    body: "สร้างระบบปฏิบัติการส่วนตัว ที่ AI สามารถทำงานแทนคุณได้ทุกวัน อ่าน เขียน สรุปรายงาน สร้างไฟล์บนคอมพิวเตอร์ ให้คุณได้",
  },
];

export const agendaPost: AgendaRow[] = [
  {
    time: "13.00 – 14.00",
    tag: null,
    title: "เชื่อมต่อกับเครื่องมือเพิ่ม Productivity + Workshop #3",
    body: "เชื่อมต่อกับแอปที่เราใช้งานผ่านฟีเจอร์ Connectors & MCP อาทิเช่น Gmail + Drive + Canva + Calendar ทำให้สามารถนำมาช่วยงาน/ธุรกิจในชีวิตประจำวันได้",
  },
  {
    time: "14.10 – 15.20",
    tag: null,
    title: "Upskill with Skills + Workshop #4",
    body: "เปลี่ยน prompt ให้เป็น ทักษะงานเฉพาะทางที่เรียกใช้งานได้ทันที ไม่ต้องพิมพ์ให้ยืดยาว และสร้างมาตราฐาน พร้อมส่งต่อให้คนในทีมได้",
  },
  {
    time: "15.30 – 17.10",
    tag: "NEW",
    title: "Group Activity + Project with CRACK Framework",
    body: "ออกแบบ Workflow ให้เหมาะสมกับธุรกิจและงานของคุณด้วย CRACK Framework ที่ทำให้เข้าใจว่าคุณจะทำงานส่วนไหน และให้ผู้ช่วย AI ทำงานส่วนไหน",
  },
  {
    time: "17.10 – 17.30",
    tag: null,
    title: "Wrap-up + Q&A Session",
    body: "สรุปเนื้อหา พร้อมคำแนะนำแผนการประยุกต์ใช้กับธุรกิจและงาน",
  },
];

export const personas: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: Briefcase,
    title: "ผู้บริหาร",
    body: "นำ AI มาทุ่นแรงทีม และลดต้นทุนเวลา",
  },
  {
    icon: Smile,
    title: "ครีเอเตอร์",
    body: "ทำคอนเทนต์ไวขึ้น หาไอเดียไม่มีตัน",
  },
  {
    icon: BarChart3,
    title: "การเงิน",
    body: "ให้ AI ช่วย research และสรุปรายงาน",
  },
  {
    icon: Lightbulb,
    title: "การตลาด",
    body: "วางแผนแคมเปญ ดูแล brand ให้โดดเด่น",
  },
];

export const galleryRows: ImageMetadata[][] = [
  [g1, g4, g7, g10],
  [g2, g6, g9, g11],
  [g3, g8, g12, g5],
];

export const instructor = {
  name: "จตวัฒน์ เซี่ย (เซฟ)",
  handle: "Jatawat Xie",
  title: "Executive Director, Ecsight Group",
  bio: "วิทยากรด้าน Innovation, Data, AI และการบริหารจัดการงาน มีประสบการณ์ในบทบาท Product Manager มากกว่า 5 ปี ดูแลผลิตภัณฑ์ด้าน Data, AI และ MarTech ในองค์กรชั้นนำ",
  image: safeImg,
  stats: [
    { value: "10+", label: "คลาสที่สอน" },
    { value: "500+", label: "ผู้เรียนทั้งหมด" },
    { value: "5+", label: "ปีประสบการณ์ PM" },
  ],
};

export type ReviewSegment = { text: string; highlight?: boolean };
export type Review = {
  quote: ReviewSegment[];
  name: string;
  role: string;
  batch: string;
  image?: ImageMetadata;
};

export const reviews: Review[] = [
  {
    quote: [
      { text: "ค่อยๆ สอนเป็นขั้นเป็นตอน", highlight: true },
      {
        text: " เนื้อหาไม่เร่งรีบ หรือช้าจนเกินไป ",
      },
      {
        text: "เน้นให้ปฏิบัติ และใช้งานได้จริง แนะนำมากๆ ค่ะ",
        highlight: true,
      },
    ],
    name: "NamFinance",
    role: "ที่ปรึกษาการเงินส่วนบุคคล, Content creator",
    batch: "Batch 02",
    image: namfinanceImg,
  },
  {
    quote: [
      { text: "สอนดีมากครับ " },
      {
        text: "สิ่งสำคัญคือการสอน Fundamental พื้นฐานการใช้ AI",
        highlight: true,
      },
      { text: " เพราะสามารถนำไป Apply ใช้ได้ตลอด" },
    ],
    name: "Thananut Santatiyanon",
    role: "Product manager",
    batch: "Batch 02",
    image: thananutImg,
  },
  {
    quote: [
      {
        text: "มี Use Case ออกมาให้ดูเยอะมาก",
        highlight: true,
      },
      {
        text: " ทำให้เราจินตนาการต่อได้ว่าจะนำไป Adapt ใช้กับงานชนิดไหนได้บ้าง",
      },
    ],
    name: "คุณบันนี่",
    role: "System Analyst",
    batch: "Batch 02",
  },
  {
    quote: [
      { text: "บรรยากาศในคลาสพี่ๆ และ TA เป็นกันเอง", highlight: true },
      {
        text: " ส่วนวิทยากรก็อธิบายให้เข้าใจง่าย สำหรับใครที่พลาดไป แนะนำให้มาเข้าเรียนมาก",
      },
    ],
    name: "คุณแซน",
    role: "พนักงานต้อนรับบนเครื่องบิน",
    batch: "Batch 02",
  },
];

export const faqs = [
  {
    q: "ไม่มีพื้นฐาน AI เลย เรียนได้ไหม?",
    a: "เรียนได้ครับ Workshop ออกแบบมาสำหรับผู้ที่ไม่มีพื้นฐาน AI มาก่อน เริ่มจากศูนย์ พาทำทีละขั้น ตั้งแต่ติดตั้งจนใช้งานได้จริง",
  },
  {
    q: "ต้องสมัคร Claude ก่อนไหม?",
    a: "แนะนำว่าควรสมัครล่วงหน้าครับ แนะนำให้สมัคร Claude ตั้งแต่ตัว Pro ขึ้นไป เพราะจะสามารถใช้งานฟีเจอร์ต่างๆ ได้อย่างเต็มที่",
  },
  {
    q: "ต้องเตรียมอะไรมาบ้าง?",
    a: "เตรียม Laptop พร้อมต่อ Wi-Fi ได้ และบัญชีอีเมล (Gmail/Google Workspace) เพื่อใช้ทดลองเชื่อมต่อ Connectors ต่างๆ",
  },
  {
    q: "เรียนแบบไหน ออนไลน์หรือออฟไลน์?",
    a: "Workshop นี้เป็นแบบออนไซต์เท่านั้น เพื่อให้ได้ประสบการณ์จับมือทำและถาม-ตอบได้แบบสดๆ สถานที่จะแจ้งให้ทราบอีกครั้ง",
  },
  {
    q: "มีคลาสเรียนย้อนหลังไหม?",
    a: "หลังจบ Workshop จะมีสรุปและ Resource สำคัญส่งให้ในกลุ่มผู้เรียน รวมถึงคลิปบางส่วนสำหรับทบทวน",
  },
  {
    q: "รับผู้เรียนรุ่นละกี่คน?",
    a: "จำกัดจำนวน 15-20 ท่านต่อรุ่น เพื่อให้ผู้สอนสามารถดูแลและตอบคำถามได้อย่างใกล้ชิด",
  },
];
