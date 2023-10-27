'use strict';
// DOM操作をしようと考えたばかりのやつ
// 要素取得
const elem = {
	source: document.getElementById('source'), // 入力エリア
	output: document.getElementById('output'), // 出力エリア
	demo: document.getElementById('demo'), // デモ表示と演算用エリア
	run: document.getElementById('runBtn'), // 実行ボタン
	copy: document.getElementById('copyBtn'), // コピーボタン
	btns: document.getElementById('btns'), // ボタン2つが入ったdiv
};
// ユーザー操作系
const ope = {
	releaseReadonlyCheck: document.getElementById('releaseReadonlyCheck'),
	functions: () => {
		// readonly属性設定用のイベントリスナー起動
		ope.releaseReadonly();
	},
	releaseReadonly: () => {
		this.releaseReadonlyCheck.addEventListener('input', () => elem.output.toggleAttribute('readonly'));
	},
};
// 初期化する
ope.functions();

// 開発用原稿
// const sample = `<!-- wp:paragraph -->
// <p>カロリーが高いといわれるラーメンですが、具体的にはどのくらいのカロリーがあるのでしょうか。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>この記事では、ラーメンの種類ごとにカロリーを比較し、麺の糖質量や太りにくい食べ方も紹介します。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ラーメンのカロリーについてよく知り、ダイエット中の食事に役立てましょう。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading -->
// <h2 class="wp-block-heading">ラーメンのカロリーと主な栄養素</h2>
// <!-- /wp:heading -->

// <!-- wp:image {"id":12316,"sizeSlug":"full","linkDestination":"none"} -->
// <figure class="wp-block-image size-full"><img src="http://pc-elb.staging.furusatonozei.jp/discovery/wp-content/uploads/2023/09/202310_ramen_1.jpg" alt="" class="wp-image-12316"/></figure>
// <!-- /wp:image -->

// <!-- wp:paragraph -->
// <p>ラーメンには塩ラーメンや味噌ラーメンなど、さまざまな種類があります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>この章では、<strong>ラーメンの種類別カロリー比較と、含まれる主な栄養素</strong>について解説します。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>なお本記事では、食品の栄養価を<a href="https://www.mext.go.jp/a_menu/syokuhinseibun/mext_01110.html">日本食品標準成分表（八訂）</a>より引用しています。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">ラーメンのカロリーを種類ごとに比較</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>塩、醤油、味噌、とんこつ、つけ麺の5種類のラーメンのカロリーを比較し、表にまとめました。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>表中には、ゆでた後の麺の重量が230gの場合の、ラーメン1人前（1杯分）のカロリーを記載しています。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>具材は重量の大きい順に表記し、「焼き豚」は豚もも肉を使用した場合のカロリーです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:table -->
// <figure class="wp-block-table"><table><tbody><tr><td>ラーメンの種類</td><td>カロリー（kcal）</td><td>具材</td></tr><tr><td>塩ラーメン</td><td><strong>426</strong></td><td>ほうれん草、焼き豚、メンマ、ねぎ</td></tr><tr><td>醤油ラーメン</td><td><strong>432</strong></td><td>焼き豚、メンマ、ねぎ、海苔</td></tr><tr><td>味噌ラーメン</td><td><strong>540</strong></td><td>もやし、焼き豚、メンマ、ねぎ</td></tr><tr><td>とんこつラーメン</td><td><strong>456</strong></td><td>ゆで卵、焼き豚、もやし、メンマ、ねぎ</td></tr><tr><td>つけ麺</td><td><strong>595</strong></td><td>煮卵、もやし、豚バラチャーシュー、メンマ、海苔</td></tr></tbody></table></figure>
// <!-- /wp:table -->

// <!-- wp:paragraph -->
// <p>※参考：<a href="https://calorie.slism.jp/">カロリーSlism</a></p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>上の表より、ラーメン1杯のカロリーはおよそ420〜600kcalです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p><strong>中華麺（ゆで）のカロリーは1杯分230gあたり306kcalでの計算であり、カロリーの差はスープや具材の違いによる</strong>ものです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">ラーメンに含まれる主な栄養素は？</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>ラーメンの主な材料は中華麺とスープのほか、チャーシューやメンマなどのトッピング具材です。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>醬油ラーメンを例に、1杯分に使用される材料の重量とカロリーを以下にまとめました。</p>
// <!-- /wp:paragraph -->

