"use strict";
{
	// mac用のショートカットキー表示変更
	try {
		const ua = window.navigator.userAgent.toLocaleLowerCase();
		if (ua.indexOf("mac os x") !== -1) {
			const shortcuts = document.getElementsByClassName("shortcut");
			for (let i=0;i<shortcuts.length;i++) {
				shortcuts[i].textContent = shortcuts[i].textContent
				.replace("Ctrl", "Command")
				.replace("Alt", "Option");
			}
		}
 	} catch (error) {
		console.warn(error);
	}
}

// デモ画面の表示関連
{
	const demo = document.getElementById("demo");
	// 表のカウント表示＠サイドバー
	function countTables4Demo() {
		const span = document.getElementById("demo_counttables");
		if (!span) return;
		const count = demo.getElementsByTagName("table").length;
		if (count === 0) {
			span.textContent = "";
		} else {
			span.textContent = `（記事中に全部で${count}つ存在）`;
		}
	}
	// 目次のスクロール機能
	function tocScroll(h, li) {
		const clientRect = h.getBoundingClientRect();
		const height = window.scrollY + clientRect.top;
		window.scrollTo({
			top: height - 60, // ヘッダー分を調整で-60
			behavior: "smooth"
		});
	}
	// 目次表示
	function tocAtDemo() {
		const div = document.getElementById("demo_toc");
		const ol = document.createElement("ol");
		const headings = demo.querySelectorAll("h1, h2, h3, h4, h5, h6");
		for (const h of headings) {
			const li = document.createElement("li");
			// 見出しタグの種別を判定してクラス付与, テキスト設定
			const tag = h.tagName.toLowerCase();
			li.classList.add(`toc_${tag}`);
			li.textContent = `${h.textContent}_${tag}`;
			// 画像を挿入しているかどうか
			const next = h.nextElementSibling;
			const hasImage = (next && next.classList.contains("wp-block-image"));
			if (hasImage) li.textContent += "+img";
			ol.appendChild(li);
			// 目次側の見出しクリックでスクロールするイベントリスナー設置
			li.addEventListener("click", () => {
				try {
					tocScroll(h, li);
				} catch (error) {
					console.warn(error);
				}
			});
		}
		div.textContent = "";
		div.appendChild(ol);
	}
	// 画像ブロックのfigureにtitle属性設定（::before疑似要素によるalt属性値表示用）
	function setTitle2ImageBlocks() {
		const figures = demo.querySelectorAll(".wp-block-image");
		for (const figure of figures) {
			let title = "";
			const img = figure.querySelector("img");
			// もし画像がなければスキップ
			if (!img) {
				figure.removeAttribute("title");
				continue;
			}
			const alt = img.getAttribute("alt");
			if (alt === null || alt === "") {
				title = "【警告: 画像にalt属性値が設定されていません！】";
				figure.classList.add("warning");
			} else {
				title = `alt: "${alt}"`;
			}
			// 直前の見出しを取得して整合性チェック
			const heading = figure.previousElementSibling;
			if (heading.tagName.toUpperCase().match(/^H\d$/) === null) {
				// 直前に見出しがない場合
				title += " 【警告: 画像の前に見出しがありません！】";
				figure.classList.add("warning");
			} else if (alt) {
				// altタグが設定されていて、かつ見出しと異なる場合
				if (alt !== heading.textContent) {
					title += " 【警告: 画像のaltタグと直前の見出しのテキストが異なります！】";
					figure.classList.add("warning");
				}
			}
			figure.setAttribute("title", title);
		}
	}
	
	try {
		const btn = document.getElementById("demotabBtn");
		btn.addEventListener("click", () => {
			countTables4Demo();
			tocAtDemo();
			setTitle2ImageBlocks();
		});
	} catch(error) {
		console.warn(error)
	}
}