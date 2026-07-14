import { useState, useMemo } from "react";

// ─── 원본 CSV (TalkFile ESG 더미데이터.csv) ───
const CSV = `팀번호,팀이름,팀유형,주차,출결률,과제제출률,발표참여도,휴대폰매너,안전수칙준수율,그라운드룰준수,텀블러사용률,에어컨전등관리,잔반량(g),잔반점수,G소계,S소계,E소계,종합점수,등급
1,대한민국,우수,1,92.3,91.4,92.1,90,100,100,90.3,89.9,48.8,75.6,91.9,96.7,85.2,91.3,A
1,대한민국,우수,2,92.6,91.9,96.5,100,90,100,91.6,89.9,69.1,65.4,93.7,96.7,82.3,90.9,A
1,대한민국,우수,3,95.1,87.6,96.5,100,90,100,93.5,90.5,38.4,80.8,93.1,96.7,88.2,92.7,A
1,대한민국,우수,4,90.2,92.3,91.3,100,100,100,96.8,94.8,48.3,75.9,91.2,100.0,89.2,93.5,A
2,브라질,우수,1,94.3,92.1,93.9,90,100,100,94.6,100.0,60.7,69.6,93.4,96.7,88.1,92.7,A
2,브라질,우수,2,84.5,86.5,94.5,90,80,100,88.4,93.9,63.0,68.5,88.5,90.0,83.6,87.4,B
2,브라질,우수,3,97.9,87.5,95.8,100,80,100,98.9,93.8,33.2,83.4,93.7,93.3,92.1,93.0,A
2,브라질,우수,4,89.5,93.3,86.5,100,100,100,90.9,91.8,59.6,70.2,89.8,100.0,84.3,91.4,A
3,아르헨티나,평균,1,81.1,91.0,86.4,100,100,90,80.8,77.1,117.9,41.0,86.2,96.7,66.3,83.1,B
3,아르헨티나,평균,2,81.7,73.5,69.6,100,90,90,72.5,80.1,94.9,52.6,75.0,93.3,68.4,78.9,C
3,아르헨티나,평균,3,75.9,66.3,88.6,100,100,90,73.9,68.7,83.7,58.2,76.9,96.7,66.9,80.2,B
3,아르헨티나,평균,4,74.9,74.8,80.7,90,80,90,67.6,69.7,109.1,45.4,76.8,86.7,60.9,74.8,C
4,프랑스,평균,1,77.4,88.8,88.8,90,70,80,61.4,69.7,103.4,48.3,85.0,80.0,59.8,74.9,C
4,프랑스,평균,2,88.5,75.6,72.1,90,100,80,81.0,80.0,81.0,59.5,78.7,90.0,73.5,80.7,B
4,프랑스,평균,3,78.4,81.5,69.1,100,100,80,79.7,88.1,107.9,46.0,76.3,93.3,71.3,80.3,B
4,프랑스,평균,4,82.0,76.1,70.8,70,70,70,69.1,80.7,109.4,45.3,76.3,70.0,65.0,70.4,C
5,잉글랜드,우수,1,91.4,84.3,92.6,100,90,100,91.9,86.7,49.7,75.1,89.4,96.7,84.6,90.2,A
5,잉글랜드,우수,2,94.5,100.0,86.7,100,90,100,94.9,93.3,50.6,74.7,93.8,96.7,87.6,92.7,A
5,잉글랜드,우수,3,97.5,96.7,90.5,90,90,100,94.0,100.0,49.7,75.2,94.9,93.3,89.7,92.6,A
5,잉글랜드,우수,4,93.3,94.0,91.5,90,100,100,93.4,100.0,65.5,67.3,92.9,96.7,86.9,92.2,A
6,스페인,평균,1,74.2,62.8,65.6,100,100,90,63.6,67.0,127.8,36.1,67.5,96.7,55.6,73.3,C
6,스페인,평균,2,77.9,69.9,62.4,90,100,90,78.3,64.1,89.8,55.1,70.1,93.3,65.8,76.4,C
6,스페인,평균,3,73.8,70.2,75.5,90,70,100,72.1,88.2,86.5,56.8,73.2,86.7,72.4,77.4,C
6,스페인,평균,4,77.5,61.8,81.8,100,90,100,71.4,83.5,97.0,51.5,73.7,96.7,68.8,79.7,C
7,독일,개선필요,1,44.5,39.1,48.1,100,70,70,61.7,69.3,153.1,23.5,43.9,80.0,51.5,58.5,E
7,독일,개선필요,2,48.7,70.4,45.5,90,80,100,56.8,52.3,149.6,25.2,54.9,90.0,44.8,63.2,D
7,독일,개선필요,3,60.6,59.8,51.2,70,20,70,38.2,51.6,173.5,13.3,57.2,53.3,34.4,48.3,E
7,독일,개선필요,4,58.8,58.7,64.1,90,90,70,58.6,45.8,184.8,7.6,60.6,83.3,37.3,60.4,D
8,포르투갈,개선필요,1,46.0,65.3,54.8,90,60,80,41.3,46.7,203.2,0.0,55.3,76.7,29.3,53.8,E
8,포르투갈,개선필요,2,58.9,42.8,56.4,70,80,90,63.6,61.1,142.2,28.9,52.7,80.0,51.2,61.3,D
8,포르투갈,개선필요,3,58.1,54.0,53.4,90,60,70,71.2,48.2,169.6,15.2,55.2,73.3,44.9,57.8,E
8,포르투갈,개선필요,4,57.6,68.4,62.1,80,70,50,59.0,55.4,171.5,14.2,62.7,66.7,42.9,57.4,E
9,네덜란드,평균,1,84.3,68.3,58.6,90,100,90,72.5,67.9,116.6,41.7,70.4,93.3,60.7,74.8,C
9,네덜란드,평균,2,81.0,80.4,78.9,90,100,90,80.1,67.3,115.2,42.4,80.1,93.3,63.3,78.9,C
9,네덜란드,평균,3,61.7,79.2,73.8,100,100,100,77.0,71.7,104.3,47.8,71.6,100.0,65.5,79.0,C
9,네덜란드,평균,4,85.1,70.1,74.0,100,90,100,70.8,72.8,85.3,57.4,76.4,96.7,67.0,80.0,B
10,벨기에,우수,1,88.8,86.6,90.7,100,100,100,85.4,98.9,35.1,82.5,88.7,100.0,88.9,92.5,A
10,벨기에,우수,2,91.5,94.6,95.1,100,90,90,92.6,87.1,51.9,74.1,93.7,93.3,84.6,90.5,A
10,벨기에,우수,3,89.5,97.7,93.0,100,90,100,96.9,92.9,45.2,77.4,93.4,96.7,89.1,93.1,A
10,벨기에,우수,4,95.7,95.3,86.6,100,100,90,89.5,89.4,42.2,78.9,92.5,96.7,85.9,91.7,A
11,일본,평균,1,75.0,72.0,83.9,90,80,80,74.4,81.6,88.6,55.7,77.0,83.3,70.5,76.9,C
11,일본,평균,2,76.4,75.3,86.3,80,90,80,83.9,68.9,102.3,48.8,79.3,83.3,67.2,76.6,C
11,일본,평균,3,83.5,74.0,75.9,90,90,90,71.6,67.0,88.0,56.0,77.8,90.0,64.9,77.6,C
11,일본,평균,4,68.6,78.9,69.7,80,90,90,86.7,75.3,121.5,39.3,72.4,86.7,67.1,75.4,C
12,미국,개선필요,1,68.5,74.1,61.3,90,70,90,52.7,52.0,149.5,25.2,67.9,83.3,43.3,64.8,D
12,미국,개선필요,2,56.4,55.3,61.4,80,90,70,55.6,61.1,150.5,24.8,57.7,80.0,47.2,61.6,D
12,미국,개선필요,3,52.1,62.2,48.0,80,80,70,53.2,48.8,184.4,7.8,54.1,76.7,36.6,55.8,E
12,미국,개선필요,4,67.5,59.4,71.7,70,70,80,66.1,38.9,196.7,1.7,66.2,73.3,35.6,58.4,E
13,멕시코,우수,1,95.2,92.6,99.2,100,100,90,91.7,94.3,58.3,70.8,95.7,96.7,85.6,92.7,A
13,멕시코,우수,2,94.6,88.7,99.4,100,90,100,93.1,91.1,51.4,74.3,94.2,96.7,86.2,92.4,A
13,멕시코,우수,3,89.0,83.4,100.0,100,100,100,99.9,94.5,39.9,80.1,90.8,100.0,91.5,94.1,A
13,멕시코,우수,4,91.7,87.9,97.2,80,100,90,93.9,89.8,65.1,67.5,92.3,90.0,83.7,88.7,B
14,캐나다,평균,1,78.7,79.9,78.6,80,80,70,78.3,71.0,86.4,56.8,79.1,76.7,68.7,74.8,C
14,캐나다,평균,2,89.0,63.9,66.5,100,90,90,63.7,69.8,101.1,49.5,73.2,93.3,61.0,75.8,C
14,캐나다,평균,3,68.8,78.6,74.9,60,100,80,82.4,78.4,131.7,34.2,74.1,80.0,65.0,73.0,C
14,캐나다,평균,4,75.6,68.4,69.5,90,80,80,59.6,75.4,150.1,24.9,71.2,83.3,53.3,69.3,D
15,모로코,평균,1,83.3,77.5,74.2,100,80,100,77.3,72.2,71.0,64.5,78.3,93.3,71.3,81.0,B
15,모로코,평균,2,81.1,68.4,68.9,100,100,100,76.4,70.8,126.0,37.0,72.8,100.0,61.4,78.1,C
15,모로코,평균,3,72.7,71.7,72.2,90,90,90,72.0,71.7,119.0,40.5,72.2,90.0,61.4,74.5,C
15,모로코,평균,4,78.3,84.2,73.5,80,90,90,68.4,64.1,44.3,77.8,78.7,86.7,70.1,78.5,C
16,크로아티아,평균,1,70.0,81.3,70.3,90,80,100,70.4,78.1,100.3,49.9,73.9,90.0,66.1,76.7,C
16,크로아티아,평균,2,68.9,63.7,84.4,90,80,80,72.7,71.9,57.5,71.2,72.4,83.3,71.9,75.9,C
16,크로아티아,평균,3,71.1,50.0,72.5,90,50,90,76.7,71.0,95.6,52.2,64.5,76.7,66.6,69.3,D
16,크로아티아,평균,4,69.6,70.6,93.0,70,50,90,76.0,80.7,62.4,68.8,77.7,70.0,75.2,74.3,C
17,호주,개선필요,1,56.8,49.3,60.5,60,100,50,58.7,65.9,194.0,3.0,55.5,70.0,42.6,56.0,E
17,호주,개선필요,2,56.3,47.2,54.8,60,80,30,57.7,54.5,136.4,31.8,52.8,56.7,48.0,52.5,E
17,호주,개선필요,3,54.4,34.4,50.5,80,60,60,57.5,51.6,153.8,23.1,46.4,66.7,44.1,52.4,E
17,호주,개선필요,4,56.2,53.2,61.6,70,70,50,54.0,61.0,207.5,0.0,57.0,63.3,38.3,52.9,E
18,스위스,평균,1,66.1,65.7,86.6,100,100,100,70.1,68.4,146.1,27.0,72.8,100.0,55.1,76.0,C
18,스위스,평균,2,72.8,70.4,79.6,60,60,100,82.1,68.9,100.9,49.6,74.3,73.3,66.8,71.5,C
18,스위스,평균,3,72.8,75.8,66.2,90,100,80,93.2,69.9,92.8,53.6,71.6,90.0,72.2,77.9,C
18,스위스,평균,4,74.5,70.4,90.3,90,80,90,77.4,66.1,128.3,35.9,78.4,86.7,59.8,75.0,C`;

