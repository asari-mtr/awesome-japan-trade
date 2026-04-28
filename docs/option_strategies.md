---
layout: default
title: レジーム別オプション戦略
nav_order: 6
---

# レジーム別オプション戦略 (Option Strategies by Regime)

オプション戦略は、方向性だけでなく、IV水準、Skew、Term Structure、流動性、SQまでの残存日数に依存する。同じ戦略でもレジームが変わると期待値とリスクが大きく変わる。

## 1. レジーム分類

| レジーム | 特徴 | 注視指標 |
| :--- | :--- | :--- |
| **低IV・レンジ相場** | 実現ボラティリティが低く、指数が狭い範囲で推移 | IV rank、実現ボラ、GEX、出来高 |
| **高IV・イベント前** | CPI、FOMC、日銀会合、SQ前などでIVが上昇 | IV term structure、イベント日、ATM straddle |
| **高IV・ショック後** | 急落後にIVが高止まりし、Skewが急拡大 | Put skew、VIX/日経VI、先物ベーシス |
| **トレンド相場** | 方向性が強く、押し目・戻りが浅い | DEX、GEX flip、移動平均、投資家別売買 |
| **SQ接近・高Gamma** | 期近オプションのGamma/Charmが急増 | Gamma curve、Charm curve、建玉集中価格 |

## 2. 代表的な戦略

| 戦略 | 構造 | 向くレジーム | 主なリスク |
| :--- | :--- | :--- | :--- |
| **Long Call / Long Put** | 単独買い | 低IVからの方向性ブレイク | Theta負け、IV低下 |
| **Vertical Spread** | Call spread / Put spread | 方向性はあるがコストを抑えたい局面 | 最大利益が限定、行使価格選択 |
| **CDS (Call Debit Spread)** | 低い権利行使価格のCall買い + 高い権利行使価格のCall売り | 上昇方向を限定リスクで取りたい局面 | 上値が売り行使価格で頭打ち |
| **PDS (Put Debit Spread)** | 高い権利行使価格のPut買い + 低い権利行使価格のPut売り | 下落方向を限定リスクで取りたい局面 | 下値が売り行使価格で頭打ち |
| **Iron Condor** | OTM Call spread売り + OTM Put spread売り | 高IV・レンジ想定 | 片側ブレイク、Gamma急増 |
| **Short Strangle** | OTM Call売り + OTM Put売り | 高IV・レンジ想定、十分な証拠金 | テール損失、追証、流動性低下 |
| **Long Straddle / Strangle** | Call買い + Put買い | 低IV・イベント前、方向不明の大変動狙い | IV crush、Theta負け |
| **Calendar Spread** | 期近売り + 期先買い | 期近IVが割高、またはTerm差を取りたい局面 | Term structure変化、期近Gamma |
| **Diagonal Spread** | 限月と行使価格をずらすスプレッド | 方向性 + Term差を同時に取りたい局面 | Delta/Vega/Thetaの複合リスク |
| **Butterfly** | 中心行使価格を厚くした限定リスク戦略 | SQ着地価格を狙う局面 | ピンポイント性、流動性 |

## 3. レジーム別の使い分け

### 低IV・ブレイク待ち
- **候補**: Long straddle、Long strangle、CDS、PDS。
- **狙い**: IVが安い局面で、方向性または大きな変動を買う。
- **注意**: 低IVが長く続くとThetaで削られる。エントリー前にCatalystを確認する。

### 高IV・レンジ想定
- **候補**: Iron condor、short strangle、credit spread。
- **狙い**: 高いオプションプレミアムを売り、時間価値の減少を取る。
- **注意**: 高IVは「危険が高いから高い」場合がある。裸売りではなく、損失限定のspreadを優先する。

### 上昇トレンド
- **候補**: CDS、call diagonal、put credit spread。
- **狙い**: 上方向のDeltaを持ちつつ、単純なCall買いよりTheta負担を抑える。
- **注意**: 急騰後はCall IVが高くなり、買いの期待値が落ちることがある。

### 下落トレンド・クラッシュ警戒
- **候補**: PDS、put backspread、protective put。
- **狙い**: 下落方向の非線形リスクを取る、または保有現物をヘッジする。
- **注意**: Put skewが急騰している局面では、Put買いのコストが割高になりやすい。

### SQ接近・建玉集中
- **候補**: Butterfly、calendar、限定リスクのvertical spread。
- **狙い**: 建玉集中価格、Gamma wall、Charmによるヘッジ需要を意識する。
- **注意**: 期近Gammaが大きく、想定外の価格変動で損益が急変する。

## 4. 戦略選択のチェックリスト

- **方向性**: 上、下、レンジ、方向不明のどれを取りたいか。
- **IV水準**: IVは過去比で高いか低いか。買うべきか売るべきか。
- **Skew**: Put側とCall側のどちらが割高か。
- **Term Structure**: 期近と期先のどちらが割高か。
- **Greeks**: Delta、Gamma、Vega、Theta、Charmがどこに集中しているか。
- **損失限定**: 最大損失、証拠金、追証発生条件を事前に固定する。
- **出口**: 利確、損切り、SQ前クローズ、ロール条件を決める。

## 5. 実務上の注意

- ショートオプションは勝率が高く見えやすいが、テール損失で長期成績が崩れやすい。
- バックテストでは清算値、理論価格、気配値、実約定価格を混同しない。
- 日経225オプションでは祝日、夜間取引、SQ算出、限月間流動性の差を考慮する。
- 戦略名よりも、最終的なGreek exposureと最大損失を優先して評価する。
