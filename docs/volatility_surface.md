---
layout: default
title: ボラティリティ・サーフェス
nav_order: 7
---

# ボラティリティ・サーフェス (Volatility Surface)

Volatility Surfaceは、権利行使価格方向のSmile/Skewと、限月方向のTerm Structureを合わせたIVの地図。単一のATM IVだけでは、テールリスク、イベントリスク、期間別の需給を見落としやすい。

## 1. 構成要素

| 軸 | 見るもの | 代表指標 |
| :--- | :--- | :--- |
| **Strike方向** | Smile、Skew、Put/Callの割高感 | 25Δ Risk Reversal、Butterfly |
| **Maturity方向** | Term Structure、期近/期先の割高感 | ATM IV curve、Forward Vol |
| **時間変化** | IVの上昇・低下、イベント通過後の変化 | IV Rank、IV Percentile、IV-RV spread |

## 2. Skew / Smileの定量指標

- **25Δ Risk Reversal**: 25Δ Call IV − 25Δ Put IV。株価指数では通常マイナスで、マイナスが大きいほどPut側のヘッジ需要が強い。
- **25Δ Butterfly**: (25Δ Call IV + 25Δ Put IV) / 2 − 50Δ (ATM) IV。Smileの曲率、すなわち市場が織り込む分布のテールの厚さを見る。
- **Put Skew**: OTM Put IV - ATM IV。クラッシュヘッジ需要の強さを見る。
- **Call Skew**: OTM Call IV - ATM IV。踏み上げや上方向イベントの価格付けを見る。

## 3. Realized Volatility vs Implied Volatility

IV (Implied Volatility) はオプション市場価格から逆算される将来変動の価格、RV (Realized Volatility) は実際に観測された過去の変動。いずれも年率換算で比較する（日次対数リターンの標準偏差なら $\sqrt{252}$ 倍）。

- **IV-RV spread**: IV − RV。オプション売り/買いの期待値を見る基本指標。事前指標としては「現在のIV − 直近の過去RV」、事後検証では「エントリー時IV − その後の同一期間のRV」を区別する。
- **Volatility Risk Premium (VRP)**: 投資家が保険料として支払うIVの上乗せ部分。平常時はIVがその後実現するRVを上回りやすいが、ショック時はRVがIVを超えて急上昇し、売り手の損失が集中する。
- **IV Rank**: 過去一定期間のIVレンジ内で現在IVがどの位置にあるか。
- **IV Percentile**: 過去一定期間で現在IV以下だった日の割合。

## 4. Forward Volatility

限月間のIVから、将来の特定期間に市場が織り込むボラティリティを推定する。

$$\sigma_{\text{fwd}} \approx \sqrt{\frac{\sigma_2^2 \, T_2 - \sigma_1^2 \, T_1}{T_2 - T_1}}$$

- $\sigma_1, T_1$: 期近ATM IVと満期までの年数。
- $\sigma_2, T_2$: 期先ATM IVと満期までの年数（$T_1 < T_2$）。
- **前提**: 総分散の加法性（期間 $[0, T_2]$ の分散 = $[0, T_1]$ + $[T_1, T_2]$ の分散の和）。$\sigma_2^2 T_2 < \sigma_1^2 T_1$ のときは根号内が負となり、カレンダー裁定（またはデータ不整合）を示唆する。
- **用途**: Calendar spread、イベント期間の割高/割安、期近IVだけが盛っているかの確認。

## 5. Event Volatility

CPI、FOMC、日銀会合、雇用統計、決算、SQなどのイベントを含む限月では、そのイベント分の変動がIVに乗る。

- **イベント前**: 対象イベントを含む期近IVが上昇しやすい。
- **イベント後**: 不確実性が解消され、IV crushが起きやすい。
- **イベント単体Move**: イベントを含む限月と含まない限月、または前後限月の差からイベント分の分散を推定する。
- **注意**: 年率IVの比較だけではイベント濃度を見誤る。満期までの残存日数とイベント日を必ず合わせて見る。

## 6. 実務チェック

- ATM IVだけでなく、Put skew、Call skew、Term Structureを同時に見る。
- 日経225オプションではSQ、祝日、夜間取引、メジャーSQ/マイナーSQで期近IVが歪みやすい。
- IVが高いから売る、低いから買う、では不十分。RV、イベント、流動性、テールリスクを確認する。
- サーフェスの補間方法を固定しないと、バックテストと実運用の数値がズレる。
