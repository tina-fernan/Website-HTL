// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};
		// The length property of the from method is 1.
		return function from(arrayLike /*, mapFn, thisArg */ ) {
			// 1. Let C be the this value.
			var C = this;
			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);
			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError(
					"Array.from requires an array-like object - not null or undefined");
			}
			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError(
						'Array.from: when provided, the second argument must be a function');
				}
				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}
			// 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);
			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method 
			// of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);
			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T,
						kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, "length", len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	}());
}
'use strict';
var myQuiz = {
	container: null,
	// helper function
	createElement: function (o) {
		var el, p;
		if (o && (o.tag || o.tagName)) {
			el = document.createElement(o.tag || o.tagName);
			if (o.text || o.txt) {
				var text = (o.text || o.txt)
				el.innerHTML = text;
			}
			for (p in o) {
				if (!p.match(/^t(e)?xt|tag(name)?$/i)) {
					el[p] = o[p];
				}
			}
		}
		return el;
	},
	// user interface for a quiz question
	createOptions: function () {
		var t = this,
			options = [],
			ul = document.createElement("ul");
		t.emptyContainer();
		t.intoContainer(t.createElement({
			tag: "h2",
			text: "(" + t.currentQuestion.category + ") " + t.currentQuestion.question
		}));
		t.intoContainer(ul);
		// create options
		options.push(t.currentQuestion.solution);
		t.currentQuestion.falses.forEach(function (s) {
			options.push(s);
		});
		t.shuffleArray(options);
		options.forEach(function (s, i) {
			var li = document.createElement("li"),
				label = t.createElement({
					htmlFor: "a" + t.questions.length + "_" + i,
					tag: "label",
					text: s
				}),
				radio = t.createElement({
					id: "a" + t.questions.length + "_" + i,
					name: "answer",
					tag: "input",
					type: "radio",
					tabindex: "0",
					value: s
				});
			ul.appendChild(li);
			li.appendChild(radio);
			li.appendChild(label);
		});
		// Hinweis für Tastatur-User
		// t.intoContainer(t.createElement({
		// 	tag: "button",
		// 	text: "confirm choice",
		// 	type: "submit"
		// }));
	},
	currentChoices: [],
	currentQuestion: null,
	// data could be filled from an external source (JSON)
	data: [{
		category: 'HTML',
		question: 'Was bedeutet die Abkürzung HTML?',
		solution: 'Hypertext Markup Language',
		falses: ['Hightext Markup Link',
			'Hybridtext Markup Language',
			'Hypertool Markup Language'],
		explanation: ''
	}, {
		category: 'HTML',
		question: 'Was bedeutet der Befehl "< H1 Align=“?“ >" ?',
		solution: 'Ausrichtung der Überschrift',
		falses: ['Größe der Überschrift', 'Breite der Überschrift einstellen', 'Farbe der Überschrift'],
		explanation: ''
	}, {
		category: 'HTML',
		question: 'Wie ist eine HTML-Datei unterteilt?',
		solution: 'Head,body',
		falses: ['Img,alt',
			'Table,border',
			'Title,body'],
		explanation: ''
	}, {
		category: 'HTML',
		question: 'Wie fügt man ein Bild ein?',
		solution: ' " < img src=“…“ alt=“…“ > "',
		falses: ['"< picture=“…“ >"',
			'"< href src=“…“ alt=“…“ >"',
			'"< body img=!...! alt=“…“ >"'],
		explanation: ''
	}, {
		category: 'HTML',
		question: 'Von wem und wann wurde HTML veröffentlicht?', //Frage 5 - sind die Antworten bei wechselnder Reihenfolge noch sinnvoll?
		solution: '1992 vom CERN',
		falses: [
			'2005 von Apple',
			'1995 von Java',
			'1990 von Microsoft'],
		explanation: ''
	}, {
		category: 'HTML',
		question: 'Wie lautet der Befehl, um die Hintergrundfarbe rot in einem Dokument einzustellen?',
		solution: 'body bgcolor=“red“',
		falses: ['body backgroundcolor=“red“', 'body bgcolour=“red“',
			'body bg color=“red“'],
		explanation: ''
	}, {
		category: 'Javascript',
		question: 'Was sind die Ursprünge des Internets?',
		solution: 'In den 1960er Jahren das ARPA-Ne',
		falses: ['In den 1970er Haren in wissenschaftlichen Einrichtungen', '1993 mit internetProtokollen', '1980 von einem Wissenschaftler in der Schweiz erfunden'],
		explanation: 'Die Defense Advanced Research Projects Agency (ARPA), eine seit 1958 bestehende wissenschaftliche Einrichtung, deren Forschungsergebnisse in militärische Zwecke einflossen, entschloss sich 1966 zur Vernetzung der ARPA-eigenen Großrechner. Dabei wurde die Idee des "dezentralen Netzwerks" wieder aufgegriffen.'
	}, {
		category: 'Javascript',
		question: 'Client-Server-Technologie: Was muss ein Host-Rechner unbedingt haben um einen Internetdienst anbieten zu können?',
		solution: 'Eine entsprechende Server-Software muss auf dem Rechner aktiv sein, der Rechner muss "online" sein und keine schützende Software (Firewall) die den Zugriff von außen verhindert bzw. einschränkt.',
		falses: ['Einen Client',
			'Eine Server-Software muss auf dem Rechner deaktiviert sein, der Rechner muss „online“ sein und muss eine starke Firewall haben',
			'Nicht, jeder PC kann ohne Besonderheiten ein Host sein'],
		explanation: '' 
	}, {
		category: 'HTML',
		question: 'Was sagt dem Browser: das man sich an den HTML-Standard halten möchte:',
		solution: '< !doctype html >',
		falses: ['< hallo Browser ich verwende html >',
			'< !html doctype',
			'# !doctype html #'],
		explanation: ''
	}, {
		category: 'Javascript',
		question: 'Wofür braucht man Verweise bei Webseiten?',
		solution: 'Um Webseiten miteinander zu verbinden, der Besucher klickt mit der Maus auf den Vereis und gelangt auf die nächste Seite', 
		falses: ['Um die Website größer und wichtiger aussehen zu lasse', 'Um ins Internet verbunden zu sei', 'Man braucht sie nicht, der Besucher kann mit der Maus auf jedes Wort klicken und wird mit der entsprechenden Website verbunden.'],
		explanation: ''
	}, {
		category: 'Javascript',
		question: 'Mit welchem Befehl verlinkt man Seiten?',
		solution: '"< a href="zieldatei.html" >Hier klicken!< / a >"',
		falses: ['< b href=zieldatei.html>Hier klicken!</ b >', '< l href="zieldatei.html">Hier klicken!< / l>',
			'< href="zieldatei.html">Hier klicken!< / >'],
		explanation: ''
	}, {
		category: 'Javascript',
		question: 'Was muss man bei Bildern beachten?',
		solution: 'Sie heißen Images und die Quelle (src), wo sie abgespeichert sind (Pfadangabe), muss angegeben werden, sonst können sie im Browser nicht angezeigt werden.',
		falses: ['Sie heißen Quellen und es muss angegeben werden wer die Rechte an ihnen hat.', 'Die Pfadangabe von Bildern muss nie angegeben werden, der Browser findet sie selbst.', 'Die Bilder müssen schön bunt sein.'],
		explanation: ''
	}, {
		category: 'CSS',
		question: 'Womit macht man HTML-Seiten „schön“?',
		solution: 'Mit CSS',
		falses: ['Mit WWW', 'Mit Java Script',
			'Mit HTML'],
		explanation: ''
	}, {
		category: 'CSS',
		question: 'Wie sehen folgende Funktionen in CSS aus?: Schriftgröße, Hintergrundfarbe und Ausrichtung.',
		solution: '{ font-size: 2.5em; background-color: orange; text-align: center; }',
		falses: ['{ font-size: red; background-color: set; text-align: quadrat; }', '{ schrift-size: 2.5em; hintergrudnfarbe-color: orange; text: center; }',
			'{ size: 2.5em; color: orange; align: center; }'],
		explanation: ''
	}, {
		category: 'Javascript',
		question: 'Was ist die voreingestellte Funktionsweise von Buttons?',
		solution: 'das Versenden eines Formulars',
		falses: ['das Löschen eines Formulars',
			'das Ausfüllen der Daten',
			'das Markieren eines Formulars'],
		explanation: ''
	}, {
		category: 'HTML',
		question: 'Fällt mit HTML-5 eine Serverseitige Validierung von Formularen weg?',
		solution: 'Nein.',
		falses: [
			'Ja',
			'Immer',
			'Nie'
			],
		explanation: ''
	}, {
		question: 'Was macht der Befehl: input type="date"?',
		solution: 'Einen placeholder mit der Formatierung TT.MM.JJJJ',
		falses: ['nichts', 'bei mobilen Geräten und modernen Browsern erscheint ein benutzerunfreundliches Kalenderfeld', 'Validierung'],
		category: 'Javascript'
	}, {
		question: 'Welche Buttons gibt es nicht laut Self-HTML?',
		solution: 'Cake-Buttons',
		falses: [
			'Bonbon-Buttons',
			'Ghost-Buttons',
			'Radio-Buttons'
			],
		category: 'HTML'
	}, {
		category: 'Javascript',
		question: 'Wofür wird Java Script verwendet?',
		solution: 'Um mit dem Browser zu interagieren',
		falses: ['Um mit dem Internet zu interagieren', 'Um mit CSS zu interagieren', 'Um mit HTML zu interagieren'],
		explanation: ''
	}, {
		question: 'Wie lautet der Java Script Befehl zur Anzeige einer Meldung?',
		solution: 'Alert ',
		falses: ['Meldung', 'Brief', 'Pop-up'],
		category: 'Javascript'
	}, {
		question: 'Wie werden Strings gekennzeichnet?',
		solution: 'Mit “ ….. “',
		falses: ['Mit # …#', 'Mit - … -', 'Mit & … &'],
		category: 'Javascript'
	}, {
		category: 'Javascript',
		question: 'Was ist bei Pfd links zu beachten',
		solution: 'Besonders markieren & Dateigröße angebe',
		falses: ['Nichts',
			'Den Dokumentenreader anzugeben, da sonst das Pdf nicht geöffnet werden kann.',
			'mit dem circle-Element interagieren'],
		explanation: ''
	}, {
		category: 'Javascript',
		question: 'Wann verwendet man die Methode GET?',
		solution: 'Ist es der vorrangige Sinn des Formulars, Daten vom Server abzurufen (z. B. eine Suchanfrage), so verwendet man GET;',
		falses: ['ist der Hauptzweck eher das Übermitteln von Daten zum Server (z. B. das Abschicken einer Bestellung an einen Online-Shop), so verwendet man POST.', 'Ist es der vorrangige Sinn des Formulars, Daten an den Server zu schicken (z. B. eine Suchanfrage), so verwendet man GET;', 'ist der Hauptzweck eher das Abrufen von Daten zum Server (z. B. das Abschicken einer Bestellung an einen Online-Shop), so verwendet man POST.'],
		explanation: ''
	}, {
		category: 'Javascript',
		question: 'Wann verwendet man die Methode POST?',
		solution: 'ist der Hauptzweck eher das Übermitteln von Daten zum Server (z. B. das Abschicken einer Bestellung an einen Online-Shop), so verwendet man POST.',
		falses: ['Ist es der vorrangige Sinn des Formulars, Daten an den Server zu schicken (z. B. eine Suchanfrage), so verwendet man GET;', 'ist der Hauptzweck eher das Abrufen von Daten zum Server (z. B. das Abschicken einer Bestellung an einen Online-Shop), so verwendet man POST.',
			'das line-Attribut verwenden'],
		explanation: ''
	}, {
		category: 'HTML',
		question: 'Ein Ghost-Button ist ...',
		solution: 'ein Button, der auf das Minimum reduziert ist',
		falses: ['ein Button, der nur erscheint, wenn man mit der Maus drüber fährt', 'ein Button',
			'der verschwindet, wenn man in den Bereich scrollt'],
		//explanation: 'CSS-Animationen in SVG funktionieren in allen modernen Browsern, aber noch nicht im IE<11.'
	}, {
		category: 'Javascript',
		question: 'Wieso würde ein Formular mit input-Event und output-Element nicht im Internetexplorer funktionieren?',
		solution: 'Der IE verwendet das input-Event nicht korrekt und stellt den Wert (value) des output-Elements nicht dar.',
		falses: ['Der IE verwendet das input-Event überhaupt nicht und es entsteht eine Fehlermeldung', 'Diese Funktion ist dem IE zu komplex.',
			'Diese Funktion ist dem IE zu schwer.'],
		//explanation: 'Umrandungen sind gegenüber CSS3 eine der Stärken von SVG, die in ein CSS Modul fills und strokes übernommen werden sollen. Allerdings sind variable Strichstärken für natürlichere Formen (noch) nicht möglich.'
	}, {
		category: 'HTML',
		question: 'Bei der Erstellung von Formularen soll man placeholder- Attribute ...',
		solution: 'immer verwenden',
		falses: ['nur wenn diese wirklich benötigt werden',
			'gar nicht verwenden',
			'often verwenden'],
		//explanation: 'In SVG 2 werden Größenangaben wie x,y, width und height zu animierbaren Präsentations&shy;eigenschaften. Die CSS-Animation von Transformationen wäre ein guter Weg, ist im Edge jedoch noch nicht möglich. So bleibt nur die Animation der Ranstärke. '
	}, {
		category: 'CSS',
		question: 'Wofür steht CSS?',
		solution: 'Cascading Style Sheets',
		falses: ['Computerized Support Systems',
			'Closed Source Software',
			'Photoshop'
			],
		//explanation: 'Mit dem viewbox-Attrbut können Sie SVG-Grafiken in einem "neuen" Koordinatensystem passend skalieren. Da es keine Präsentations&shy;eigenschaft ist, kann es aber nicht mit CSS animiert werden.'
	}],
	emptyContainer: function () {
		var t = this;
		while (t.container.firstChild) {
			t.container.removeChild(t.container.firstChild);
		}
	},
	handleInput: function () {
		var t = this, // t points to myQuiz
			// create real array so we can use forEach
			inputs = Array.from(t.container.getElementsByTagName("input")),
			selectedSolution = "";
		// determine selection
		inputs.forEach(function (o) {
			if (o.checked) {
				selectedSolution = o.value;
			}
		});
		// process selected answer
		if (selectedSolution && t.currentQuestion) {
			t.currentChoices.push({
				a: selectedSolution,
				q: t.currentQuestion
			});
			t.play();
		}
		// accept start button
		if (!t.currentQuestion) {
			t.play();
		}
	},
	init: function () {
		var t = this;
		// here goes any code for loading data from an external source
		t.container = document.getElementById("quiz");
		if (t.data.length && t.container) {
			// use anonymous functions so in handleInput
			// "this" can point to myQuiz
			t.container.addEventListener("submit", function (ev) {
				t.handleInput();
				ev.stopPropagation();
				ev.preventDefault();
				return false;
			});
			t.container.addEventListener("mouseup", function (ev) {
				// we want to only support clicks on start buttons...
				var go = ev.target.tagName.match(/^button$/i);
				// ... and labels for radio buttons when in a game
				if (ev.target.tagName.match(/^label$/i) && t.currentQuestion) {
					go = true;
				}
				if (go) {
					window.setTimeout(function () {
						t.handleInput();
					}, 50);
					ev.stopPropagation();
					ev.preventDefault();
					return false;
				}
			});
			t.start();
		}
	},
	intoContainer: function (el, parentType) {
		var t = this,
			parent;
		if (!el) {
			return;
		}
		if (parentType) {
			parent = document.createElement(parentType);
			parent.appendChild(el);
		} else {
			parent = el;
		}
		t.container.appendChild(parent);
		return parent;
	},
	// ask next question or end quiz if none are left
	play: function () {
		var t = this,
			ol;
		// game over?
		if (!t.questions.length) {
			t.showResults();
			// offer restart
			window.setTimeout(function () {
				t.start();
			}, 50);
			return;
		}
		t.currentQuestion = t.questions.shift();
		t.createOptions();
	},
	// list with remaining quiz question objects
	questions: [],
	// list original questions and given answers and elaborate on solutions
	showResults: function () {
		var cat, ol, s, scores = {},
			t = this,
			tab, thead, tbody, tr;
		t.emptyContainer();
		// show message
		t.intoContainer(t.createElement({
			tag: "p",
			text: "Sie haben alle Fragen des Quiz beantwortet. Hier die Auswertung Ihrer Antworten:"
		}));
		// list questions and given answers
		ol = t.intoContainer(t.createElement({
			id: "result",
			tag: "ol"
		}));
		t.currentChoices.forEach(function (o) {
			var p, li = ol.appendChild(t.createElement({
				tag: "li"
			}));
			// list original question
			li.appendChild(t.createElement({
				className: "question",
				tag: "p",
				text: "(" + o.q.category + ") " + o.q.question
			}));
			// list given answer
			p = li.appendChild(t.createElement({
				tag: "p",
				text: "Ihre Antwort: "
			}));
			p.appendChild(t.createElement({
				className: (o.q.solution == o.a ? "correct" : "wrong"),
				tag: "em",
				text: o.a
			}));
			// wrong answer?
			if (o.q.solution != o.a) {
				p = li.appendChild(t.createElement({
					tag: "p",
					text: "Die richtige Antwort wäre gewesen: "
				}));
				p.appendChild(t.createElement({
					tag: "em",
					text: o.q.solution
				}));
			}
			// elaborate on solution?
			if (o.q.explanation) {
				p = li.appendChild(t.createElement({
					tag: "p",
					text: "Erläuterung: "
				}));
				p.appendChild(t.createElement({
					tag: "em",
					text: o.q.explanation
				}));
			}
		});
		// display a kind of percentual score over the categories
		cat = [];
		t.currentChoices.forEach(function (o) {
			if (!cat.includes(o.q.category)) {
				cat.push(o.q.category);
			}
		});
		cat.sort();
		cat.forEach(function (c) {
			var correct = 0,
				num = 0;
			t.currentChoices.forEach(function (o) {
				if (o.q.category == c) {
					num++;
					if (o.q.solution == o.a) {
						correct++;
					}
				}
			});
			scores[c] = Math.floor(100 * correct / num) + "%";
		});
		tab = t.intoContainer(t.createElement({
			id: "scores",
			tag: "table"
		}));
		tab.appendChild(t.createElement({
			tag: "caption",
			text: "Übersicht nach Kategorien"
		}))
		thead = tab.appendChild(t.createElement({
			tag: "thead"
		}))
		tr = thead.appendChild(t.createElement({
			tag: "tr"
		}))
		for (s in scores) {
			tr.appendChild(t.createElement({
				tag: "th",
				text: s
			}));
		}
		tbody = tab.appendChild(t.createElement({
			tag: "tbody"
		}))
		tr = tbody.appendChild(t.createElement({
			tag: "tr"
		}))
		for (s in scores) {
			tr.appendChild(t.createElement({
				tag: "td",
				text: scores[s]
			}));
		}
		// show message
		t.intoContainer(t.createElement({
			tag: "p",
			text: "Möchten Sie das Quiz erneut durchspielen?"
		}));
	},
	// helper function: shuffle array (adapted from http://javascript.jstruebig.de/javascript/69)
	shuffleArray: function (a) {
		var i = a.length;
		while (i >= 2) {
			var zi = Math.floor(Math.random() * i);
			var t = a[zi];
			a[zi] = a[--i];
			a[i] = t;
		}
		// no return argument since the array has been
		// handed over as a reference and not a copy!
	},
	// start quiz with a start button
	start: function () {
		var t = this;
		// fill list of remaining quiz questions
		t.questions = [];
		t.data.forEach(function (o) {
			t.questions.push(o);
		});
		t.shuffleArray(t.questions);
		t.currentChoices = [];
		t.currentQuestion = null;
		// install start button
		t.intoContainer(t.createElement({
			className: "startBtn",
			tag: "button",
			text: "Starte Quiz!"
		}), "p");
	}
};
document.addEventListener("DOMContentLoaded", function () {
	myQuiz.init();
});