// <!-- wp:table -->
// <figure class="wp-block-table"><table><tbody><tr><td>材料</td><td>重量（g）</td><td>カロリー（kcal）</td></tr><tr><td>中華麺（ゆで）</td><td>230</td><td>306</td></tr><tr><td>焼き豚</td><td>14</td><td>24</td></tr><tr><td>メンマ</td><td>10</td><td>2</td></tr><tr><td>ねぎ</td><td>10</td><td>4</td></tr><tr><td>海苔</td><td>1</td><td>3</td></tr><tr><td>中華だし</td><td>450</td><td>14</td></tr><tr><td>醤油</td><td>36</td><td>28</td></tr><tr><td>ラード</td><td>6</td><td>54</td></tr><tr><td>風味調味料</td><td>0.5</td><td>2</td></tr></tbody></table></figure>
// <!-- /wp:table -->

// <!-- wp:paragraph -->
// <p>※参考：<a href="https://calorie.slism.jp/">カロリーSlism</a></p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p><strong>ラーメンに含まれる主な栄養素は炭水化物と脂質であり、ほかにたんぱく質が多少含まれています。</strong></p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>中華麺230gには、炭水化物が67.16g、たんぱく質が11.27g含まれています。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>また、スープには塩分と脂質が多めです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ラーメンのトッピングは野菜が少なく、<strong>ビタミン類や食物繊維が不足しがち</strong>な点にも注意しましょう。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading -->
// <h2 class="wp-block-heading">ラーメンのカロリーが高いのはなぜ？</h2>
// <!-- /wp:heading -->

// <!-- wp:image {"id":12317,"sizeSlug":"full","linkDestination":"none"} -->
// <figure class="wp-block-image size-full"><img src="http://pc-elb.staging.furusatonozei.jp/discovery/wp-content/uploads/2023/09/202310_ramen_2.jpg" alt="" class="wp-image-12317"/></figure>
// <!-- /wp:image -->

// <!-- wp:paragraph -->
// <p>ダイエットの大敵というイメージが強いラーメンですが、それはなぜなのでしょうか。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>この章では、ラーメンのカロリーが高い理由を解説します。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">麺の糖質</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>中華麺（ゆで）に含まれる糖質は100gあたり27.7gです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ラーメン1杯の麺の量を230gとすると、63.7gの糖質が含まれていることになります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>これは、<strong>角砂糖18個分以上の糖質量に相当します</strong>。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>また、ラーメンを食べるときは早食いになりがちです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ズルズルと一気に麺をすするのはラーメンを食べる醍醐味ですが、早食いは急激に血糖値が上昇しやすく、肥満を招く一因となります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">スープの脂質</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>ラーメンのスープ1杯分は100〜200kcalあり、スープに含まれる脂質がカロリーを押し上げています。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ラーメンのスープは、とんこつや鶏ガラでだしをとったりラードを使ったりするので、動物性の脂肪が多くなりがちです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ほかの麺類と比べてラーメンが体に悪いイメージがあるのは、スープに多く含まれる動物性脂肪と塩分が原因です。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p><strong>脂質の多いスープをたっぷりと使うことが、ラーメンのカロリーを高くする要因</strong>といえます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">麺の製法でもカロリーが変わる</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>ラーメンに使用する麺の製法によってもカロリーが大きく変わります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>生の中華麺、インスタントのノンフライ麺とフライ麺のカロリーを下表で比較します。</p>
// <!-- /wp:paragraph -->

// <!-- wp:table -->
// <figure class="wp-block-table"><table><tbody><tr><td>麺の種類（ゆでたもの）</td><td>100gあたりのカロリー（kcal）</td><td>230g（1杯分）のカロリー（kcal）</td></tr><tr><td>生麺</td><td>133</td><td><strong>306</strong></td></tr><tr><td>ノンフライ麵</td><td>139</td><td><strong>320</strong></td></tr><tr><td>フライ麵</td><td>189</td><td><strong>435</strong></td></tr></tbody></table></figure>
// <!-- /wp:table -->