const rows = CSV.trim().split("\n").slice(1).map((line) => {
  const c = line.split(",");
  return {
    no: +c[0], name: c[1], week: +c[3],
    출결률: +c[4], 과제제출률: +c[5], 발표참여도: +c[6],
    휴대폰매너: +c[7], 안전수칙준수율: +c[8], 그라운드룰준수: +c[9],
    텀블러사용률: +c[10], 에어컨전등관리: +c[11], 잔반점수: +c[13],
    G: +c[14], S: +c[15], E: +c[16], total: +c[17],
  };
});

const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const gradeOf = (s) => (s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : "E");
const GRADE_BG = { A: "#E5F6EE", B: "#E8F3FF", C: "#FFF3D6", D: "#FFEADB", E: "#FDE9E7" };
const GRADE_FG = { A: "#00A05E", B: "#3182F6", C: "#B7791F", D: "#D4590F", E: "#E5484D" };

function shade(hex, p) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = p < 0 ? 0 : 255, q = Math.abs(p);
  r = Math.round(r + (t - r) * q); g = Math.round(g + (t - g) * q); b = Math.round(b + (t - b) * q);
  return `rgb(${r},${g},${b})`;
}

const PILLARS = [
  { key: "E", label: "환경", color: "#00A05E",
    metrics: [["텀블러사용률", "텀블러 사용률", "#00A05E"], ["에어컨전등관리", "에어컨·전등 관리", "#0D9BB5"], ["잔반점수", "잔반 점수", "#7CB518"]] },
  { key: "S", label: "사회", color: "#3182F6",
    metrics: [["휴대폰매너", "휴대폰 매너", "#3182F6"], ["안전수칙준수율", "안전수칙 준수율", "#0EA5E9"], ["그라운드룰준수", "그라운드룰 준수", "#06B6D4"]] },
  { key: "G", label: "거버넌스", color: "#6B5CE7",
    metrics: [["출결률", "출결률", "#6B5CE7"], ["과제제출률", "과제 제출률", "#9D4EDD"], ["발표참여도", "발표 참여도", "#E255A1"]] },
];

