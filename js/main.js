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
