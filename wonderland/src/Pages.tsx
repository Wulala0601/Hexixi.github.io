import { Link, useParams } from 'react-router-dom'
import { imageUrl, links, projects } from './content'
import { usePreferences } from './preferences'
import { ExternalLink } from './App'
import { BagDetails, ModelDetails } from './ObjectDetails'
import Atb505 from './Atb505'
import Caviar from './Caviar'
import OnTheEve from './Eve'
import Anicat from './Anicat'
import Clover from './Clover'
import Brine from './Brine'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
export default function Pages() {
  const { slug } = useParams(); const { t } = usePreferences()
  if (slug === 'atb505') return <Atb505 />
  if (slug === 'caviar') return <Caviar />
  if (slug === 'on-the-eve') return <OnTheEve />
  if (slug === 'anicat') return <Anicat />
  if (slug === 'please-lie-here') return <Clover />
  if (slug === 'shop') return <Brine />
  if (slug === 'bag-details') return <BagDetails />
  if (slug === 'model-details') return <ModelDetails />
  if (slug === 'about') return <AboutPage />
  if (slug === 'contact') return <ContactPage />
  if (slug === 'shop') return <Shop />
  if (slug === 'ip-models') return <IpModels />
  const project = projects.find((item) => item.slug === slug)
  if (project) return <ProjectPage project={project} />
  return <main id="main" className="inner-page"><p className="eyebrow">404 / SOFT ERROR</p><h1>{t('This little door goes nowhere.','这扇小门暂时没有通向任何地方。')}</h1><Link className="pill" to="/">{t('Return to the wonderland','回到柔软故障乐园')} ↗</Link></main>
}
function Shell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <main id="main" className="inner-page"><div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{children}</main> }
function Shop() { const {t}=usePreferences(); return <Shell eyebrow="SHOP / LITTLE OBJECTS" title={t('Small things, ready to wander.','小小的物件，准备去漫游。')}><p className="lead">{t('A small selection of original bags and characters. No prices here, just a gentle nudge to the external shops.','这里展示原创包包与角色模型。不在本站显示价格，只把你轻轻带到外部店铺。')}</p><div className="product-grid"><a className="product-card" href={links.redShop} target="_blank" rel="noreferrer"><img src={imageUrl('bag-front')} alt={t('Original bag','原创包包')} /><span>{t('Bags / 小包包','包包 / Bags')} ↗</span><small>{t('View on Xiaohongshu shop','去小红书店铺查看')}</small></a><Link className="product-card" to="/ip-models"><img src={imageUrl('ip-standing')} alt={t('Original mint catgirl figure','原创薄荷猫耳少女模型')} /><span>{t('IP figures / 角色模型','IP 模型 / Figures')} ↗</span><small>{t('Visit the figure gallery','查看模型展厅')}</small></Link></div><div className="shop-links"><ExternalLink href={links.redShop}>{t('Xiaohongshu shop','小红书店铺')} </ExternalLink><ExternalLink href={links.taobao}>{t('Taobao shop','淘宝店铺')} </ExternalLink></div></Shell> }
function IpModels() { const {t}=usePreferences(); return <Shell eyebrow="IP MODELS / ORIGINAL CHARACTERS" title={t('The guide, in three dimensions.','三维里的小向导。')}><p className="lead">{t('The mint catgirl is an original digital avatar, character and quiet guide through this site. Please rotate each view gently; she gets dizzy.','薄荷猫耳少女是原创数字分身、角色，也是这个网站的安静向导。请轻轻旋转，她可能会晕。')}</p><div className="model-grid">{['ip-standing','ip-seated','ip-front','ip-side','ip-back'].map((name)=><figure key={name}><img src={imageUrl(name)} alt={`${name} ${t('view','视图')}`} /><figcaption>{name.replace('ip-','').replace('-',' ')} / {t('view','视图')}</figcaption></figure>)}</div></Shell> }
function ProjectPage({ project }: { project: typeof projects[number] }) { const {t,lang}=usePreferences(); const index=projects.findIndex(p=>p.slug===project.slug); const next=projects[(index+1)%projects.length]; const prev=projects[(index+projects.length-1)%projects.length]; return <Shell eyebrow={`${String(index+1).padStart(2,'0')} / ${project.type[lang]}${project.year?` · ${project.year}`:''}`} title={project.title[lang]}><div className="project-detail"><p className="lead">{project.summary[lang]}</p><img className="project-hero-img" src={imageUrl(project.image)} alt={project.title[lang]} /><div className="project-fact-grid"><div><span className="eyebrow">{t('BACKGROUND / 01','背景 / 01')}</span><p>{t('A world built from careful observation, playful research and a desire to make the familiar feel slightly unfamiliar.','从细致观察、轻盈研究出发，让熟悉的事物产生一点陌生感。')}</p></div><div><span className="eyebrow">{t('MY ROLE / 02','我的职责 / 02')}</span><p>{t('Concept, visual direction, design development and final presentation, with the exact scope kept to the source materials.','概念、视觉方向、设计发展与最终呈现；具体范围以原始资料为准。')}</p></div><div><span className="eyebrow">{t('PROCESS / 03','过程 / 03')}</span><p>{t('Research becomes characters, materials, images and a small system visitors can enter.','研究转化为角色、材质、图像，以及一个观众可以走进去的小系统。')}</p></div><div><span className="eyebrow">{t('AI PARTICIPATION / 04','AI 参与 / 04')}</span><p>{project.ai[lang]}</p></div></div><div className="project-gallery">{project.images.map(name=><img loading="lazy" key={name} src={imageUrl(name)} alt={`${project.title[lang]} — ${name}`} />)}</div></div><nav className="project-next"><Link to={`/work/${prev.slug}`}>← {prev.title[lang]}</Link><Link to="/#worlds">{t('Back to the six doors','返回六个世界')}</Link><Link to={`/work/${next.slug}`}>{next.title[lang]} →</Link></nav></Shell> }
