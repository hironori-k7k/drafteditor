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

// URL中の特定のパラメータ取得して文字列を返す
function getParam(name) {
	const searchParams = new URLSearchParams(window.location.search);
	const nameParam = searchParams.get(name);
	switch (nameParam) {
		case nameParam:
			return nameParam;
		case nameParam === "":
			return "";
		default:
			return null;
	}
}

{
	const reeditParam = getParam("reedit");
	const reeditMode = reeditParam === "true" ? true : false;

	let article;
	let draftData;
	let autoEdit = true;
	// 要素取得
	const elem = {
		source: document.getElementById("source"), // 入力エリア
		output: document.getElementById("output"), // 出力エリア
		demo: document.getElementById("demo"), // デモ表示と演算用エリア
		run: document.getElementById("runBtn"), // 実行ボタン
		copy: document.getElementById("copyBtn"), // コピーボタン
	};

	const modeText = reeditMode ? "再編集モード" : "通常編集モード";
	document.title += `（${modeText}）`;
	elem.run.textContent += `（${modeText}）`;
	
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
				// operation.releaseReadonly();
			} catch (error) {
				console.log(error);
			}
		},
		// タブ切り替え
		switchTabs: () => {
			const btns = document.querySelectorAll("div#tabButtons > button");
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
	};
	// 初期化する
	operation.init();
	
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
	// いくつかの文字列をターゲットに原稿にありがちな問題点を修正
	String.prototype.cleanUpDraft = function() {
		return this
		// 改行にstrongタグがついていたら単なる改行に変更
		.replaceAll("<strong><br></strong>", "<br>");
	};
	
	/* DOM操作系 */
	// 見出し下の子要素（strongやspanなど）をすべて除去してテキストのみにする
	function removeTagsInHeading() {
		const headings = article.getElementsByClassName("wp-block-heading");
		if (autoEdit) {
			for (let i=0;i<headings.length;i++) {
				// hタグが何かしらの子要素を持っていたら実行
				if (headings[i].childElementCount > 0) {
					headings[i].innerHTML = headings[i].textContent;
				}
			}
		}
		draftData.headings = Array.from(headings);
	}
	// 画像の代替タグを設定する
	function setAlt2Images() {
		const figures = article.getElementsByClassName("wp-block-image");
		if (autoEdit) {
			for (let i=0;i<figures.length;i++) {
				const img = figures[i].querySelector("img");
				if (img === null) continue;
				const prev = figures[i].previousElementSibling; // 通常は見出しタグを取得することになる
				if (prev === null || prev.tagName.toUpperCase().match(/^H\d$/) === null) {
					console.log("1枚の画像の代替テキスト設定に失敗。画像ブロックの前に見出しブロックが見つかりませんでした。");
					continue;
				}
				img.setAttribute("alt", prev.textContent);
			}
		}
		draftData.images = Array.from(figures);
	}
	// 外部リンクを新しいタブで開くように設定
	function openLinkWithNewTab(link) {
		link.setAttribute("target", "_blank");
		link.setAttribute("rel", "noreferrer noopener");
	}
	// リンク一覧を取得して外部リンクなら新しいタブで開くように設定
	function openExternalLinksWithNewTab() {
		const links = article.getElementsByTagName("a");
		draftData.links.count = links.length;
		for (let i=0;i<links.length;i++) {
			const href = links[i].getAttribute("href");
			// もしリンク先が未指定ならスキップ
			if (href === null || href === "") continue;
			// ドメイン文字列が不一致となる外部リンクのみ属性を付与
			if (href.match(/(furu(satonozei|navi)\.jp)/) === null) {
				openLinkWithNewTab(links[i]);
				draftData.links.edited++;
			}
		}
		draftData.links.elements = Array.from(links);
	}

	// elementが属するWPブロックの種類名とelementの階層の深さ、ブロックのうち一番外側の要素を返す
	// depthはarticleを0と定義 article直下なら1
	function getBlockData(element) {
		const blockData = {type: "", depth: 0, outer: undefined};
		let [current, found] = [element, false];
		// 属するブロックの一番外側のHTMLタグ（current）を取得
		while (found === false) {
			const parent = current.parentElement;
			blockData.depth++;
			if (parent === null) { // articleにたどり着けなかった場合
				blockData.depth = -1;
				return blockData;
			}
			if (parent.tagName.toUpperCase() === "ARTICLE") found = true;
			else current = parent;
		}
		blockData.outer = current;
		// ブロックelementの兄ノードをたどって最も近いコメントノード（current）を取得
		found = false;
		while (found === false) {
			current = current.previousSibling;
			if (current === null) return blockData; // コメントノードにたどり着けなかった場合
			if (current.nodeName === "#comment") found = true;
		}
		// コメントのテキストからブロックの種類名を取得
		const matchOfType = current.textContent.trim().match(/^wp:(\w+)$/);
		blockData.type = matchOfType === null ? "" : matchOfType[1];
		return blockData;
	}
	// strongにマーカーを設定（表とリスト以外？）
	function addMarker2Strongs() {
		const strongs = article.getElementsByTagName("strong");
		draftData.strongs.count = strongs.length;
		if (autoEdit) {
			for (let i=0;i<strongs.length;i++) {
				const blockType = getBlockData(strongs[i]).type;
				if (blockType !== "table" && blockType !== "list") {
					strongs[i].classList.add("marker-under");
					draftData.strongs.edited++;
				}
			}
		}
		draftData.strongs.elements = Array.from(strongs);
	}
	
	// ここから表の編集用関数一覧
	// colspanやrowspanが見つかった場合にskipMapの[i][j]から[i+rowspan-1][j+colspan-1]までの値を[i, j]にする関数
	function changeTableCoordinates([i, j], [rowspan, colspan], skipMap, param) {
		for (let k=0;k<rowspan;k++) {
			if (i+k >= param.rowLength) break;
			for (let l=0;l<colspan;l++) {
				if (j+l >= param.columnLength) break;
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
			if (isNaN(colspan) || Number.isInteger(colspan) === false) continue; // 数値でないか整数でない場合はスキップ
			columnLength += Math.max((colspan - 1), 0);
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
		// 三次元配列を用意（行と列の番号で初期化）
		const tableCoordinates = 
			[...Array(param.rowLength)] // 行数分の長さの配列を作成
			.map((_, i) => [...Array(param.columnLength)] // 親配列をもとに、列数分の長さの子配列を入れた二次元配列をmapで生成
				.map((_, j) => [i, j]) // 子配列にさらに、数値2つの入った孫配列[i, j]を入れる
			);
		// 実際のtableCoordinatesを取得
		let cellIndex = 0;
		for (let i=0;i<param.rowLength;i++) {
			for (let j=0;j<param.columnLength;j++) {
				const [a, b] = tableCoordinates[i][j];
				if (i !== a || j !== b) continue; // セル座標がずれているセルは結合によりHTML上には存在しないのでスキップ
				// 原本のセルを取得
				const origCell = orig.cells[cellIndex++];
				// 原本のセルのrowspanとcolspanを取得
				const [rowspan, colspan] = 
				["rowspan", "colspan"].map(attrName => Number(origCell.getAttribute(attrName) || 1)); // xspan属性が存在しなければ既定値は1である
					// .map(attr => Number(attr));
				if (rowspan + colspan > 2) {
					changeTableCoordinates([i, j], [rowspan, colspan], tableCoordinates, param);
				}
			}
		}
		return tableCoordinates;
	}
	// 1つのtableの編集版を取得
	function getEditedTable(originalTable, reEdit = false, inpRow = undefined, inpCol = undefined) {
		// もとの表HTMLについてのデータ
		const orig = {
			table: originalTable,
			cells: originalTable.querySelectorAll("th, td"),
		};
		// 表の構造や設定に関するパラメータ
		const param = {
			theadRows: inpRow ?? (() => { // 指定値があれば適用
				const origRows = orig.table.querySelectorAll("thead tr").length;
				if (autoEdit === false || origRows > 0) return origRows; // 再編集モード、もしくはthead設定済みの表ならtheadからの読み取り値
				// 通常モードで、かつthead未設定の場合 最初の行から推測する
				const firstTr = orig.table.querySelector("tr");
				if (!firstTr) return 1;
				let rows = 1; // 既定値の1で初期化
				// rowspanを見てtheadが2行以上の場合を推測する
				const cells = firstTr.querySelectorAll("th, td");
				for (const cell of cells) {
					const rowspanAttr = cell.getAttribute("rowspan");
					if (rowspanAttr === null) continue;
					const rowspan = Number(rowspanAttr);
					if (!Number.isNaN(rowspan) && Number.isInteger(rowspan)) rows = Math.max(rows, rowspan);
				}
				return rows;
			})(),
			thColumns: inpCol ?? (() => { // 指定値があれば適用
				if (autoEdit === true) return 1; // 通常編集なら既定値1
				// 再編集モードではtbody tr:first-of-type thの列数を読み取り
				const thsIn1stBodyTr = orig.table.querySelectorAll("tbody tr:first-of-type th");
				let cols = thsIn1stBodyTr.length;
				for (const th of thsIn1stBodyTr) {
					const colspanAttr = th.getAttribute("colspan");
					if (colspanAttr === null) continue;
					const colspan = Number(colspanAttr);
					if (!Number.isNaN(colspan) && Number.isInteger(colspan) && colspan > 1) cols += (colspan - 1);
				}
				return cols; // 再編集モードでの読み取り値を返す
			})(),
			rowLength: orig.table.rows.length,
			columnLength: calcColumnLength(orig.table),
		};
		const [table, thead, tbody] = ["table", "thead", "tbody"].map(tagName => document.createElement(tagName));
	
		const tableCoordinates = getTableCoordinates(orig, param);
		dispTableCoordinates(tableCoordinates, param); // 開発用
		
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
					cell.setAttribute(nodeName, (nodeValue ?? "")); // valueがnullishなら空文字列を渡す
				}
				// thにstrongがあれば除去する
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

		if (reEdit === false) {
			draftData.tables.push({
				edited: true,
				element: undefined,
				param: param,
				tableCoordinates, tableCoordinates
			});
		}
	
		return table;
	}
	// 表一覧を取得
	function replaceWithEditedTables() {
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
				// 失敗時にもdraftData.tablesにpush
				draftData.tables.push({
					edited: false,
					element: undefined,
					param: undefined,
					tableCoordinates: undefined
				});
			}
		}
		// draftDataでのtableのelementを編集後のarticleより記録
		const newTables = article.getElementsByTagName("table");
		for (let i=0;i<newTables.length;i++) {
			draftData.tables[i].element = newTables[i];
		}
	}
	// 表が属するブロックの次のelementがpタグで、かつ特定の文字列から始まれば、そのpタグを右寄せにする
	function captionAlignRight() {
		// 無条件に付与するケース
		const ps = article.getElementsByTagName("p");
		for (const p of ps) {
			if (p.textContent.match(/^※?(参考|出典|引用)：/) || p.textContent.match(/^※(参考|出典|引用)/)) {
				p.classList.add("has-text-align-right");
			}
		}
		// 表の前のみ付与するケース（無条件より厳しいルール」）
		const tables = article.getElementsByTagName("table");
		for (let i=0;i<tables.length;i++) {
			const blockDataOfTable = getBlockData(tables[i]);
			if (blockDataOfTable.outer === undefined) continue;
			const next = blockDataOfTable.outer.nextElementSibling;
			if (next === null || next.tagName.toUpperCase() !== "P") continue;
			// "※", "出典", "引用", "参考" から始まるpタグに付与
			if (next.textContent.match(/^(※|出典|引用|参考)/) != null) {
				next.classList.add("has-text-align-right");
			}
		}
	}

	function editWithDOM() {
		try {
			removeTagsInHeading();
		} catch (error) {
			console.warn("見出しタグのHTML編集が正常に完了しませんでした。\n", error);
		}
		try {
			setAlt2Images();
		} catch (error) {
			console.warn("画像への代替タグ設定が正常に完了しませんでした。\n", error);
		}
		try {
			openExternalLinksWithNewTab();
		} catch (error) {
			console.warn("外部リンクの「新しいタブで開く」設定が正常に完了しませんでした。\n", error);
		}
		try {
			addMarker2Strongs();
		} catch (error) {
			console.warn("strongタグへのclass=\"marker-under\"の付与が正常に完了しませんでした。\n", error);
		}
		replaceWithEditedTables(); // 呼び出す関数側でtry
		try {
			autoEdit && captionAlignRight();
		} catch (error) {
			console.warn("表の後ろのcaption右寄せ機能が正常に動作しませんでした。\n", error);
		}
	}

	// デモ表示用に修正したinnerHTMLを取得
	function getInnerHTML4Demo(innerHTML) {
		const demoArticle = document.createElement("article");
		demoArticle.innerHTML = innerHTML;
		const images = demoArticle.getElementsByTagName("img");
		for (const img of images) {
			img.setAttribute("onerror", "demoImgOnError(this);");
			img.setAttribute("referrerpolicy", "unsafe-url"); // セキュリティをなるべく弱めて画像読み込みエラー対策
			// img.crossOrigin = "anonymous";
		}
		return demoArticle.innerHTML;
	}

	// プレビュー画面にいくつかの編集機能を付与する demoとarticleの情報を同時編集して、articleをoutputにコピーする
	// class付け替え用の汎用関数
	function toggleClass(inPrev, inArticle, className) {
		// 事前に削除操作なのか付与操作なのかを判定（classListの変更直後は望む情報正しくを取得できないため事前取得）
		const removing = inArticle.classList.contains(className); // 付与中なら、これから削除
		const length = inArticle.classList.length;
		// まず、デモ側をtoggle
		inPrev.classList.toggle(className);
		// article側をtoggle
		inArticle.classList.toggle(className);
		// classの削除操作であり、かつほかにはclassが付与されていない場合
		if (removing && length === 1) {
			inArticle.removeAttribute("class"); // 原稿に class="" が残らないようにclassごと削除
		}
	}
	// 各種イベントリスナーなどを設置
	function setDemoEditor() {
		// ctrlキー+strongタグをクリックでマーカーtoggle
		const strongs = elem.demo.getElementsByTagName("strong");
		for (let i=0;i<strongs.length;i++) {
			// 編集操作でindexがずれうるので、この段階でelementを取得しておく
			const strong = strongs[i];
			strong.addEventListener("click", e => {
				if (!e.ctrlKey) return;
				toggleClass(strong, draftData.strongs.elements[i], "marker-under");
				elem.output.value = article.innerHTML;
			});
		}
		// altキー+段落をクリックすると右寄せtoggle
		const ps = elem.demo.getElementsByTagName("p");
		for (let i=0;i<ps.length;i++) {
			const p = ps[i];
			p.addEventListener("click", e => {
				if (!e.altKey) return;
				toggleClass(p, draftData.paragraphs.elements[i], "has-text-align-right");
				elem.output.value = article.innerHTML;
			});
		}
		// altキー + 表をクリック 表の再編集機能
		const tables = elem.demo.getElementsByTagName("table");
		for (let i=0;i<tables.length;i++) {
			const table = tables[i];
			table.addEventListener("click", e => {
				if (!e.altKey) return;
				if (draftData.tables[i].edited === false) {
					window.alert("この表は編集に失敗しているため、再編集機能も使えません。手動で編集してください。");
					return;
				}
				const strong = table.querySelector("strong") || "";
				if (!window.confirm(`この表を再編集（見出し設定を変更）しますか？${strong && "\n【注意】この表の編集後は、この表中にあるstrong(太字)のマーカー編集は行えなくなります。"}`)) return; 
				const param = draftData.tables[i].param;
				console.log(draftData.tables[i]);
				// 入力値を受け取る 現在値で初期化
				const inputs = {
					row: param.theadRows,
					col: param.thColumns,
				};
				if (window.confirm(`上から何行目までを見出し行にするかを変更しますか？\n現在の設定：上から${param.theadRows}行`)) {
					for (let i=0;i<3;i++) {
						let row = prompt(`上から◯行を見出し行にする\n0 から ${param.rowLength} までの間で、整数を半角で入力\n ※やはり変更しない場合はキャンセルをクリック`);
						if (row == null) break; // キャンセル(null)されたら現在値のままbreakする
						row = (row === "" ? -1 : Number(row)); // 空文字列の場合は0にならないよう事前に無効な値-1を代入
						if (isNaN(row) || !Number.isInteger(row) || row < 0 || row > param.rowLength) {
							if (i === 2) {
								window.alert("無効な値が連続で3回入力されました。表の編集機能を実行せずに中止します。");
								return;
							}
							window.alert(`無効な値です。再度入力してください。`);
						} else {
							inputs.row = row;
							break;
						}
					}
				}
				if (window.confirm(`左から何列目までを見出し列にするかを変更しますか？\n現在の設定：左から${param.thColumns}列`)) {
					for (let i=0;i<3;i++) {
						let col = prompt(`左から◯列を見出しにする\n0 から ${param.columnLength} までの間で、整数を半角で入力\n ※やはり変更しない場合はキャンセルをクリック`);
						if (col == null) break; // キャンセル(null)されたら現在値のままbreakする
						col = (col === "" ? -1 : Number(col));
						if (isNaN(col) || !Number.isInteger(col) || col < 0 || col > param.columnLength) {
							if (i === 2) {
								window.alert("無効な値が連続で3回入力されました。表の編集機能を実行せずに中止します。");
								return;
							}
							window.alert(`無効な値です。再度入力してください。`);
						} else {
							inputs.col = col;
							break;
						}
					}
				}
				if (inputs.row === param.theadRows && inputs.col === param.thColumns) {
					window.alert("行数も列数も、表に元々適用されていた値と同じです。表を編集せずに終了します。");
					return;
				}
				// 入力値を元に編集した表elementを取得
				const editedTable = getEditedTable(table, true, inputs.row, inputs.col);
				// article内のtableを置換する
				draftData.tables[i].element.replaceWith(editedTable);
				// デモのtableも更新する（イベントリスナーが無効化しないように実装）
				table.textContent = "";
				table.insertAdjacentHTML("afterbegin", editedTable.innerHTML);
				// draftDataを更新
				draftData.tables[i].element = editedTable;
				draftData.tables[i].param.theadRows = inputs.row;
				draftData.tables[i].param.thColumns = inputs.col;
				// outputを再出力
				elem.output.value = article.innerHTML;
				console.log(draftData.tables);
			});
		}
	}
	
	// draftData用のファクトリ関数
	function gen_draftData() {
		// WPブロック系
		const [headings, images, tables, lists, paragraphs] = Array(5).fill().map(() => []);
		// インライン系
		// strongs（記事中にn個のstrongタグあり、うちm個にマーカーを設定）
		const strongs = {
			count: 0,
			edited: 0, // マーカー付与
			elements: []
		};
		// links（記事中にn個のリンクあり、うちm個を外部リンクと判定し「新しいタブで開く」に設定）
		const links = {
			count: 0,
			edited: 0, // 新しいタブで開く設定
			elements: []
		};
		return {
			headings, images, tables, lists, paragraphs,
			strongs, links
		};
	}

	const RE_OUTPUT_MESSAGE = "すでに編集結果が出力されています。出力欄を一度削除して、再び出力しますか？";

	function main() {
		if (elem.source.value === "") return;
		if (elem.output.value !== "" && !window.confirm(RE_OUTPUT_MESSAGE)) return;

		// 記事情報を抽出・出力
		draftData = gen_draftData();
	
		// 原稿を取得して文字列編集まで済ませる
		const original = elem.source.value.trim();
		let draft = original.cleanUpDraft()
		.removeSpecificBlock(PHRASES.BLANK_PARAGRAPH).trim();

		article = document.createElement("article");
		article.innerHTML = draft;
		editWithDOM();
		// 編集した原稿を出力
		elem.output.value = article.innerHTML;
		animateWithClass(elem.output, "outputting", 700);
	
		// 記事情報を完成させて出力する
		draftData.paragraphs.elements = article.getElementsByTagName("p");

		// デモ表示を行う
		elem.demo.innerHTML = getInnerHTML4Demo(article.innerHTML);
		// プレビュー画面の再編集対象の要素にイベントリスナー設置
		setDemoEditor();
	}

	elem.run.addEventListener("click", () => {
		if (reeditMode) {
			autoEdit = false;
			main();
			console.log("2つの欄の値が同じ", elem.source.value === elem.output.value);
		} else {
			autoEdit = true;
			main();
		}
	});
}