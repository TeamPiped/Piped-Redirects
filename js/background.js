window.browser = window.browser || window.chrome;

const INVIDIOUS_INSTANCES = [];

fetch("https://api.invidious.io/instances.json")
	.then((resp) => resp.json())
	.then((array) => array.forEach((json) => INVIDIOUS_INSTANCES.push(json[0])));

browser.webRequest.onBeforeRequest.addListener(
	(details) => {
		const url = new URL(details.url);
		if (url.hostname.endsWith("youtu.be") && url.pathname.length > 1) {
			return { redirectUrl: "https://piped.kavin.rocks/watch?v=" + url.pathname.substr(1) };
		}
		if (
			url.hostname.endsWith("youtube.com") ||
			url.hostname.endsWith("youtube-nocookie.com") ||
			INVIDIOUS_INSTANCES.includes(url.hostname)
		) {
			url.hostname = "piped.kavin.rocks";
			return { redirectUrl: url.href };
		}
	},
	{
		urls: ["<all_urls>"],
	},
	["blocking"],
);