// <!-- wp:paragraph -->
// <p>1杯分で比較すると、<strong>フライ麺は生麺やノンフライ麺に比べて120kcalほどカロリーが高い</strong>ことがわかります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">トッピングでもカロリーがアップ</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>ラーメンのトッピングといえばチャーシューですが、とくに豚バラ肉のチャーシューは脂質が多く、カロリーが高くなります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>100gあたりのカロリーは、原材料の<strong>豚もも肉で171kcal、豚バラ肉で366kcal</strong>です。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>調理すると脂が落ちるため一概にはいえませんが、豚バラ肉のチャーシューはもも肉のチャーシューに比べ、かなりカロリーが高くなります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>また、背脂やバターなど、トッピングによってはさらにカロリーが高くなることがあります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading -->
// <h2 class="wp-block-heading">ダイエット中でも太りにくいラーメンの食べ方</h2>
// <!-- /wp:heading -->

// <!-- wp:image {"id":12314,"sizeSlug":"full","linkDestination":"none"} -->
// <figure class="wp-block-image size-full"><img src="http://pc-elb.staging.furusatonozei.jp/discovery/wp-content/uploads/2023/09/202310_ramen_3.jpg" alt="" class="wp-image-12314"/></figure>
// <!-- /wp:image -->

// <!-- wp:paragraph -->
// <p>ダイエット中でも、摂取カロリーに注意すればラーメンを食べることができます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>この章では、ダイエット中でも太りにくいラーメンの食べ方を4つご紹介します。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">スープを残してカロリーを抑える</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>ラーメンのスープを残すだけでも、摂取カロリーを抑えられます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p><strong>スープのカロリーは1杯で100〜200kcalほどあります。</strong></p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>塩おにぎり1個がおよそ170kcalなので、ラーメンのスープがどれほど高カロリーなのかがわかります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>おいしくてつい飲み干してしまいそうになりますが、カロリーカットのためにはできるだけ残す方がよいでしょう。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>また、スープを残すことで塩分の摂りすぎも防げます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">トッピングを工夫する</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>自分で作るラーメンなら、トッピングを工夫すると太りにくい食べ方ができます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>野菜やきのこ、海藻などをプラスすると、<strong>ビタミンや食物繊維などの足りない栄養素を補いつつ満腹感を得る</strong>ことができます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ゆでたもやしやほうれん草、きくらげ、わかめや岩海苔などをたっぷりと加えるのがおすすめです。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>これらの食材を麺より先に食べることで、<strong>血糖値の急激な上昇を防ぐ</strong>こともできます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>また外食のときは、多種類の野菜がたくさん入ったタンメンなどを選ぶとよいでしょう。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ラーメンに欠かせないチャーシューも、豚バラ肉など脂身の多いものではなく低脂質の豚もも肉にしたり、鶏むね肉で作った鶏ハムに変えたりするとさらにカロリーが抑えられます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">低脂質なノンフライ麺を選ぶ</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>インスタント麺を買うときは、油で揚げたフライ麺ではなくノンフライ麺を選ぶようにしましょう。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p><strong>フライ麺をノンフライ麺に変えるだけで、およそ120kcalのカロリーがカットできます。</strong></p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>また、少し手間はかかりますが、自分でスープを作るとさらにカロリーが抑えられます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>スープは煮干しやかつお、昆布や干ししいたけなどでだしをとり、ニンニクやネギなどの香味油を少し加えます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>シジミやアサリを使えば、それだけでおいしいスープを作ることもできます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading {"level":3} -->
// <h3 class="wp-block-heading">食べる時間帯に気を付ける</h3>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>ラーメンを食べるときは、その時間帯にも気を付けることが大切です。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>一日の活動が終わりあとは休むだけになる、夕食時や寝る前に食べるのは避けましょう。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p><strong>ラーメンは、これから活動するという昼食に食べるのがベストです。</strong></p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>どうしても夕食に食べたい場合は時間帯を早めにし、寝る前に軽く運動をするなど体を動かすようにするとよいでしょう。</p>
// <!-- /wp:paragraph -->

