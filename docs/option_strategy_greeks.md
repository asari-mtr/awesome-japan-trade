---
layout: default
title: オプション戦略別Greeks
nav_order: 8
---

# オプション戦略別Greeks (Strategy Greeks)

戦略名だけではリスクは決まらない。最終的にはDelta、Gamma、Vega、Theta、Skew、Term、最大損失の組み合わせで評価する。

## 1. 戦略別の典型的なGreek profile

| 戦略 | Delta | Gamma | Vega | Theta | 向く局面 |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Long Call** | + | + | + | - | 上方向ブレイク、低IV |
| **Long Put** | - | + | + | - | 下方向ブレイク、ヘッジ |
| **CDS** | + | 小〜中 | 小〜中 | 小 | 上昇を限定リスクで取りたい |
| **PDS** | - | 小〜中 | 小〜中 | 小 | 下落を限定リスクで取りたい |
| **Short Strangle** | 中立寄り | - | - | + | 高IVレンジ |
| **Iron Condor** | 中立寄り | - | - | + | 高IVレンジ、損失限定 |
| **Long Straddle** | 中立開始 | + | + | - | 方向不明の大変動 |
| **Calendar Spread** | 近ATMで中立寄り | 期近に依存 | +寄り | +寄り | 期先保有、期近売り |
| **Butterfly** | 中心価格次第 | 中心付近で-になりやすい | -寄り | +寄り | SQ着地狙い |

## 2. 見落としやすいリスク

- **Gamma risk**: ショートGamma戦略は平常時に安定しやすいが、急変時に損失が加速する。
- **Vega risk**: IV低下を期待して売った戦略でも、相場急変でIVが上がると損失が膨らむ。
- **Skew risk**: Put側だけが急騰すると、Vega中立に見えるポジションでも損益が崩れる。
- **Term risk**: Calendar/Diagonalは、期近と期先のIV差が逆方向に動くと想定外の損益になる。
- **Charm risk**: SQ接近や週末前後に、時間経過だけでDeltaが変化する。
- **Volga / Vomma risk**: IVが急変したとき、VegaそのものがIVに対して非線形に変化する。VommaはATM付近でほぼゼロで、OTM方向に離れるにつれ大きくなるが、深いOTMではVega自体が低下するため再び小さくなる（山型）。IV急騰時に影響が大きいのはATMからある程度離れたOTM帯のオプション。Short Straddle / Short Strangleでショートしているとき、IV急騰→Volga発動で損失が二次曲線的に拡大しやすい。

## 3. 戦略評価の順序

1. 最大損失と証拠金を確認する。
2. Deltaで方向性を確認する。
3. Gammaで急変時の損益加速を確認する。
4. VegaとSkewでIV変化への感応度を確認する。
5. Thetaで日々の時間価値損益を確認する。
6. Charm/Vanna/VolgaでSQ接近やIV急変時の非線形リスクを確認する。

## 4. Delta / Theta インタラクティブ図

Black-Scholesに基づくDeltaとThetaを、原資産価格 $S$ の関数としてプロットする。スライダーで権利行使価格 $K$、IV $\sigma$、満期までの日数 (DTE) を動かすと曲線が即時更新される。Theta は1日あたりの変化量（カレンダー日換算）。

- ATM 近辺で **Gamma** が最大になるため、Delta 曲線はそこで最も急峻に立ち上がる。
- DTE を短くすると、ATM 付近の Delta が階段関数に近づき、Theta（負側）は深くなる。
- IV を上げると Delta 曲線は緩やかになり、Theta は全体的に深くなる。

<div data-greeks-chart></div>

<small>※ 金利 $r = 0.5\%$、配当利回り $q = 0$ の固定。日経225オプションを念頭に既定値を $K=35{,}000$、$\sigma=20\%$、$\text{DTE}=30$ にしてある。</small>