export default function App() {
  const [week, setWeek] = useState(0);
  const [tab, setTab] = useState("종합");
  const [modal, setModal] = useState(null); // {type:'metric', mk, ml, color} | {type:'teams'}

  const teams = useMemo(() => {
    const map = {};
    rows.forEach((r) => (map[r.no] = map[r.no] || []).push(r));
    return Object.values(map).map((list) => {
      const sel = week === 0 ? list : list.filter((r) => r.week === week);
      const t = { no: list[0].no, name: list[0].name };
      ["G", "S", "E", "total", "출결률", "과제제출률", "발표참여도", "휴대폰매너",
        "안전수칙준수율", "그라운드룰준수", "텀블러사용률", "에어컨전등관리", "잔반점수"]
        .forEach((k) => (t[k] = avg(sel.map((r) => r[k]))));
      t.grade = gradeOf(t.total);
      return t;
    });
  }, [week]);

  const ranked = useMemo(() => [...teams].sort((a, b) => b.total - a.total), [teams]);
  const overall = {
    E: avg(teams.map((t) => t.E)), S: avg(teams.map((t) => t.S)),
    G: avg(teams.map((t) => t.G)), total: avg(teams.map((t) => t.total)),
  };
  const weekTrend = useMemo(
    () => [1, 2, 3, 4].map((w) => avg(rows.filter((r) => r.week === w).map((r) => r.total))),
    []
  );
  const champion = ranked[0];
  const pillar = PILLARS.find((p) => p.key === tab);
  const weekLbl = week === 0 ? "4주 평균" : `${week}주차`;

  return (
    <div className="app">
      <style>{css}</style>
      <main>
        <header className="hdr">
          <div>
            <h1 className="page-title">SVP 킥오프차수 ESG 달성률</h1>
            <p className="page-sub">18개 조 · 9개 평가항목 · {weekLbl}</p>
          </div>
          <div className="pills" role="tablist" aria-label="주차 선택">
            {[0, 1, 2, 3, 4].map((w) => (
              <button key={w} role="tab" aria-selected={week === w}
                className={"pill" + (week === w ? " on" : "")} onClick={() => setWeek(w)}>
                {w === 0 ? "전체" : `${w}주차`}
              </button>
            ))}
          </div>
        </header>

        {/* ── SVP 전체 달성률 ── */}
        <div className="sec-lbl">SVP 전체 달성률</div>
        <section className="overview">
          <div className="card ov-main">
            <div className="ov-left">
              <div className="ov-lbl">종합 ESG 점수 · {weekLbl}</div>
              <div className="ov-val">
                {overall.total.toFixed(1)}<span className="unit">%</span>
                <span className="ov-grade" style={{ background: GRADE_BG[gradeOf(overall.total)], color: GRADE_FG[gradeOf(overall.total)] }}>
                  {gradeOf(overall.total)}등급
                </span>
              </div>
              <div className="ov-bars">
                {PILLARS.map((p) => (
                  <div key={p.key} className="ov-row">
                    <span className="ov-k"><i style={{ background: p.color }} />{p.label}</span>
                    <div className="thin"><div className="thin-fill" style={{ width: `${overall[p.key]}%`, background: p.color }} /></div>
                    <span className="ov-v">{overall[p.key].toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ov-right">
              <div className="ov-lbl">주차별 추이 (전체 평균)</div>
              <TrendChart data={weekTrend} activeWeek={week} onPick={setWeek} />
            </div>
          </div>

          {champion && (
            <div className="card champ">
              <div className="ov-lbl dim">최우수 달성 조 · 종합 1위</div>
              <div className="champ-row">
                <div>
                  <div className="champ-name">{champion.name}</div>
                  <div className="champ-sub">{weekLbl} 기준 · {champion.grade}등급</div>
                </div>
                <div className="champ-score">{champion.total.toFixed(1)}<span>%</span></div>
              </div>
              <div className="champ-esg">
                {PILLARS.map((p) => (
                  <div key={p.key} className="ce">
                    <div className="ce-k">{p.label}</div>
                    <div className="ce-v">{champion[p.key].toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── 조별 달성률 ── */}
        <div className="sec-lbl">조별 달성률</div>
        <div className="tabs-row">
          <div className="pills" role="tablist" aria-label="카테고리 선택">
            {["종합", ...PILLARS.map((p) => p.key)].map((k) => {
              const p = PILLARS.find((x) => x.key === k);
              return (
                <button key={k} role="tab" aria-selected={tab === k}
                  className={"pill" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>
                  {p ? p.label : "종합"}
                </button>
              );
            })}
          </div>
          {tab === "종합" && (
            <button className="more" onClick={() => setModal({ type: "teams" })}>전체보기</button>
          )}
        </div>

        {tab === "종합" ? (
          <div className="rows">
            {ranked.slice(0, 6).map((t, i) => (
              <TeamRow key={t.no} t={t} rank={i + 1} />
            ))}
          </div>
        ) : (
          <div className="charts">
            {pillar.metrics.map(([mk, ml, mc]) => (
              <div key={mk} className="card chart-card">
                <div className="chart-head">
                  <div>
                    <div className="chart-ttl">{ml}</div>
                    <div className="chart-desc">상위 5개 조 · {weekLbl}</div>
                  </div>
                  <button className="more" onClick={() => setModal({ type: "metric", mk, ml, color: mc })}>
                    전체보기
                  </button>
                </div>
                <BarChart teams={teams} metric={mk} color={mc} />
              </div>
            ))}
          </div>
        )}

        <footer className="foot">
          점수화 방식 — 비율형 지표는 비율 그대로, 위반형 지표는 100점에서 감점, 잔반량은 적을수록 고득점(역산) ·
          영역별 소계는 3개 지표 평균, 종합 점수는 E/S/G 3개 영역 평균
        </footer>
      </main>

      {/* ── 전체보기 팝업 ── */}
      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-ttl">{modal.type === "teams" ? "조별 종합 순위" : modal.ml}</div>
                <div className="modal-sub">전체 18개 조 · {weekLbl}</div>
              </div>
              <button className="x" aria-label="닫기" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {modal.type === "teams" ? (
                <div className="rows">
                  {ranked.map((t, i) => <TeamRow key={t.no} t={t} rank={i + 1} />)}
                </div>
              ) : (
                <BarChart teams={teams} metric={modal.mk} color={modal.color} full />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamRow({ t, rank }) {
  return (
    <div className={"card trow" + (rank === 1 ? " hi" : "")}>
      <span className={"rank" + (rank <= 3 ? " top" : "")}>{rank}</span>
      <div className="trow-name">
        <span className="tname">{t.name}</span>
        <span className="gr" style={{ background: GRADE_BG[t.grade], color: GRADE_FG[t.grade] }}>{t.grade}</span>
      </div>
      <div className="donuts">
        {PILLARS.map((p) => (
          <Donut key={p.key} value={t[p.key]} color={p.color} label={p.label} />
        ))}
      </div>
      <div className="trow-total">
        <span className="tt-lbl">종합</span>
        <span className="tscore">{t.total.toFixed(1)}<em>%</em></span>
      </div>
    </div>
  );
}

function Donut({ value, color, label }) {
  const size = 56, stroke = 7, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="donut">
      <div className="donut-svg" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={`${label} ${value.toFixed(1)}%`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F2F4F6" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={c}
            strokeDashoffset={c * (1 - Math.min(value, 100) / 100)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        </svg>
        <span className="donut-v">{value.toFixed(0)}</span>
      </div>
      <span className="donut-l">{label}</span>
    </div>
  );
}

/* 주차별 추이 라인 차트 */
function TrendChart({ data, activeWeek, onPick }) {
  const W = 260, H = 120, PL = 30, PR = 12, PT = 14, PB = 22;
  const min = Math.floor(Math.min(...data) - 2), max = Math.ceil(Math.max(...data) + 2);
  const x = (i) => PL + (i * (W - PL - PR)) / (data.length - 1);
  const y = (v) => PT + (1 - (v - min) / (max - min)) * (H - PT - PB);
  const pts = data.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `${PL},${H - PB} ${line} ${x(data.length - 1)},${H - PB}`;
  return (
    <svg className="trend" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="주차별 전체 평균 추이">
      {[min, (min + max) / 2, max].map((v) => (
        <g key={v}>
          <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} className="gridline" />
          <text x={PL - 6} y={y(v) + 3} className="axis" textAnchor="end">{v.toFixed(0)}</text>
        </g>
      ))}
      <polygon points={area} fill="#E8F3FF" />
      <polyline points={line} fill="none" stroke="#3182F6" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i} style={{ cursor: "pointer" }} onClick={() => onPick(i + 1)}>
          <circle cx={p[0]} cy={p[1]} r="10" fill="transparent" />
          <circle cx={p[0]} cy={p[1]} r={activeWeek === i + 1 ? 5 : 3.5}
            fill={activeWeek === i + 1 ? "#3182F6" : "#fff"} stroke="#3182F6" strokeWidth="2" />
          <text x={p[0]} y={p[1] - 9} className="pt-val" textAnchor="middle">{data[i].toFixed(1)}</text>
          <text x={p[0]} y={H - 6} className="axis" textAnchor="middle">{i + 1}주</text>
        </g>
      ))}
    </svg>
  );
}

/* 지표별 세로 막대그래프 — 기본: 상위 5개 조 / full: 전체 18개 조 */
const BAR_H = 150;
function BarChart({ teams, metric, color, full = false }) {
  const sorted = [...teams].sort((a, b) => b[metric] - a[metric]);
  const shown = full ? sorted : sorted.slice(0, 5);
  return (
    <div className={"bc-scroll" + (full ? " is-full" : "")}>
      <div className={"bc " + (full ? "full" : "compact")}>
        <div className="bc-grid" aria-hidden="true">
          {[100, 75, 50, 25].map((v) => (
            <div key={v} className="bc-gl" style={{ bottom: `${(v / 100) * BAR_H}px` }}>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <div className="bc-cols">
          {shown.map((t, i) => {
            const hl = i < 5;
            return (
              <div key={t.no} className="bc-col" title={`${i + 1}위 ${t.name} · ${t[metric].toFixed(1)}%`}>
                <div className="bc-bar-area" style={{ height: BAR_H }}>
                  <div className="b2" style={{ height: `${Math.min(Math.max(t[metric], 1), 100)}%`, background: hl ? color : "#D8DDE4" }}>
                    {hl && (
                      <span className="bc-val" style={{ color: shade(color, -0.12) }}>
                        {t[metric].toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                {full
                  ? <span className="bc-name-v" style={hl ? { color: shade(color, -0.12), fontWeight: 700 } : null}>{t.name}</span>
                  : <span className="bc-name-h">{t.name}</span>}
                <span className={"bc-rank" + (hl ? " top" : "")}>{i + 1}위</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const css = `
:root{
  --bg:#F2F4F6; --surface:#FFF; --surface-2:#F2F4F6;
  --line:#EAECEF;
  --txt-pri:#191F28; --txt-sec:#4E5968; --txt-ter:#8B95A1;
  --accent:#3182F6; --accent-soft:#E8F3FF;
  --r-md:14px; --r-lg:20px;
  --sh:0 2px 10px rgba(25,31,40,.05);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.app{min-height:100vh;background:var(--bg);color:var(--txt-pri);
  font-family:'Malgun Gothic','맑은 고딕','Apple SD Gothic Neo','Noto Sans KR',sans-serif;
  letter-spacing:-.02em;-webkit-font-smoothing:antialiased}
main{max-width:1060px;margin:0 auto;padding:28px 16px 48px}
button{font-family:inherit;cursor:pointer;border:none;background:none}

.hdr{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:26px}
.page-title{font-size:23px;font-weight:800;letter-spacing:-.04em}
.page-sub{font-size:13px;color:var(--txt-ter);margin-top:5px}
.sec-lbl{font-size:12px;font-weight:700;color:var(--txt-ter);margin:26px 0 10px}
.sec-lbl:first-of-type{margin-top:0}

.pills{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.pills::-webkit-scrollbar{display:none}
.pill{flex-shrink:0;padding:7px 14px;border-radius:20px;font-size:13px;font-weight:600;
  background:var(--surface);color:var(--txt-sec);transition:all .12s;box-shadow:var(--sh)}
.pill.on{background:var(--txt-pri);color:#fff}
.pill:focus-visible,.more:focus-visible,.x:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.tabs-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.more{font-size:13px;font-weight:700;color:var(--accent);padding:6px 10px;border-radius:10px;flex-shrink:0}
.more:hover{background:var(--accent-soft)}
.more::after{content:' ›';font-weight:400}

.card{background:var(--surface);border-radius:var(--r-lg);padding:20px;box-shadow:var(--sh)}

.overview{display:grid;grid-template-columns:1.55fr 1fr;gap:12px}
@media(max-width:820px){.overview{grid-template-columns:1fr}}
.ov-main{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}
@media(max-width:560px){.ov-main{grid-template-columns:1fr}}
.ov-lbl{font-size:12px;font-weight:600;color:var(--txt-ter);margin-bottom:9px}
.ov-val{font-size:42px;font-weight:800;letter-spacing:-.04em;line-height:1;display:flex;align-items:baseline;gap:9px;margin-bottom:18px}
.ov-val .unit{font-size:18px;color:var(--txt-ter);font-weight:600;margin-left:-5px}
.ov-grade{font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px}
.ov-bars{display:grid;gap:10px}
.ov-row{display:grid;grid-template-columns:76px 1fr 50px;align-items:center;gap:10px}
.ov-row.sm{grid-template-columns:64px 1fr 48px;gap:8px}
.ov-k{font-size:12px;font-weight:600;color:var(--txt-sec);display:flex;align-items:center;gap:6px}
.ov-k i{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.thin{height:5px;background:var(--surface-2);border-radius:3px;overflow:hidden}
.thin-fill{height:100%;border-radius:3px;transition:width .5s ease}
.ov-v{font-size:12px;font-weight:700;color:var(--txt-sec);text-align:right;font-variant-numeric:tabular-nums}

.trend{width:260px;max-width:100%;display:block}
.gridline{stroke:var(--line);stroke-width:1}
.axis{font-size:9px;fill:var(--txt-ter);font-family:inherit}
.pt-val{font-size:9px;font-weight:700;fill:var(--txt-sec)}

.champ{background:var(--accent);color:#fff}
.champ .ov-lbl.dim{color:rgba(255,255,255,.75)}
.champ-row{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.champ-name{font-size:23px;font-weight:800;letter-spacing:-.04em}
.champ-sub{font-size:12px;color:rgba(255,255,255,.75);font-weight:500;margin-top:3px}
.champ-score{margin-left:auto;font-size:34px;font-weight:800;letter-spacing:-.04em}
.champ-score span{font-size:15px;font-weight:600;color:rgba(255,255,255,.7)}
.champ-esg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ce{background:rgba(255,255,255,.16);border-radius:var(--r-md);padding:10px 12px}
.ce-k{font-size:11px;font-weight:600;color:rgba(255,255,255,.75)}
.ce-v{font-size:17px;font-weight:800;margin-top:3px;font-variant-numeric:tabular-nums}

.rows{display:grid;gap:8px}
.trow{display:grid;grid-template-columns:30px minmax(120px,1fr) auto 84px;align-items:center;gap:14px;padding:14px 18px}
@media(max-width:600px){.trow{grid-template-columns:26px 1fr;row-gap:12px}
  .trow .donuts{grid-column:1/-1;justify-content:space-around}
  .trow .trow-total{grid-column:1/-1;justify-content:flex-end;display:flex;align-items:baseline;gap:6px}}
.trow.hi{box-shadow:0 0 0 2px var(--accent),var(--sh)}
.trow-name{display:flex;align-items:center;gap:8px;min-width:0}
.rank{font-size:12px;font-weight:700;color:var(--txt-ter);background:var(--surface-2);
  width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-variant-numeric:tabular-nums}
.rank.top{background:var(--txt-pri);color:#fff}
.tname{font-size:14.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gr{font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;flex-shrink:0}
.donuts{display:flex;gap:18px}
.donut{display:flex;flex-direction:column;align-items:center;gap:4px}
.donut-svg{position:relative}
.donut-v{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}
.donut-l{font-size:10.5px;font-weight:600;color:var(--txt-ter)}
.trow-total{text-align:right}
.tt-lbl{display:block;font-size:10.5px;font-weight:600;color:var(--txt-ter);margin-bottom:2px}
.tscore{font-size:18px;font-weight:800;font-variant-numeric:tabular-nums}
.tscore em{font-style:normal;font-size:11px;color:var(--txt-ter);font-weight:500}

.charts{display:grid;gap:12px}
.chart-card{padding:20px 20px 14px}
.chart-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}
.chart-ttl{font-size:15.5px;font-weight:800}
.chart-desc{font-size:12px;color:var(--txt-ter);margin-top:3px}

.bc-scroll{overflow-x:auto;scrollbar-width:thin;padding-bottom:4px}
.bc{position:relative;padding-top:18px}
.bc-grid{position:absolute;left:0;right:0;pointer-events:none}
.bc-gl{position:absolute;left:0;right:0;border-top:1px dashed var(--line)}
.bc-gl span{position:absolute;left:0;top:-12px;font-size:10px;color:var(--txt-ter)}
.bc-cols{display:flex;align-items:flex-end;padding-left:26px;padding-right:8px}
.bc-col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px}
.bc-bar-area{width:100%;display:flex;align-items:flex-end;justify-content:center}
.b2{position:relative;width:100%;border-radius:6px 6px 0 0}
.bc-val{position:absolute;top:-17px;left:50%;transform:translateX(-50%);
  font-size:11px;font-weight:700;white-space:nowrap;font-variant-numeric:tabular-nums}
.bc-rank{font-size:10px;color:var(--txt-ter);font-weight:600;font-variant-numeric:tabular-nums;height:13px;line-height:13px}
.bc-rank.top{color:var(--txt-pri);font-weight:700}

/* 상위 5개 미리보기 */
.bc.compact .bc-cols{gap:22px}
.bc.compact .b2{max-width:44px}
.bc.compact .bc-grid{bottom:41px}                 /* 6+16+6+13 */
.bc-name-h{font-size:12px;font-weight:600;color:var(--txt-sec);height:16px;line-height:16px;white-space:nowrap}

/* 전체 18개 (팝업) */
.bc.full{min-width:820px}
.bc.full .bc-cols{gap:9px}
.bc.full .b2{max-width:24px}
.bc.full .bc-grid{bottom:97px}                    /* 6+72+6+13 */
.bc-name-v{font-size:11px;color:var(--txt-sec);writing-mode:vertical-rl;height:72px;
  display:flex;align-items:center;justify-content:flex-start;letter-spacing:.02em;white-space:nowrap;overflow:visible}

/* 팝업 */
.modal-bg{position:fixed;inset:0;z-index:500;background:rgba(25,31,40,.45);
  display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--surface);border-radius:24px;width:100%;max-width:940px;max-height:86vh;
  display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(25,31,40,.2)}
.modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:22px 22px 12px}
.modal-ttl{font-size:18px;font-weight:800;letter-spacing:-.03em}
.modal-sub{font-size:12.5px;color:var(--txt-ter);margin-top:4px}
.x{width:34px;height:34px;border-radius:50%;background:var(--surface-2);color:var(--txt-sec);
  font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.x:hover{background:var(--line)}
.modal-body{padding:6px 22px 22px;overflow-y:auto}

.foot{margin-top:28px;font-size:11.5px;color:var(--txt-ter);text-align:center;line-height:1.7}
@media(prefers-reduced-motion:reduce){.thin-fill{transition:none}}
`;
