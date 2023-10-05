'use strict';
// デモ表示での画像読み込み失敗時に呼び出されるグローバル関数
// 親要素のfigureを非表示にして、代替のdivにて画像のsrcとaltを表示する
function demoImgOnError(img) {
	try {
		const figure = img.parentElement;
		if (figure.tagName.toUpperCase() !== "FIGURE") return;
		const div = document.createElement("div");
		div.classList.add("demoImgOnError");
		const {alt, src} = img.attributes;
		div.dataset.alt = alt.value;
		div.dataset.src = src.value;
		figure.insertAdjacentElement("afterend", div);
		figure.setAttribute("hidden", "");
	} catch (error) {
		console.warn(error);
	}
}

{
	// 要素取得
	const elem = {
		source: document.getElementById("source"), // 入力エリア
		output: document.getElementById("output"), // 出力エリア
		demo: document.getElementById("demo"), // デモ表示と演算用エリア
		run: document.getElementById("runBtn"), // 実行ボタン
		copy: document.getElementById("copyBtn"), // コピーボタン
	};
	
	// アニメーション用のclass付与関数
	function animateWithClass(element, className, mSec) {
		element.classList.add(className);
		setTimeout(() => {
			element.classList.remove(className);
		}, mSec);
	}
	
	// ユーザー操作系
	const operation = {
		init: () => {
			try {
				// イベントリスナー設置
				operation.switchTabs();
				operation.copyClipboard();
				operation.releaseReadonly();
			} catch (error) {
				console.log(error);
			}
		},
		// タブ切り替え
		switchTabs: () => {
			const btns = document.querySelectorAll("#tabButtons > button");
			const sections = document.querySelectorAll("main > section");
			const length = btns.length;
			let show = 0;
			for (let i=0;i<length;i++) {
				btns[i].addEventListener("click", () => {
					if (show === i) return;
					// show番目 → i番目 にタブを切り替える
					btns[show].classList.remove("btn_show");
					btns[i].classList.add("btn_show");
					sections[show].setAttribute("hidden", "");
					sections[i].removeAttribute("hidden");
					show = i;
				});
			}
		},
		// コピー機能
		copyClipboard: () => {
			elem.copy.addEventListener("click", ()=> {
				if (elem.output.value === "") return;
				navigator.clipboard.writeText(elem.output.value);
				animateWithClass(elem.copy, "copied", 1500);
				animateWithClass(elem.output, "copied", 1500);
			});
		},
		// 出力欄のreadonly解除
		releaseReadonly: () => {
			document.getElementById("releaseReadonlyCheck")
			.addEventListener('input', () => elem.output.toggleAttribute('readonly'));
		}
	};
	// 初期化する
	operation.init();
	
	// 編集ステータス
	// function statusFactory() {
		
	// };
	// const status = {
	// 	default: {
	// 		table: {
	
	// 		}
	// 	},
	// };
	
	// 開発用サンプル原稿
	/* const sample = [
	`<!-- wp:heading -->
	<h2 class="wp-block-heading">横に結合</h2>
	<!-- /wp:heading -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td><strong>横への結合がある表</strong></td><td><strong><strong>性質1</strong></strong></td><td><strong><strong>性質2</strong></strong></td><td><strong><strong>性質3</strong></strong></td></tr><tr><td><strong><strong>項目1</strong></strong></td><td colspan="2"><strong><strong>横に結合</strong></strong></td><td><strong>普通のセル</strong></td></tr><tr><td><strong>項目2</strong></td><td><strong>普通のセル</strong></td><td><strong>普通のセル</strong></td><td><strong>風通のセル</strong></td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">縦に結合</h2>
	<!-- /wp:heading -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td><strong>縦への結合がある表</strong></td><td><strong>性質1</strong></td><td><strong>性質2</strong></td></tr><tr><td><strong>項目1</strong></td><td rowspan="2"><strong>縦に結合</strong></td><td><strong>普通のセル</strong></td></tr><tr><td><strong>項目3</strong></td><td><strong>普通のセル</strong></td></tr><tr><td><strong>項目3</strong></td><td><strong>普通のセル</strong></td><td><strong>普通のセル</strong></td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">二次元で結合</h2>
	<!-- /wp:heading -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td><strong>大きな結合がある表</strong></td><td><strong>性質1</strong></td><td><strong>性質2</strong></td><td><strong>性質3</strong></td></tr><tr><td><strong>項目1</strong></td><td colspan="2" rowspan="2"><strong>4つを結合</strong></td><td><strong>普通のセル</strong></td></tr><tr><td><strong>項目2</strong></td><td><strong>普通のセル</strong></td></tr><tr><td><strong>項目3</strong></td><td><strong>普通のセル</strong></td><td><strong>普通のセル</strong></td><td><strong>普通のセル</strong></td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">複雑な見出し列</h2>
	<!-- /wp:heading -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td colspan="2"><strong>複雑な見出しの表</strong></td><td><strong>性質1</strong></td><td><strong>性質2</strong></td></tr><tr><td rowspan="2"><strong>大きな見出し項目</strong></td><td><strong>見出し項目1</strong></td><td><strong>普通のセル</strong></td><td><strong>普通のセル</strong></td></tr><tr><td><strong>見出し項目2</strong></td><td><strong>普通のセル</strong></td><td><strong>普通のセル</strong></td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">4×4 すべて結合</h2>
	<!-- /wp:heading -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td colspan="4" rowspan="4"><strong>項目</strong></td></tr></tbody></table></figure>
	<!-- /wp:table -->`,
		// 0: 冒頭だけの短縮版
		// 画像下に空のpタグ追加
		// リスト追加
		// 見出し2つにstrong追加
	`<!-- wp:paragraph -->
	<p>この記事では、ラーメンの種類ごとにカロリーを比較し、<br>麺の糖質量や太りにくい食べ方も紹介します。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>カロリーが高いといわれるラーメンですが、具体的にはどのくらいのカロリーがあるのでしょうか。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:list -->
	<ul><!-- wp:list-item -->
	<li>1つ目の項目</li>
	<!-- /wp:list-item -->
	
	<!-- wp:list-item -->
	<li>2つめの項目<!-- wp:list -->
	<ul><!-- wp:list-item -->
	<li><strong>入れ子にした項目</strong></li>
	<!-- /wp:list-item --></ul>
	<!-- /wp:list --></li>
	<!-- /wp:list-item --></ul>
	<!-- /wp:list -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのカロリーについてよく知り、ダイエット中の食事に役立てましょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading"><strong>ラーメンのカロリーと主な栄養素</strong></h2>
	<!-- /wp:heading -->
	
	<!-- wp:image {"id":12316,"sizeSlug":"full","linkDestination":"none"} -->
	<figure class="wp-block-image size-full"><img src="http://pc-elb.staging.furusatonozei.jp/discovery/wp-content/uploads/2023/09/202310_ramen_1.jpg" alt="" class="wp-image-12316"/></figure>
	<!-- /wp:image -->
	
	<!-- wp:paragraph -->
	<p>ラーメンには塩ラーメンや味噌ラーメンなど、さまざまな種類があります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>この章では、<strong>ラーメンの種類別カロリー比較と、含まれる主な栄養素</strong>について解説します。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>なお本記事では、食品の栄養価を<a href="https://www.mext.go.jp/a_menu/syokuhinseibun/mext_01110.html">日本食品標準成分表（八訂）</a>より引用しています。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">ラーメンのカロリーを<strong>種類ごとに</strong>比較</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>塩、醤油、味噌、とんこつ、つけ麺の5種類のラーメンのカロリーを比較し、表にまとめました。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>表中には、ゆでた後の麺の重量が230gの場合の、ラーメン1人前（1杯分）のカロリーを記載しています。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>具材は重量の大きい順に表記し、「焼き豚」は豚もも肉を使用した場合のカロリーです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td>ラーメンの種類</td><td>カロリー（kcal）</td><td>具材</td></tr><tr><td>塩ラーメン</td><td><strong>426</strong></td><td>ほうれん草、焼き豚、メンマ、ねぎ</td></tr><tr><td>醤油ラーメン</td><td><strong>432</strong></td><td>焼き豚、メンマ、ねぎ、海苔</td></tr><tr><td>味噌ラーメン</td><td><strong>540</strong></td><td>もやし、焼き豚、メンマ、ねぎ</td></tr><tr><td>とんこつラーメン</td><td><strong>456</strong></td><td>ゆで卵、焼き豚、もやし、メンマ、ねぎ</td></tr><tr><td>つけ麺</td><td><strong>595</strong></td><td>煮卵、もやし、豚バラチャーシュー、メンマ、海苔</td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:paragraph -->
	<p>※参考：<a href="https://calorie.slism.jp/">カロリーSlism</a></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>上の表より、ラーメン1杯のカロリーはおよそ420〜600kcalです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>中華麺（ゆで）のカロリーは1杯分230gあたり306kcalでの計算であり、カロリーの差はスープや具材の違いによる</strong>ものです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">ラーメンに含まれる主な栄養素は？</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンの主な材料は中華麺とスープのほか、チャーシューやメンマなどのトッピング具材です。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>醬油ラーメンを例に、1杯分に使用される材料の重量とカロリーを以下にまとめました。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td>材料</td><td>重量（g）</td><td>カロリー（kcal）</td></tr><tr><td>中華麺（ゆで）</td><td>230</td><td>306</td></tr><tr><td>焼き豚</td><td>14</td><td>24</td></tr><tr><td>メンマ</td><td>10</td><td>2</td></tr><tr><td>ねぎ</td><td>10</td><td>4</td></tr><tr><td>海苔</td><td>1</td><td>3</td></tr><tr><td>中華だし</td><td>450</td><td>14</td></tr><tr><td>醤油</td><td>36</td><td>28</td></tr><tr><td>ラード</td><td>6</td><td>54</td></tr><tr><td>風味調味料</td><td>0.5</td><td>2</td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:paragraph -->
	<p>※参考：<a href="https://calorie.slism.jp/">カロリーSlism</a></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>ラーメンに含まれる主な栄養素は炭水化物と脂質であり、ほかにたんぱく質が多少含まれています。</strong></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>中華麺230gには、炭水化物が67.16g、たんぱく質が11.27g含まれています。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>また、スープには塩分と脂質が多めです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのトッピングは野菜が少なく、<strong>ビタミン類や食物繊維が不足しがち</strong>な点にも注意しましょう。</p>
	<!-- /wp:paragraph -->`,
	// 1: 1記事全体
	`<!-- wp:paragraph -->
	<p>カロリーが高いといわれるラーメンですが、具体的にはどのくらいのカロリーがあるのでしょうか。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>この記事では、ラーメンの種類ごとにカロリーを比較し、麺の糖質量や太りにくい食べ方も紹介します。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのカロリーについてよく知り、ダイエット中の食事に役立てましょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">ラーメンのカロリーと主な栄養素</h2>
	<!-- /wp:heading -->
	
	<!-- wp:image {"id":12316,"sizeSlug":"full","linkDestination":"none"} -->
	<figure class="wp-block-image size-full"><img src="http://pc-elb.staging.furusatonozei.jp/discovery/wp-content/uploads/2023/09/202310_ramen_1.jpg" alt="" class="wp-image-12316"/></figure>
	<!-- /wp:image -->
	
	<!-- wp:paragraph -->
	<p>ラーメンには塩ラーメンや味噌ラーメンなど、さまざまな種類があります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>この章では、<strong>ラーメンの種類別カロリー比較と、含まれる主な栄養素</strong>について解説します。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>なお本記事では、食品の栄養価を<a href="https://www.mext.go.jp/a_menu/syokuhinseibun/mext_01110.html">日本食品標準成分表（八訂）</a>より引用しています。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">ラーメンのカロリーを種類ごとに比較</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>塩、醤油、味噌、とんこつ、つけ麺の5種類のラーメンのカロリーを比較し、表にまとめました。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>表中には、ゆでた後の麺の重量が230gの場合の、ラーメン1人前（1杯分）のカロリーを記載しています。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>具材は重量の大きい順に表記し、「焼き豚」は豚もも肉を使用した場合のカロリーです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td>ラーメンの種類</td><td>カロリー（kcal）</td><td>具材</td></tr><tr><td>塩ラーメン</td><td><strong>426</strong></td><td>ほうれん草、焼き豚、メンマ、ねぎ</td></tr><tr><td>醤油ラーメン</td><td><strong>432</strong></td><td>焼き豚、メンマ、ねぎ、海苔</td></tr><tr><td>味噌ラーメン</td><td><strong>540</strong></td><td>もやし、焼き豚、メンマ、ねぎ</td></tr><tr><td>とんこつラーメン</td><td><strong>456</strong></td><td>ゆで卵、焼き豚、もやし、メンマ、ねぎ</td></tr><tr><td>つけ麺</td><td><strong>595</strong></td><td>煮卵、もやし、豚バラチャーシュー、メンマ、海苔</td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:paragraph -->
	<p>※参考：<a href="https://calorie.slism.jp/">カロリーSlism</a></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>上の表より、ラーメン1杯のカロリーはおよそ420〜600kcalです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>中華麺（ゆで）のカロリーは1杯分230gあたり306kcalでの計算であり、カロリーの差はスープや具材の違いによる</strong>ものです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">ラーメンに含まれる主な栄養素は？</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンの主な材料は中華麺とスープのほか、チャーシューやメンマなどのトッピング具材です。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>醬油ラーメンを例に、1杯分に使用される材料の重量とカロリーを以下にまとめました。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td>材料</td><td>重量（g）</td><td>カロリー（kcal）</td></tr><tr><td>中華麺（ゆで）</td><td>230</td><td>306</td></tr><tr><td>焼き豚</td><td>14</td><td>24</td></tr><tr><td>メンマ</td><td>10</td><td>2</td></tr><tr><td>ねぎ</td><td>10</td><td>4</td></tr><tr><td>海苔</td><td>1</td><td>3</td></tr><tr><td>中華だし</td><td>450</td><td>14</td></tr><tr><td>醤油</td><td>36</td><td>28</td></tr><tr><td>ラード</td><td>6</td><td>54</td></tr><tr><td>風味調味料</td><td>0.5</td><td>2</td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:paragraph -->
	<p>※参考：<a href="https://calorie.slism.jp/">カロリーSlism</a></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>ラーメンに含まれる主な栄養素は炭水化物と脂質であり、ほかにたんぱく質が多少含まれています。</strong></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>中華麺230gには、炭水化物が67.16g、たんぱく質が11.27g含まれています。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>また、スープには塩分と脂質が多めです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのトッピングは野菜が少なく、<strong>ビタミン類や食物繊維が不足しがち</strong>な点にも注意しましょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">ラーメンのカロリーが高いのはなぜ？</h2>
	<!-- /wp:heading -->
	
	<!-- wp:image {"id":12317,"sizeSlug":"full","linkDestination":"none"} -->
	<figure class="wp-block-image size-full"><img src="http://pc-elb.staging.furusatonozei.jp/discovery/wp-content/uploads/2023/09/202310_ramen_2.jpg" alt="" class="wp-image-12317"/></figure>
	<!-- /wp:image -->
	
	<!-- wp:paragraph -->
	<p>ダイエットの大敵というイメージが強いラーメンですが、それはなぜなのでしょうか。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>この章では、ラーメンのカロリーが高い理由を解説します。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">麺の糖質</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>中華麺（ゆで）に含まれる糖質は100gあたり27.7gです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ラーメン1杯の麺の量を230gとすると、63.7gの糖質が含まれていることになります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>これは、<strong>角砂糖18個分以上の糖質量に相当します</strong>。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>また、ラーメンを食べるときは早食いになりがちです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ズルズルと一気に麺をすするのはラーメンを食べる醍醐味ですが、早食いは急激に血糖値が上昇しやすく、肥満を招く一因となります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">スープの脂質</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのスープ1杯分は100〜200kcalあり、スープに含まれる脂質がカロリーを押し上げています。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのスープは、とんこつや鶏ガラでだしをとったりラードを使ったりするので、動物性の脂肪が多くなりがちです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ほかの麺類と比べてラーメンが体に悪いイメージがあるのは、スープに多く含まれる動物性脂肪と塩分が原因です。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>脂質の多いスープをたっぷりと使うことが、ラーメンのカロリーを高くする要因</strong>といえます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">麺の製法でもカロリーが変わる</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンに使用する麺の製法によってもカロリーが大きく変わります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>生の中華麺、インスタントのノンフライ麺とフライ麺のカロリーを下表で比較します。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:table -->
	<figure class="wp-block-table"><table><tbody><tr><td>麺の種類（ゆでたもの）</td><td>100gあたりのカロリー（kcal）</td><td>230g（1杯分）のカロリー（kcal）</td></tr><tr><td>生麺</td><td>133</td><td><strong>306</strong></td></tr><tr><td>ノンフライ麵</td><td>139</td><td><strong>320</strong></td></tr><tr><td>フライ麵</td><td>189</td><td><strong>435</strong></td></tr></tbody></table></figure>
	<!-- /wp:table -->
	
	<!-- wp:paragraph -->
	<p>1杯分で比較すると、<strong>フライ麺は生麺やノンフライ麺に比べて120kcalほどカロリーが高い</strong>ことがわかります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">トッピングでもカロリーがアップ</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのトッピングといえばチャーシューですが、とくに豚バラ肉のチャーシューは脂質が多く、カロリーが高くなります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>100gあたりのカロリーは、原材料の<strong>豚もも肉で171kcal、豚バラ肉で366kcal</strong>です。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>調理すると脂が落ちるため一概にはいえませんが、豚バラ肉のチャーシューはもも肉のチャーシューに比べ、かなりカロリーが高くなります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>また、背脂やバターなど、トッピングによってはさらにカロリーが高くなることがあります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">ダイエット中でも太りにくいラーメンの食べ方</h2>
	<!-- /wp:heading -->
	
	<!-- wp:image {"id":12314,"sizeSlug":"full","linkDestination":"none"} -->
	<figure class="wp-block-image size-full"><img src="http://pc-elb.staging.furusatonozei.jp/discovery/wp-content/uploads/2023/09/202310_ramen_3.jpg" alt="" class="wp-image-12314"/></figure>
	<!-- /wp:image -->
	
	<!-- wp:paragraph -->
	<p>ダイエット中でも、摂取カロリーに注意すればラーメンを食べることができます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>この章では、ダイエット中でも太りにくいラーメンの食べ方を4つご紹介します。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">スープを残してカロリーを抑える</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのスープを残すだけでも、摂取カロリーを抑えられます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>スープのカロリーは1杯で100〜200kcalほどあります。</strong></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>塩おにぎり1個がおよそ170kcalなので、ラーメンのスープがどれほど高カロリーなのかがわかります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>おいしくてつい飲み干してしまいそうになりますが、カロリーカットのためにはできるだけ残す方がよいでしょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>また、スープを残すことで塩分の摂りすぎも防げます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">トッピングを工夫する</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>自分で作るラーメンなら、トッピングを工夫すると太りにくい食べ方ができます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>野菜やきのこ、海藻などをプラスすると、<strong>ビタミンや食物繊維などの足りない栄養素を補いつつ満腹感を得る</strong>ことができます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ゆでたもやしやほうれん草、きくらげ、わかめや岩海苔などをたっぷりと加えるのがおすすめです。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>これらの食材を麺より先に食べることで、<strong>血糖値の急激な上昇を防ぐ</strong>こともできます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>また外食のときは、多種類の野菜がたくさん入ったタンメンなどを選ぶとよいでしょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ラーメンに欠かせないチャーシューも、豚バラ肉など脂身の多いものではなく低脂質の豚もも肉にしたり、鶏むね肉で作った鶏ハムに変えたりするとさらにカロリーが抑えられます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">低脂質なノンフライ麺を選ぶ</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>インスタント麺を買うときは、油で揚げたフライ麺ではなくノンフライ麺を選ぶようにしましょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>フライ麺をノンフライ麺に変えるだけで、およそ120kcalのカロリーがカットできます。</strong></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>また、少し手間はかかりますが、自分でスープを作るとさらにカロリーが抑えられます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>スープは煮干しやかつお、昆布や干ししいたけなどでだしをとり、ニンニクやネギなどの香味油を少し加えます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>シジミやアサリを使えば、それだけでおいしいスープを作ることもできます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading {"level":3} -->
	<h3 class="wp-block-heading">食べる時間帯に気を付ける</h3>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンを食べるときは、その時間帯にも気を付けることが大切です。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>一日の活動が終わりあとは休むだけになる、夕食時や寝る前に食べるのは避けましょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p><strong>ラーメンは、これから活動するという昼食に食べるのがベストです。</strong></p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>どうしても夕食に食べたい場合は時間帯を早めにし、寝る前に軽く運動をするなど体を動かすようにするとよいでしょう。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:heading -->
	<h2 class="wp-block-heading">まとめ</h2>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのカロリーを大きく左右しているのは、スープや具材に含まれる脂質です。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>スープを残す、具材を工夫するなどの対策で、ダイエット中でもおいしくラーメンを食べることができます。また、食べる時間帯に気を付けることも大切です。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>麺に含まれる糖質は、角砂糖に換算しておよそ18個分にもなります。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>野菜やきのこ、海藻などの食材をプラスすれば食物繊維が増え、血糖値の急上昇を防ぐことができます。</p>
	<!-- /wp:paragraph -->
	
	<!-- wp:paragraph -->
	<p>ラーメンのカロリーや栄養素について理解し、無理なく楽しくダイエットを続けていきましょう。</p>
	<!-- /wp:paragraph -->`
	]; */
	// elem.source.value = sample[2];
	
	/* 文字列操作系 */
	const PHRASES = {
		BLANK_PARAGRAPH: "<!-- wp:paragraph -->\n<p></p>\n<!-- /wp:paragraph -->",
	};
	// 内容文字列が決まっている特定のブロックを削除（主に空のpタグに使用）
	// phraseはコメント部分を含むブロック全体の文字列
	String.prototype.removeSpecificBlock = function(phrase) {
		return this
			// 原稿の先頭や末尾以外のブロックを削除
			.replaceAll(`\n${phrase}\n`, "")
			// 原稿先頭のブロックを削除
			.replace(`${phrase}\n\n`, "")
			// 原稿末尾のブロックを削除
			.replace(`\n\n${phrase}`, "");
	};
	
	/* DOM操作系 */
	// 見出し下の子要素（strongやspanなど）をすべて除去してテキストのみにする
	function removeTagsInHeading(article) {
		const headings = article.getElementsByClassName("wp-block-heading");
		for (let i=0;i<headings.length;i++) {
			// hタグが何かしらの子要素を持っていたら実行
			if (headings[i].childElementCount > 0) {
				headings[i].innerHTML = headings[i].textContent;
			}
		}
	}
	// 画像の代替タグを設定する
	function setAlt2Images(article) {
		const figures = article.getElementsByClassName("wp-block-image");
		for (let i=0;i<figures.length;i++) {
			const img = figures[i].querySelector("img");
			if (img === null) continue;
			const prev = figures[i].previousElementSibling;
			if (prev === null || prev.tagName.toUpperCase().match(/^H\d$/) === null) {
				console.log("1枚の画像の代替テキスト設定に失敗。画像ブロックの前に見出しブロックが見つかりませんでした。");
				continue;
			}
			img.setAttribute("alt", prev.textContent);
		}
	}
	// 外部リンクを新しいタブで開くように設定
	function setLinkNewTab(link) {
		link.setAttribute("target", "_blank");
		link.setAttribute("rel", "noreferrer noopener");
	}
	function openExternalLinksWithNewTab(article) {
		const links = article.getElementsByTagName("a");
		for (let i=0;i<links.length;i++) {
			const href = links[i].getAttribute("href");
			// もしリンク先が未指定ならスキップ
			if (href === null || href === "") continue;
			// 外部リンクのみ属性を付与
			href.match(/(furu(satonozei|navi)\.jp)/) === null && setLinkNewTab(links[i]);
		}
	}
	// elementが属するWPブロックの種類名を返す（取得失敗なら空の文字列を返す）
	function getBlockType(element) {
		// 属するブロックの一番外側のHTMLタグ（current）を取得
		let current = element;
		let found = false;
		while (found === false) {
			const parent = current.parentElement;
			if (parent === null) return ""; // articleにたどり着けなかった場合
			if (parent.tagName.toUpperCase() === "ARTICLE") found = true;
			else current = parent;
		}
		// currentの兄ノードをたどって最も近いコメントノード（curren）を取得
		found = false;
		while (found === false) {
			current = current.previousSibling;
			if (current === null) return ""; // コメントノードにたどり着けなかった場合
			if (current.nodeName === "#comment") found = true;
		}
		const matchOfType = current.textContent.trim().match(/^wp:(\w+)$/);
		return matchOfType === null ? "" : matchOfType[1];
	}
	// strongにマーカーを設定
	function addMarker2Strongs(article) {
		const strongs = article.getElementsByTagName("strong");
		for (let i=0;i<strongs.length;i++) {
			const blockType = getBlockType(strongs[i]);
			if (blockType !== "table" && blockType !== "list") {
				strongs[i].classList.add("marker-under");
			}
		}
	}
	
	// ここから表の編集用関数一覧
	// colspanやrowspanが見つかった場合にskipMapの[i][j]から[i+rowspan-1][j+colspan-1]までの値を[i, j]にする関数
	function changeTableCoordinates([i, j], [rowspan, colspan], skipMap, param) {
		for (let k=0;k<rowspan;k++) {
			if (i+k >= param.rowLength) break;
			for (let l=0;l<colspan;l++) {
				if (j+l >= param.columnLength) continue;
				skipMap[i+k][j+l] = [i, j];
			}
		}
	}
	// 表の1行目のセルから表全体の列数を返す
	function calcColumnLength(table) {
		const cells = table.querySelector("tr").querySelectorAll("th, td");
		let columnLength = cells.length; // セル数で初期化
		for (let i=0;i<cells.length;i++) {
			let colspan = cells[i].getAttribute("colspan");
			if (colspan === null || colspan === "") continue;
			colspan = Number(colspan);
			columnLength += (colspan - 1);
		}
		return columnLength;
	}
	// tableCoordinatesのコンソールでの確認を行う（開発用）
	function dispTableCoordinates(tableCoordinates, param) {
		const dispTable = [];
		for (let i=0;i<param.rowLength;i++) {
			const row = [];
			for (let j=0;j<param.columnLength;j++) {
				row.push(tableCoordinates[i][j].join(", "));
			}
			dispTable.push(row);
		}
		console.table(dispTable);
	}
	// tableのrowspanやcolspanを考慮した、ある行×列にどのセルが表示されるかを表す三次元配列tableCoordinatesを返す
	function getTableCoordinates(orig, param) {
		// tableのrowspanやcolspanを考慮した、ある行×列にどのセルが表示されるかを表す三次元配列tableCoordinates
		// 三次元配列を用意（行と列の番号で初期化）
		const tableCoordinates = 
			[...Array(param.rowLength)] // 行数分の長さの配列を作成
			.map((_, i) => [...Array(param.columnLength)] // 親配列をもとに、列数分の長さの子配列を入れた二次元配列をmapで生成
				.map((_, j) => [i, j]) // 子配列は、孫配列[i, j]を入れて二次元配列とする
			);
		// tableCoordinatesを作成
		let cellIndex = 0;
		for (let i=0;i<param.rowLength;i++) {
			for (let j=0;j<param.columnLength;j++) {
				const [a, b] = tableCoordinates[i][j];
				if (i !== a || j !== b) continue; // セル座標がずれているセルは結合によりHTML上には存在しないのでスキップ
				const origCell = orig.cells[cellIndex++];
				const [rowspan, colspan] = ["rowspan", "colspan"]
					.map(attrName => origCell.getAttribute(attrName) || 1)
					.map(attr => Number(attr));
				if (rowspan + colspan > 2) {
					changeTableCoordinates([i, j], [rowspan, colspan], tableCoordinates, param);
				}
			}
		}
		return tableCoordinates;
	}
	// 1つのtableの編集版を取得
	function getEditedTable(originalTable) {
		// もとの表HTMLについてのデータ
		const orig = {
			table: originalTable,
			cells: originalTable.querySelectorAll("th, td"),
		};
		// 表の構造や設定に関するパラメータ
		const param = {
			theadRows: orig.table.querySelectorAll("thead tr").length || 1, // 既定値1 もとのtableにtheadが存在するならその行数を優先する
			thColumns: 1, // 既定値1
			rowLength: orig.table.rows.length,
			columnLength: calcColumnLength(orig.table),
		};
		const [table, thead, tbody] = ["table", "thead", "tbody"].map(tagName => document.createElement(tagName));
	
		const tableCoordinates = getTableCoordinates(orig, param);
		// dispTableCoordinates(tableCoordinates, param); // 開発用
		
		// 原本の各trを参照しつつ、各行のhtmlを再生成する
		let cellIndex = 0;
		for (let i=0;i<param.rowLength;i++) {
			const isThead = i < param.theadRows ? true : false;
			// 行を作成
			const tr = document.createElement("tr");
			for (let j=0;j<param.columnLength;j++) {
				const [a, b] = tableCoordinates[i][j];
				if (i !== a || j !== b) continue; // 結合によりHTML上に存在しないセルに相当するターンはスキップ
				const cell = document.createElement((isThead || j < param.thColumns) ? "th" : "td");
				// セルの中身のHTMLをコピー
				cell.innerHTML = orig.cells[cellIndex].innerHTML;
				// セルの属性をすべてコピー
				const attributes = orig.cells[cellIndex].attributes;
				for (let k=0;k<attributes.length;k++) {
					let {nodeName, nodeValue} = attributes[k];
					cell.setAttribute(nodeName, (nodeValue ?? ""));
				}
				// tdにstrongがあれば除去する
				if (cell.tagName.toUpperCase() === "TH") {
					let strong;
					while (strong = cell.querySelector("strong")) {
						strong.outerHTML = strong.innerHTML;
					}
				}
				// セルを行に挿入
				tr.appendChild(cell);
				cellIndex++;
			}
			// 行を適切なelementに挿入
			(isThead ? thead : tbody).appendChild(tr);
		}
		
		if (param.theadRows > 0) table.appendChild(thead);
		if (tbody.childElementCount > 0) table.appendChild(tbody);
	
		return table;
	}
	function replaceWithEditedTables(article) {
		const tables = article.getElementsByTagName("table");
		for (let i=0;i<tables.length;i++) {
			try {
				// 編集したtableをHTML要素として取得
				const editedTable = getEditedTable(tables[i]);
				// article内のtableを置換する
				tables[i].replaceWith(editedTable);
			} catch(error) {
				// 表の構造・属性がおかしい場合などは失敗する仕様 コンソールに警告
				console.warn(`${i+1}番目の表の編集に失敗しました。${i+1}番目の表は未編集の状態で出力しています。\n`, error);
			}
		}
	}

	// デモ表示に関する関数
	function getInnerHTML4Demo(innerHTML) {
		const article = document.createElement("article");
		article.innerHTML = innerHTML;
		const images = article.getElementsByTagName("img");
		for (let i=0;i<images.length;i++) {
			images[i].setAttribute("onerror", "demoImgOnError(this);");
		}
		return article.innerHTML;
	}
	
	function editWithDOM(article) {
		try {
			removeTagsInHeading(article);
		} catch (error) {
			console.warn("見出しタグの設定が正常に完了しませんでした。\n", error);
		}
		try {
			setAlt2Images(article);
		} catch (error) {
			console.warn("画像への代替タグ設定が正常に完了しませんでした。\n", error);
		}
		try {
			openExternalLinksWithNewTab(article);
		} catch (error) {
			console.warn("外部リンクの「新しいタブで開く」設定が正常に完了しませんでした。\n", error);
		}
		try {
			addMarker2Strongs(article);
		} catch (error) {
			console.warn("strongタグへのclass=\"marker-under\"の付与が正常に完了しませんでした。\n", error);
		}
		replaceWithEditedTables(article); // 呼び出す関数側でtry
	}
	
	function main() {
		if (elem.source.value === "") return;
		// 原稿を取得して編集する
		const original = elem.source.value.trim();
		let draft = original.removeSpecificBlock(PHRASES.BLANK_PARAGRAPH).trim();
		const article = document.createElement("article");
		article.innerHTML = draft;
		editWithDOM(article);
		// 編集した原稿を出力する
		elem.output.value = article.innerHTML;
		animateWithClass(elem.output, "outputting", 700);
		// デモ表示を行う
		elem.demo.innerHTML = getInnerHTML4Demo(article.innerHTML);
	}
	elem.run.addEventListener("click", main);
	
	// const clickEvent = new Event("click");
	// elem.run.dispatchEvent(clickEvent);
	// document.querySelectorAll("nav button")[1].dispatchEvent(clickEvent); // デモ表示に切り替える
}
