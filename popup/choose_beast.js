// CSS to hide verything on page
const hidePage = 'body > :not(.beastify-image) {
					display: none;
				}';

// Listens for clicks on the buttons to send message to content script
function listenForClicks() {
	document.addEventListenter("click", (e) => {
		// Get corresponding image based on name of animal
		function animalNameToURL (animalName) {
			switch (animalName) {
				case "Frog":
					return browser.runtime.getURL("animals/frog.jpg");
				case "Snake": 
					return browser.runtime.getURL("animals/snake.jpg");
				case "Turtle":
					return browser.runtime.getURL("animals/turtle.jpg");
			}
		}
	})
}

// Insert page-hiding CSS into the active tab, then get the beast URL and send message to
// content script of active tab
function beastify(tabs) {
	browser.tabs.insertCSS({code: hidePage}).then(() => {
		const url = animalNameToURL(e.target.textContent);
		browser.tabs.sendMessage(tabs[0].id, {
			command: "beastify",
			beastURL: url,
		});
	});
}

// Remove CSS and reset
function reset(tabs) {
	browser.tabs.removeCSS({code: hidePage}).then(() => {
		browser.tabs.sendMessage(tabs[0].id, {
			command: "reset",
		});
	});
}

// log the rror to the console
function reportError(error) {
	console.error('Could not beastify: ${error}');
}

// Get active tab and call beastify or reset
if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
	return;
}

if (e.target.type === "reset") {
	browser.tabs
		.query({active: true, currentWindow: true})
		.then(beastify)
		.catch(reportError)
}

function reportExecuteScriptError(error) {
	document.querySelector("#popup-content").classList.add("hidden");
	document.querySelector("#error-content").classList.remove("hidden");
	console.error('Failed to execut beastify content script: ${error.message}');
}

browser.tabs
	.executeScript({file: "/content_scripts/beastify.js"})
	.then(listenForClicks)
	.catch(reportExecuteScriptError)