// <!-- wp:heading -->
// <h2 class="wp-block-heading">まとめ</h2>
// <!-- /wp:heading -->

// <!-- wp:paragraph -->
// <p>ラーメンのカロリーを大きく左右しているのは、スープや具材に含まれる脂質です。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>スープを残す、具材を工夫するなどの対策で、ダイエット中でもおいしくラーメンを食べることができます。また、食べる時間帯に気を付けることも大切です。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>麺に含まれる糖質は、角砂糖に換算しておよそ18個分にもなります。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>野菜やきのこ、海藻などの食材をプラスすれば食物繊維が増え、血糖値の急上昇を防ぐことができます。</p>
// <!-- /wp:paragraph -->

// <!-- wp:paragraph -->
// <p>ラーメンのカロリーや栄養素について理解し、無理なく楽しくダイエットを続けていきましょう。</p>
// <!-- /wp:paragraph -->`;
const sample = `<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>カロリーが高いといわれるラーメンですが、
具体的にはどのくらいのカロリーがあるのでしょうか。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>この記事では、ラーメンの種類ごとにカロリーを比較し、麺の糖質量や太りにくい食べ方も紹介します。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>ラーメンのカロリーについてよく知り、ダイエット中の食事に役立てましょう。</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong><span>ラーメンのカロリーと主な栄養素</span></strong></h2>
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
<!-- /wp:paragraph -->`;
elem.source.value = sample; // 開発用

