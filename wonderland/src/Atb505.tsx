import { useEffect, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import BlindBox from './BlindBox'
import SceneVideo from './SceneVideo'
import { atbImage } from './atb505-utils'
import {
  atbMeta, audience, cast, channels, doors, funnel, hidden, loop, mechanics,
  milestones, moat, prices, products, revenue, rules, stages, worlds,
} from './atb505-content'
import './atb505.css'

const castIds = ['laogu', 'jian', 'li', 'nafu'] as const

export default function Atb505() {
  useEffect(() => {
    const previous = document.title
    document.title = '兽华物语 ATB505 — HE XIXI'
    return () => { document.title = previous }
  }, [])

  return (
    <main id="main" className="atb">
      {/* ---------- 首屏 ---------- */}
      <section className="atb-hero">
        <div className="atb-hero-inner">
          <p className="atb-kicker">
            {atbMeta.code} · BRAND &amp; IP PROPOSAL · {atbMeta.year}
          </p>
          <img className="atb-logo" src={atbImage('logo')} alt="兽华物语" />
          <p className="atb-formula">{atbMeta.formula}</p>
          <p className="atb-claim">{atbMeta.claim}</p>
          <p className="atb-claim-sub">{atbMeta.claimSub}</p>
          <div className="atb-hero-actions">
            <a className="atb-btn atb-btn-solid" href="#draw">抽一盒试试 ↗</a>
            <a className="atb-btn" href="#worlds">看三条世界线</a>
          </div>
          <div className="atb-hero-cast" aria-hidden="true">
            {castIds.map((id, i) => (
              <img key={id} src={atbImage(`hero-${id}`)} alt="" style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
          <dl className="atb-hero-meta">
            <div><dt>企划</dt><dd>{atbMeta.team}</dd></div>
            <div><dt>成员</dt><dd>{atbMeta.members.join(' · ')}</dd></div>
            <div><dt>类型</dt><dd>{atbMeta.kind}</dd></div>
          </dl>
        </div>
      </section>

      {/* ---------- 抽盲盒 ---------- */}
      <BlindBox />

      {/* ---------- 01 定位 ---------- */}
      <section className="atb-section" id="idea">
        <header className="atb-section-head">
          <span className="atb-eyebrow">01 / 初识兽华物语</span>
          <h2>先把世界观讲清楚，<br /><em>再谈它为什么能卖</em></h2>
          <p>
            一个以盲盒为主要载体、以文化空间为故事引擎的原创潮玩 IP。
            四个人，一只旧手提箱，穿过一条又一条世界线。
          </p>
        </header>

        <div className="atb-dual">
          <div>
            <h3>文化 → IP</h3>
            <p>让喜欢 IP 的人，因为喜欢角色而了解一种文化。</p>
            <span>博物馆与剧院的观众，是我们最便宜的种子用户。</span>
          </div>
          <div>
            <h3>IP → 文化</h3>
            <p>让喜欢文化的人，因为认同文化而愿意购买 IP。</p>
            <span>潮玩用户的收藏欲，是文化传播最好的加速器。</span>
          </div>
        </div>

        <ol className="atb-numbered">
          {mechanics.map((item, i) => (
            <li key={item.title}>
              <span className="atb-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="atb-sub-title">五环相扣，循环增值</h3>
        <ol className="atb-loop">
          {loop.map((item, i) => (
            <li key={item.title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>

        <h3 className="atb-sub-title">卖给谁：三类人，三种进入方式</h3>
        <div className="atb-audience">
          {audience.map((item) => (
            <article key={item.title}>
              <span className="atb-tag">{item.tag}</span>
              <h4>{item.title}</h4>
              <small>{item.meta}</small>
              <p>{item.want}</p>
              <footer>{item.note}</footer>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- 02 角色 ---------- */}
      <section className="atb-section atb-cast-section" id="cast">
        <header className="atb-section-head">
          <span className="atb-eyebrow">02 / 一核四角多世界线</span>
          <h2>四张脸要一眼能认出来，<br /><em>三套衣服要一眼能看出他们去了哪儿</em></h2>
          <p>物种即身份、性格决定配色、一处永久记号——这三条铁律决定了「人不变、世界一直在变」。</p>
        </header>

        <div className="atb-cast">
          {cast.map((member, index) => (
            <article className="atb-cast-card" key={member.id} style={{ '--accent': member.color } as CSSProperties}>
              <div className="atb-cast-art">
                <img src={atbImage(`base-${member.id}`)} alt={`${member.name} 本体形象`} loading="lazy" />
                <span className="atb-cast-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="atb-cast-body">
                <h3>{member.name}<em>{member.en}</em></h3>
                <p className="atb-cast-job">{member.species} · {member.job}</p>
                <ul className="atb-traits">
                  {member.traits.map((trait) => <li key={trait}>{trait}</li>)}
                </ul>
                <blockquote>「{member.quote}」</blockquote>
                <p>{member.identity}</p>
                <p>{member.motivation}</p>
                <dl className="atb-skins">
                  {member.skins.map((skin) => (
                    <div key={skin.world}>
                      <dt>{doors.find((d) => d.id === skin.world)?.name}</dt>
                      <dd>{skin.look}<span>{skin.anchor}</span></dd>
                    </div>
                  ))}
                </dl>
                <p className="atb-mark">永久记号 · {member.mark}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="atb-rules">
          {rules.map((rule, i) => (
            <div key={rule.title}>
              <span className="atb-num">{String(i + 1).padStart(2, '0')}</span>
              <h4>{rule.title}</h4>
              <p>{rule.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 03 三条世界线 ---------- */}
      <section className="atb-section" id="worlds">
        <header className="atb-section-head">
          <span className="atb-eyebrow">03 / 三条世界线</span>
          <h2>一条世界线不是一次换皮，<br /><em>而是一次关系的推进</em></h2>
          <p>从陌生到并肩，从并肩到生死之交，从生死之交到「各活各的精彩」。</p>
        </header>

        {worlds.map((world, index) => (
          <article className="atb-world" key={world.id} id={world.id}>
            <header className="atb-world-head">
              <span className="atb-world-code">{world.code}</span>
              <h3>{world.name}<em>{world.en}</em></h3>
              <p className="atb-world-type">{world.type} · {world.place}</p>
              <p className="atb-world-logline">{world.logline}</p>
            </header>

            {index === 0 && (
              <SceneVideo
                src="/videos/atb/tang.mp4"
                poster="/images/atb/scene-tang.webp"
                caption="开元二十三年 · 长安 · 花灯巷与西市"
                label="盛唐幻境 · 概念短片"
              />
            )}
            {index === 1 && (
              <SceneVideo
                src="/videos/atb/broadway.mp4"
                poster="/images/atb/scene-broadway.webp"
                caption="《最终彩排》· 四剧合一的舞台"
                label="百老汇之梦 · 概念短片"
              />
            )}
            {index === 2 && (
              <SceneVideo
                src="/videos/atb/neon.mp4"
                poster="/images/atb/scene-neon.webp"
                caption="千禧年地下文化展 · 霓虹与棋盘格"
                label="霓虹地下城 · 概念短片"
              />
            )}

            <ol className="atb-beats">
              {world.beats.map((beat) => (
                <li key={beat.label}>
                  <strong>{beat.label}</strong>
                  <p>{beat.text}</p>
                </li>
              ))}
            </ol>

            <div className="atb-anchors">
              {world.anchors.map((anchor) => (
                <figure key={anchor.relic}>
                  {anchor.image && <img src={atbImage(anchor.image)} alt={anchor.relic} loading="lazy" />}
                  <figcaption>
                    <strong>{anchor.relic}</strong>
                    <span>{anchor.who}</span>
                    <p>{anchor.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className="atb-note">{world.note}</p>
          </article>
        ))}

        <div className="atb-hidden">
          <div className="atb-hidden-art">
            <img src={atbImage('hidden-bug')} alt={hidden.name} loading="lazy" />
          </div>
          <div>
            <span className="atb-eyebrow">HIDDEN EDITION · 整盒的情绪峰值</span>
            <h3>{hidden.name}<em>{hidden.title}</em></h3>
            <p className="atb-hidden-parts">{hidden.parts}</p>
            <blockquote>「{hidden.quote}」</blockquote>
            <p>{hidden.text}</p>
            <p>{hidden.story}</p>
            <p className="atb-note">设计规则：隐藏款必须与四条常规款共享同一「世界观语法」，但换一个物种、换一套叙事身份。它是「整盒买」的主要理由，也是二手交易与开箱视频的天然流量入口。</p>
          </div>
        </div>
      </section>

      {/* ---------- 04 产品与商业 ---------- */}
      <section className="atb-section" id="products">
        <header className="atb-section-head">
          <span className="atb-eyebrow">04 / 产品与商业</span>
          <h2>一套盲盒就是一章故事，<em>结构里藏着三个商业开关</em></h2>
          <p>轮值制让复购不停、联动款让渠道愿意推、特别版让老玩家永远有新东西可追。</p>
        </header>

        <div className="atb-products">
          {products.map((product, i) => (
            <article key={product.title}>
              <span className="atb-num">{String(i + 1).padStart(2, '0')}</span>
              <h4>{product.title}<em>{product.tag}</em></h4>
              <p>{product.text}</p>
            </article>
          ))}
        </div>

        <h3 className="atb-sub-title">价格带：让每一层人群都有台阶</h3>
        <table className="atb-table">
          <thead><tr><th>产品层级</th><th>规划价格带</th><th>定位说明</th></tr></thead>
          <tbody>
            {prices.map((row) => (
              <tr key={row.item}>
                <th scope="row">{row.item}</th>
                <td>{row.price}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="atb-note">
          隐藏款不单独定价、端盒有保底；以上为规划价格带，最终价格待量产成本核算与供应链报价后校准。
        </p>

        <h3 className="atb-sub-title">收入结构与增长路径</h3>
        <div className="atb-revenue">
          {revenue.map((item) => (
            <div key={item.label} style={{ '--w': String(item.value) } as CSSProperties}>
              <span className="atb-revenue-label">{item.label}<em>{item.value}%</em></span>
              <div className="atb-revenue-bar"><i /></div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="atb-stages">
          {stages.map((stage) => (
            <article key={stage.phase}>
              <span className="atb-eyebrow">{stage.phase}</span>
              <h4>{stage.title}</h4>
              <p>{stage.text}</p>
            </article>
          ))}
        </div>

        <h3 className="atb-sub-title">护城河：竞品可以抄款式，抄不走世界观</h3>
        <div className="atb-moat">
          {moat.map((item) => (
            <div key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 05 传播 ---------- */}
      <section className="atb-section" id="spread">
        <header className="atb-section-head">
          <span className="atb-eyebrow">05 / 宣传逻辑</span>
          <h2>一条世界线上线，<em>就是一次文化事件</em></h2>
          <p>海报定调、官网承接深度、公众号维持温度、概念短片制造峰值——四个渠道各司其职，不打重复的仗。</p>
        </header>

        <div className="atb-funnel">
          {funnel.map((step, i) => (
            <div key={step.from}>
              <span className="atb-num">{String(i + 1).padStart(2, '0')}</span>
              <h4>{step.from}</h4>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <h3 className="atb-sub-title">三轨传播：借别人的场子，讲我们的故事</h3>
        <div className="atb-channels">
          {channels.map((track) => (
            <article key={track.title}>
              <header>
                <h4>{track.title}</h4>
                <small>{track.mode}</small>
              </header>
              <ul>{track.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>

        <div className="atb-community">
          <h3 className="atb-sub-title">社群反哺：让用户替我们写下一弹</h3>
          <p>
            社群不是客服群，而是选题会：用户的晒单、二创与投票，直接决定下一弹的文化空间选谁、
            联动博主找谁、隐藏款给谁。核心机制是让社群投票决定「下一个穿越的文化空间」——
            把最贵的市场调研，变成用户抢着参与的互动。
          </p>
          <ol className="atb-flow">
            {['抽盒晒单', '角色二创', '投票选题', '粉丝共创', '下一弹'].map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>

      {/* ---------- 06 落地 ---------- */}
      <section className="atb-section" id="delivery">
        <header className="atb-section-head">
          <span className="atb-eyebrow">06 / 落地执行与展望</span>
          <h2>从一页剧本，<em>到一次开盒</em></h2>
          <p>M1-M3 出内容，M4-M5 出渠道，M6 出数据——每个里程碑都有唯一验收物。</p>
        </header>

        <ol className="atb-milestones">
          {milestones.map((item) => (
            <li key={item.id}>
              <span>{item.id}</span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>

        <div className="atb-craft">
          <figure>
            <img src={atbImage('model-wire')} alt="四角色 3D 建模线框" loading="lazy" />
            <figcaption>角色 3D 建模 · 灰模与线框</figcaption>
          </figure>
          <figure>
            <img src={atbImage('web-atb')} alt="兽华物语网页设计" loading="lazy" />
            <figcaption>网页设计 · 3D 角色与世界线入口</figcaption>
          </figure>
        </div>

        <div className="atb-outlook">
          <h3>世界线之后，还有世界线</h3>
          <p>
            盛唐、百老汇、亚文化三条线跑通「一空间一弹」的模型后，任何文化空间都可以成为新世界线——
            第四弹选题池已经备好：大航海时代水手线、哥特亚文化扩展线、博物馆特展临时联动线。
          </p>
          <p className="atb-note">
            每一条新世界线都会被五个环节放大一次：联动带来新用户，用户在社群里共创，
            共创结论反哺下一个空间选题——世界观越转越厚，获客成本越转越低。
          </p>
        </div>
      </section>

      <footer className="atb-end">
        <p className="atb-end-claim">{atbMeta.claim}</p>
        <p className="atb-end-line">盛唐幻境 · 百老汇之梦 · 霓虹地下城 —— 首弹敬请期待</p>
        <p className="atb-end-meta">{atbMeta.team} · 兽华物语项目组 · IP 商业企划书 · {atbMeta.year}</p>
        <Link className="atb-btn atb-btn-solid" to="/#worlds">回到四个世界 ↗</Link>
      </footer>
    </main>
  )
}