// 画像への代替テキスト設定
String.prototype.setAlt2ImgBlocks = function() {
	const regex = /(class="wp-block-heading">)(.+?)(<\/h\d>\n<!--\s\/wp:heading\s-->\n\n<!--\swp:image.+?\n.+?alt=")"/g;
	return this.replaceAll(regex, '$1$2$3$2"');
};
// 外部リンクを「新しいタブで開く」に設定する
String.prototype.setNewTab2extLinks = function() {
	const regex = /<a\shref="(.+?)">/g;
	function callback() {
		if (arguments[1].includes("/furunavi.jp/")) return arguments[0];
		return `<a href="${arguments[1]}" target="_blank" rel="noreferrer noopener">`;
	}
	return this.replace(regex, callback);
}
String.prototype.marker2Strong = function() {
	return this.replaceAll("<strong>", '<strong class="marker-under">');
};

// 特定のtagNamesのブロックのみcallbackで処理する正規表現とメソッド, blockNamesは配列で与える
// arguments [1]開きブロック+改行, [3]コンテンツの中身, [5]改行+閉じタグ ※[2]は開きブロックの"{補足情報}"
const blockName2BlockRegex = blockName => new RegExp(`(<!--\\swp:${blockName}\\s({.+?})?\\s?-->\n)((.|\n)+?)(\n<!--\\s\/wp:${blockName}\\s-->)`, "g");
String.prototype.selectBlockNames = function(blockNamesArray, callback) {
	let draft = this;
	blockNamesArray.forEach(blockName => {
		const regex = blockName2BlockRegex(blockName);
		draft = draft.replaceAll(regex, callback);
	});
	return draft;
};

// 特定のblockNamesではないブロックだけをcallbackで処理するメソッド, blockNameは文字列で与える
// arguments [1]開きブロック+改行, [3]コンテンツの中身, [5]改行+閉じタグ ※[2]は開きブロックの"{補足情報}"
const blockName2ExcludeBlockRegex = blockName => new RegExp(`(<!--\\swp:(?!.*${blockName}).+\\s({.+?}\\s)?-->\n)((.|\n)+?)(\n<!--\\s\/wp:(?!.*${blockName}).+\\s-->)`, "g");
String.prototype.excludeBlockNames = function(blockName, callback) {
	const regex = blockName2ExcludeBlockRegex(blockName);
	return this.replaceAll(regex, callback);
};

// console.log(blockName2BlockRegex("paragraph"));
// console.log(blockName2ExcludeBlockRegex("paragraph"));

// function testFunc() {
// 	console.log(arguments);
// 	arguments[3] = "<span>選択的ターゲット</span>\n" + arguments[3];
// 	return arguments[1] + arguments[3] + arguments[5];
// }
// function testFunc2() {
// 	console.log(arguments);
// 	arguments[3] = "<span>回避的ターゲット</span>\n" + arguments[3];
// 	return arguments[1] + arguments[3] + arguments[5];
// }
// function strongFunc() {
// 	console.log(arguments);
// 	return arguments[1] + arguments[3] + arguments[5];
// }

// console.log([...Array(8)].map((_, i) => i === 1 ? "raw-data" : undefined));

/* ブロックの抽出・ブロックオブジェクトの生成・ブロックオブジェクトからの原稿生成 */
// 各ブロックの文字列からブロックオブジェクトを作成するファクトリ関数
function createBlock(raw) {
const blockInfo = raw.match(/(<!--\swp:(\w+)\s((.+?)\s)?-->\n?)((.|\n)+?)(\n?<!--\s\/wp:.+?\s-->)/) || [...Array(8)].map((_, i) => i === 0 ? raw : undefined);
	// [0:raw, 1:outer[0], 2:type, 3:_, 4:attr, 5:inner, 6:_, 7:outer[1]]
	// console.log(blockInfo);
	const [_1, open, type, _2, attr, inner, _3, close] = [...blockInfo];
	const deleted = false;
	const outer = [open, close];
	const html = document.createElement("div");
	html.innerHTML = raw;
	return {
		type,
		outer,
		inner,
		attr,
		deleted,
		raw,
		html,
	};
}
// 原稿(draft)からブロックオブジェクトを順に格納した配列を返す
function extractBlocks(draft) {
	const blockTexts = draft.match(/(<!--\swp:\w+?\s({.+?})?\s?-->\n)((.|\n)+?)(\n<!--\s\/wp:\w+?\s-->)/g);
	
	const blocks = [];
	for (let i=0;i<blockTexts.length;i++) {
		blocks.push(createBlock(blockTexts[i]));
	}
	return blocks;
}
// ブロックオブジェクト一覧から原稿を生成する
function generateDraftFromBlocks(blocks) {
	// 削除されていない有効なブロックのみ抽出
	const validBlocks = blocks.filter(block => block.deleted === false);
	// 新しい原稿の文字列を生成
	let draft = "";
	for (let i=0;i<validBlocks.length;i++) {
		// もし上手く解析できなかったブロックがあれば、もとのテキストデータをそのまま記す
		if (validBlocks[i].type === undefined) {
			draft += validBlocks[i].raw;
		}
		// 上手く解析できたブロックは、innerをouterではさみこんで記す
		else {
			draft += validBlocks[i].outer[0] + validBlocks[i].inner + validBlocks[i].outer[1];
		}
		if (i === validBlocks.length - 1) break;
		draft += "\n\n";
	}
	return draft;
}


/* ブロックオブジェクトの編集を行う */
function editBlocks(blocks) {
	blocks
	.forEach((block, i) => {
		// 空のpタグの段落ブロックを削除する
		if (block.inner === "<p></p>" && block.type === "paragraph") block.deleted = true;
		// 見出しブロックにstrongやspanなどのタグがあれば削除
		if (block.type === "heading" && block.inner.includes("><")) {
			block.inner.replace(/<strong(.+?)>(.+?)<\/strong>/g, "$2");
		}
		// 表とリスト以外のブロックでstrongタグにマーカーを設定
		if (block.type !== "table" && block.type !== "list") {
			block.inner.replaceAll("<strong>", '<strong class="marker-under">');
		}
		// 空のaltタグがある画像ブロックにaltタグを設定
		if (block.type === "image" && block.inner.includes('alt="')) {
			let done = false; // 設定できたかどうかのフラグ
			// imageの直前のブロックのindexで初期化して、先頭側ブロックへ向けてループ開始
			for (let j=i-1;j>=0;j--) {
				if (blocks[j].type === "heading" && blocks[j].deleted !== true) {
					// headingのテキストを取得する
					const headingText = blocks[j].inner.match(/[^<>]+>([^<>]+?)</);
					console.log("headingText:", headingText, ", blocks[j]:", blocks[j]);
					if (headingText === null) break; // もしテキストの取得失敗ならループを抜ける
					block.inner = block.inner.replace('alt=""', `alt="${headingText[1]}"`);
					done = true;
					break; // 成功したらループを抜ける
				}
			}
			if (done === false) {console.log("image alt set: failed")} // 設定できなかった場合の処理
		}
	});
	return blocks;
}


/* ブロック単位での文字列置換 */
// 外部リンク設定
// strongタグのマーカー（表・リストは選択式）
// 右寄せにする段落を指定（特定の文字列で始まる段落の先頭の文字列を指定する） "参考：", "※" など

// 表の編集を行う


function main() {
	let blocks = extractBlocks(elem.source.value);
	console.log("beforeEdit", blocks); // ブロック一覧の配列を表示
	
	// blocksの各要素に対して、置換作業などの編集を行う
	blocks = editBlocks(blocks);
	console.log("afterEdit");
	for (let i=0;i<blocks.length;i++) {
		console.log(blocks[i].html.innerHTML);
	}

	const editedDraft = generateDraftFromBlocks(blocks);
	// console.log(editedDraft);

	elem.output.value = editedDraft;

	// draft = draft
	// .setAlt2ImgBlocks()
	// .setNewTab2extLinks()
	// .selectBlockNames(["heading", "table"], testFunc)
	// .excludeBlockNames("table", testFunc2);
}

class Draft {
	// constructor() {
	// 	this.theadRowLen = Number(ope.theadRowLenSelect.value);
	// 	this.setScopeCheck = ope.setScopeCheck.checked;
	// 	this.removeSpanCheck = ope.removeSpanCheck.checked;
	// 	this.removeStrongCheck = ope.removeStrongCheck.checked;
	// 	this.insertBrCheck = ope.insertBrCheck.checked;
	// 	this.removeNewlineCheck = ope.removeNewlineCheck.checked;
	// }
	// get scopeValueOf1st() {return ope.scopeValueOf1st.filter(radio => radio.checked)[0].value}
	// get initialTable() {
	// 	let tableHtml = '<table>\n';
	// 	const ti = str => tableHtml += str;
	// 	const trs = {
	// 		all: Array.from(elem.demo.getElementsByTagName('tr')),
	// 	};
	// 	trs.thead = trs.all.slice(0, this.theadRowLen);
	// 	trs.tbody = trs.all.slice(this.theadRowLen, trs.all.length);
		
	// 	// thead
	// 	if (trs.thead.length >= 1) {
	// 		ti('<thead>\n');
	// 		trs.thead.forEach(tr => {
	// 			ti(tr.outerHTML.replace(/td>/g, 'th>')); // gフラグにより全て置換
	// 		});
	// 		ti('\n</thead>\n');
	// 	}
	// 	// tbody
	// 	ti('<tbody>\n');
	// 	trs.tbody.forEach(tr => {
	// 		ti(tr.outerHTML.replace('<td>', '<th>').replace('</td>', '</th>') + '\n'); // 最初の1つずつを置換
	// 	});
	// 	ti('\n</tbody>\n</table>');
	// 	tableHtml = tableHtml.replace(/(<tr>|<\/t[hd]>)(.)/g, '$1\n$2');
		
	// 	tableHtml = tableHtml.replace(/\n[ 　\t]+/g, '\n'); // 行頭の空白を削除
		
	// 	if (this.removeNewlineCheck === true) {
	// 		(tableHtml = tableHtml.replace(/\n/g, '')); // 改行を全削除する
	// 	} else {
	// 		tableHtml = tableHtml.replace(/(\n){2,}/g, '\n'); // 空行は削除する
	// 		tableHtml = tableHtml.replace(/\n<span/g, '<span'); // 改行後にspanがあればその改行を削除
	// 	}
		
	// 	return tableHtml;
	// }
	// makeNewTable() {
	// 	elem.demo.innerHTML = elem.source.value; // 原初HTMLをデモエリアに適用
	// 	elem.demo.innerHTML = this.initialTable;
	// 	this.removeBlankSpan();
	// 	this.removeStyleAttr();
	// 	this.setScopeCheck && this.setScope();
	// 	this.insertBrCheck && this.insertBr();
	// 	this.removeSpanCheck && this.removeSpan();
	// 	this.removeStrongCheck && this.removeStrong();
	// 	return elem.demo.innerHTML;
	// }
	// removeBlankSpan() {
	// 	const targetSpans = Array.from(elem.demo.getElementsByTagName('span')).filter(span => (span.innerHTML === '\n') || (span.innerText === '')); // 空や改行のみのspanを選択
	// 	targetSpans.forEach(span => span.remove());
	// }
	// removeStyleAttr() {
	// 	const hasStyleAttrs = Array.from(elem.demo.querySelectorAll('[style]'));
	// 	hasStyleAttrs.forEach(tag => tag.removeAttribute('style'));
	// }
	// setScope() {
	// 	const thead_trs = elem.demo.querySelectorAll('thead tr');
	// 	thead_trs.forEach(tr => {
	// 		const tr_ths = tr.getElementsByTagName('th');
	// 		[...tr_ths].forEach((th, i) => {
	// 			th.setAttribute('scope', i === 0 ? this.scopeValueOf1st : 'col')
	// 		});
	// 	});
	// 	const tbody_ths = elem.demo.querySelectorAll('tbody th');
	// 	tbody_ths.forEach(th => th.setAttribute('scope', 'row'));
	// }
	// insertBr() {
	// 	const targetSpans = elem.demo.querySelectorAll('span + span');
	// 	targetSpans.forEach(span => span.parentNode.insertBefore(document.createElement('br'), span));
	// }
	// removeSpan() {
	// 	const spans = elem.demo.getElementsByTagName('span');
	// 	[...spans].forEach(span => {
	// 		const textNode = document.createTextNode(span.innerText);
	// 		span.parentNode.insertBefore(textNode, span);
	// 		span.remove();
	// 	});
	// }
	// // th内のstrongを削除
	// removeStrong() {
	// 	const strongs = Array.from(elem.demo.querySelectorAll('th strong'));
	// 	strongs.forEach(strong => {
	// 		const textNode = document.createTextNode(strong.innerText);
	// 		strong.parentNode.insertBefore(textNode, strong);
	// 		strong.remove();
	// 	});
	// }
	// static runDisplay() {
	// 	elem.output.classList.add('outputting');
	// 	setTimeout(() => {
	// 		elem.output.classList.remove('outputting');
	// 	}, 400);
	// }
	// static copyClipboard() {
	// 	if (elem.output.value === '') return;
	// 	navigator.clipboard.writeText(elem.output.value);
	// 	copiedMessage();
	// 	function copiedMessage() {
	// 		elem.copy.innerText = 'Copied!';
	// 		elem.btns.classList.add('copied');
	// 		setTimeout(() => {
	// 			elem.copy.innerText = 'Copy';
	// 			elem.btns.classList.remove('copied');
	// 		}, 1500);
	// 	}
	// }
}

elem.run.addEventListener('click', () => {
	main();
	// if (elem.source.value === '') return;
	// const table = new Table();
	// elem.output.value = table.makeNewTable();
	// Table.runDisplay();
});
// elem.copy.addEventListener('click', Table.copyClipboard);

/* class Table {
	constructor() {
		this.theadRowLen = Number(ope.theadRowLenSelect.value);
		this.setScopeCheck = ope.setScopeCheck.checked;
		this.removeSpanCheck = ope.removeSpanCheck.checked;
		this.removeStrongCheck = ope.removeStrongCheck.checked;
		this.insertBrCheck = ope.insertBrCheck.checked;
		this.removeNewlineCheck = ope.removeNewlineCheck.checked;
	}
	get scopeValueOf1st() {return ope.scopeValueOf1st.filter(radio => radio.checked)[0].value}
	get initialTable() {
		let tableHtml = '<table>\n';
		const ti = str => tableHtml += str;
		const trs = {
			all: Array.from(elem.demo.getElementsByTagName('tr')),
		};
		trs.thead = trs.all.slice(0, this.theadRowLen);
		trs.tbody = trs.all.slice(this.theadRowLen, trs.all.length);
		
		// thead
		if (trs.thead.length >= 1) {
			ti('<thead>\n');
			trs.thead.forEach(tr => {
				ti(tr.outerHTML.replace(/td>/g, 'th>')); // gフラグにより全て置換
			});
			ti('\n</thead>\n');
		}
		// tbody
		ti('<tbody>\n');
		trs.tbody.forEach(tr => {
			ti(tr.outerHTML.replace('<td>', '<th>').replace('</td>', '</th>') + '\n'); // 最初の1つずつを置換
		});
		ti('\n</tbody>\n</table>');
		tableHtml = tableHtml.replace(/(<tr>|<\/t[hd]>)(.)/g, '$1\n$2');
		
		tableHtml = tableHtml.replace(/\n[ 　\t]+/g, '\n'); // 行頭の空白を削除
		
		if (this.removeNewlineCheck === true) {
			(tableHtml = tableHtml.replace(/\n/g, '')); // 改行を全削除する
		} else {
			tableHtml = tableHtml.replace(/(\n){2,}/g, '\n'); // 空行は削除する
			tableHtml = tableHtml.replace(/\n<span/g, '<span'); // 改行後にspanがあればその改行を削除
		}
		
		return tableHtml;
	}
	makeNewTable() {
		elem.demo.innerHTML = elem.source.value; // 原初HTMLをデモエリアに適用
		elem.demo.innerHTML = this.initialTable;
		this.removeBlankSpan();
		this.removeStyleAttr();
		this.setScopeCheck && this.setScope();
		this.insertBrCheck && this.insertBr();
		this.removeSpanCheck && this.removeSpan();
		this.removeStrongCheck && this.removeStrong();
		return elem.demo.innerHTML;
	}
	removeBlankSpan() {
		const targetSpans = Array.from(elem.demo.getElementsByTagName('span')).filter(span => (span.innerHTML === '\n') || (span.innerText === '')); // 空や改行のみのspanを選択
		targetSpans.forEach(span => span.remove());
	}
	removeStyleAttr() {
		const hasStyleAttrs = Array.from(elem.demo.querySelectorAll('[style]'));
		hasStyleAttrs.forEach(tag => tag.removeAttribute('style'));
	}
	setScope() {
		const thead_trs = elem.demo.querySelectorAll('thead tr');
		thead_trs.forEach(tr => {
			const tr_ths = tr.getElementsByTagName('th');
			[...tr_ths].forEach((th, i) => {
				th.setAttribute('scope', i === 0 ? this.scopeValueOf1st : 'col')
			});
		});
		const tbody_ths = elem.demo.querySelectorAll('tbody th');
		tbody_ths.forEach(th => th.setAttribute('scope', 'row'));
	}
	insertBr() {
		const targetSpans = elem.demo.querySelectorAll('span + span');
		targetSpans.forEach(span => span.parentNode.insertBefore(document.createElement('br'), span));
	}
	removeSpan() {
		const spans = elem.demo.getElementsByTagName('span');
		[...spans].forEach(span => {
			const textNode = document.createTextNode(span.innerText);
			span.parentNode.insertBefore(textNode, span);
			span.remove();
		});
	}
	// th内のstrongを削除
	removeStrong() {
		const strongs = Array.from(elem.demo.querySelectorAll('th strong'));
		strongs.forEach(strong => {
			const textNode = document.createTextNode(strong.innerText);
			strong.parentNode.insertBefore(textNode, strong);
			strong.remove();
		});
	}
	static runDisplay() {
		elem.output.classList.add('outputting');
		setTimeout(() => {
			elem.output.classList.remove('outputting');
		}, 400);
	}
	static copyClipboard() {
		if (elem.output.value === '') return;
		navigator.clipboard.writeText(elem.output.value);
		copiedMessage();
		function copiedMessage() {
			elem.copy.innerText = 'Copied!';
			elem.btns.classList.add('copied');
			setTimeout(() => {
				elem.copy.innerText = 'Copy';
				elem.btns.classList.remove('copied');
			}, 1500);
		}
	}
} */

