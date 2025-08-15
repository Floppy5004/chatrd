let streamerBotClient;
let streamerBotConnected = false;

async function saveSettingsToLocalStorage() {
	const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
	const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
	const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
	const colorfields = document.querySelectorAll("input[type=color]:not(.avoid)");
	const selects = document.querySelectorAll("select:not(.avoid)");
	
	const hiddenField = document.querySelector("textarea[name=youTubeCustomEmotes]:not(.avoid)");

	const ranges = document.querySelectorAll("input[type=range]:not(.avoid)");

	const settings = {};

	checkboxes.forEach((checkbox) => {
		settings[checkbox.name] = checkbox.checked;
	});
	ranges.forEach((range) => {
		settings[range.name] = range.value;
	});
	textfields.forEach((textfield) => {
		settings[textfield.name] = textfield.value;
	});
	numberfields.forEach((numberfield) => {
		settings[numberfield.name] = numberfield.value;
	});
	colorfields.forEach((colorfield) => {
		settings[colorfield.name] = colorfield.value;
	});
	selects.forEach((select) => {
		settings[select.name] = select.value;
	});

	localStorage.setItem("chatWidgetSettings", JSON.stringify(settings));

	if (streamerBotConnected == true) {
		streamerBotClient.doAction(
			{ name : "YouTube Custom Emotes" },
			{
				"chatrdytcustomemotes": JSON.stringify(hiddenField.value.trim()),
			}
		).then( (setglobals) => {
			console.debug('Saving YouTube Emotes from Streamer.Bot', setglobals);
		});
	}

}


async function loadSettingsFromLocalStorage() {
	const saved = localStorage.getItem("chatWidgetSettings");
	if (!saved) return;

	const settings = JSON.parse(saved);
	console.debug(`[ChatRD] Settings`, settings);

	Object.keys(settings).forEach((key) => {
		const input = document.querySelector(`[name="${key}"]`);
		if (input) {
			if (input.type === "checkbox") {
				input.checked = settings[key];
			}
			else {
				input.value = settings[key];
			}
		}
	});


	document.querySelector('#font-value').textContent = Math.floor(document.querySelector('#font-slider').value * 100) + '%';


	var streamerBotServerAddress = document.querySelector('input[type=text][name=streamerBotServerAddress]').value;
	var streamerBotServerPort = document.querySelector('input[type=text][name=streamerBotServerPort]').value;

	streamerBotClient = new StreamerbotClient({
		host: streamerBotServerAddress,
		port: streamerBotServerPort,
		onConnect: (data) => {
			streamerBotConnected = true;

			document.querySelector('#memberemotesbstatus').classList.remove('offline');
			document.querySelector('#memberemotesbstatus').classList.add('online');
			document.querySelector('#memberemotesbstatus span').textContent = 'Streamer.Bot is Online!';

			streamerBotClient.getGlobals().then( (getglobals) => {
				const settings = JSON.parse(getglobals.variables.chatrdytcustomemotes.value);
				console.debug('Getting YouTube Emotes from Streamer.Bot', settings);
				const textarea = document.querySelector("textarea[name=youTubeCustomEmotes]");
				textarea.value = settings;
				
				populateEmoteList();
			});
			
		},
		onDisconnect: () => {
			console.error('Streamer.bot Disconnected!');
			
			streamerBotConnected = false;
			
			document.querySelector('#memberemotesbstatus').classList.remove('online');
			document.querySelector('#memberemotesbstatus').classList.add('offline');
			document.querySelector('#memberemotesbstatus span').textContent = 'Streamer.Bot is Offline!';
		}
	});

}


async function pushChangeEvents() {
	const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
	const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
	const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
	const colorfields = document.querySelectorAll("input[type=color]:not(.avoid)");
	const selects = document.querySelectorAll("select:not(.avoid)");

	const ranges = document.querySelectorAll("input[type=range]:not(.avoid)");

	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('change', () => {
			generateUrl();
			saveSettingsToLocalStorage();
		});
	});
	textfields.forEach((textfield) => {
		textfield.addEventListener('input', () => {
			generateUrl();
			saveSettingsToLocalStorage();
		});
	});
	numberfields.forEach((numberfield) => {
		numberfield.addEventListener('input', () => {
			generateUrl();
			saveSettingsToLocalStorage();
		});
	});
	colorfields.forEach((colorfield) => {		
		colorfield.addEventListener('change', () => {
			generateUrl();
			saveSettingsToLocalStorage();
		});
	});
	selects.forEach((select) => {
		select.addEventListener('change', () => {
			generateUrl();
			saveSettingsToLocalStorage();
		});
	});
	textfields.forEach((textfield) => {
		textfield.addEventListener('input', () => {
			generateUrl();
			saveSettingsToLocalStorage();
		});
	});

	ranges.forEach((range) => {
		range.addEventListener('change', () => {
			generateUrl();
			saveSettingsToLocalStorage();
		});
	});

	document.querySelector('#font-slider').addEventListener('input', function () {
		document.querySelector('#font-value').textContent = Math.floor(this.value * 100) + '%';
	});

	document.querySelector('#bg-opacity-slider').addEventListener('input', function () {
		document.querySelector('#bg-opacity-value').textContent = this.value;
	});
}


async function generateUrl() {
	document.getElementById("outputUrl").value = '';

	
	var baseUrl = 'https://vortisrd.github.io/chatrd/chat.html';
	
	const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
	const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
	const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
	const colorfields = document.querySelectorAll("input[type=color]:not(.avoid)");
	const selects = document.querySelectorAll("select:not(.avoid)");

	const ranges = document.querySelectorAll("input[type=range]:not(.avoid)");

	const params = new URLSearchParams();
	
	selects.forEach((select) => {
		params.set(select.name, select.value);
	});
	ranges.forEach((range) => {
		params.set(range.name, range.value);
	});
	checkboxes.forEach((checkbox) => {
		params.set(checkbox.name, checkbox.checked);
	});
	colorfields.forEach((colorfield) => {
		params.set(colorfield.name, colorfield.value);
	});
	textfields.forEach((textfield) => {
		params.set(textfield.name, textfield.value);
	});
	numberfields.forEach((numberfield) => {
		params.set(numberfield.name, numberfield.value);
	});

	document.getElementById("outputUrl").value = baseUrl + '?' + params.toString();
	document.querySelector('#chat-preview iframe').src = 'chat.html?'+params.toString();
}

async function copyUrl() {

	const output = document.getElementById("outputUrl")
	const value = output.value;
	
	const button = document.querySelector('.url-bar button');
	const buttonDefaulText = 'Copy URL';

	navigator.clipboard.writeText(value)
	.then(() => {

		button.textContent = 'ChatRD URL Copied!';
		button.style.backgroundColor = "#00dd63";

		setTimeout(() => {
			button.textContent = buttonDefaulText;
			button.removeAttribute('style');
		}, 3000);
	})
	.catch(err => {
		console.error("Failed to copy: ", err);
	});

}


async function setupAddEmoteModal() {
	const modal = document.getElementById("addEmoteModal");
	const nameInput = document.getElementById("newEmoteName");
	const urlInput = document.getElementById("newEmoteURL");
	const confirmBtn = document.getElementById("confirmAddEmote");
	const cancelBtn = document.getElementById("cancelAddEmote");
	const addButton = document.querySelector("#youtube .emote-item:last-child .add");
	const textarea = document.querySelector("textarea[name=youTubeCustomEmotes]");

	if (!modal || !addButton || !textarea) return;

	// Show modal
	addButton.onclick = () => {
		if (streamerBotConnected == true) {
			nameInput.value = "";
			urlInput.value = "";
			modal.classList.remove("hidden");
			nameInput.focus();
		}
		else {
			alert("Streamer.bot is Offline!");
			return;
		}
	};

	// Cancel
	cancelBtn.onclick = () => {
		modal.classList.add("hidden");
	};

	// Confirm
	confirmBtn.onclick = () => {
		const name = nameInput.value.trim();
		const url = urlInput.value.trim();

		if (!name || !url) {
			alert("Both fields are required.");
			return;
		}

		let emotes;
		try {
			emotes = JSON.parse(textarea.value);
		} catch (err) {
			console.error("Invalid JSON", err);
			alert("Emote data is invalid.");
			return;
		}

		if (emotes[name]) {
			alert(`Emote "${name}" already exists.`);
			return;
		}

		// Add and update
		emotes[name] = url;
		textarea.value = JSON.stringify(emotes, null, 4);
		modal.classList.add("hidden");
		populateEmoteList();
	};
}



async function populateEmoteList() {
	const textarea = document.querySelector("textarea[name=youTubeCustomEmotes]");
	const emoteList = document.querySelector("#youtube .emote-list");

	if (!textarea || !emoteList) return;

	const addButtonSpan = emoteList.querySelector(".emote-item:last-child");

	// Remove all emote items except the add button
	emoteList.querySelectorAll(".emote-item").forEach(item => {
		if (item !== addButtonSpan) {
			item.remove();
		}
	});

	let emotes;
	try {
		emotes = JSON.parse(textarea.value);
	} catch (e) {
		console.error("Invalid JSON in YouTube Emotes textarea", e);
		return;
	}

	// Recreate each emote item
	for (const [emoteName, emoteUrl] of Object.entries(emotes)) {
		const span = document.createElement("span");
		span.classList.add("emote-item");
		span.innerHTML = `
			<img data-emote="${emoteName}" src="${emoteUrl}" alt="">
			<em>${emoteName}</em>
			<button class="delete"><i class="fa-solid fa-trash-can"></i></button>
		`;

		// Add delete handler directly to the button
		const deleteBtn = span.querySelector(".delete");
		deleteBtn.addEventListener("click", () => {
			if (confirm(`Are you sure you want to delete '${emoteName}'?`)) {
				delete emotes[emoteName];
				textarea.value = JSON.stringify(emotes, null, 4);
				populateEmoteList(); // Re-render everything
			}
		});

		emoteList.insertBefore(span, addButtonSpan);
	}

	setupAddEmoteModal();
	generateUrl();
	saveSettingsToLocalStorage();
}



const accordionButtons = document.querySelectorAll("button.accordion");

accordionButtons.forEach(button => {
	button.addEventListener("click", () => {
		const targetId = button.getAttribute("data-target");
		const target = document.getElementById(targetId);
		const icon = button.querySelector("i");
		
		if (!target || !target.classList.contains("accordion-container")) return;
		
		const isOpen = target.classList.contains("open");
		
		// Fecha todos os outros accordions
		document.querySelectorAll(".accordion-container.open").forEach(container => {
			if (container !== target) {
				container.classList.remove("open");
				container.style.maxHeight = null;

				const otherButton = document.querySelector(`button.accordion[data-target="${container.id}"]`);
				if (otherButton) {
					const otherIcon = otherButton.querySelector("i");
					if (otherIcon) otherIcon.className = "fa-solid fa-chevron-down";
				}
			}
		});
		
		// Alterna o atual
		if (!isOpen) {
			target.classList.add("open");
			target.style.maxHeight = target.scrollHeight + "px";
			if (icon) icon.className = "fa-solid fa-chevron-up";

			// Espera a animação terminar para scrollar
			target.addEventListener("transitionend", function handler(e) {
				if (e.propertyName === "max-height") {
					target.removeEventListener("transitionend", handler);

					const offset = target.getBoundingClientRect().top + window.scrollY - 60;
					window.scrollTo({
						top: offset,
						behavior: "smooth"
					});
				}
			});
		}
		
		else {
			target.classList.remove("open");
			target.style.maxHeight = null;
			if (icon) icon.className = "fa-solid fa-chevron-down";
		}
	});
});







window.addEventListener('load', () => {
	loadSettingsFromLocalStorage();
	generateUrl();
	pushChangeEvents();
	populateEmoteList();

	
	document.querySelectorAll('.nav-bar a').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();

			// Remove todas as classes dos links dentro da nav-bar
			document.querySelectorAll('.nav-bar a').forEach(link => {
				link.classList.remove('active');
			});

			this.classList.add('active');

			const targetId = this.getAttribute('href');
			const targetElement = document.querySelector(targetId);

			if (targetElement) {

				const offset = 60; // ajusta 20px acima
				const y = targetElement.getBoundingClientRect().top + window.scrollY - offset;

				window.scrollTo({
					top: y,
					behavior: 'smooth'
				});
			}
		});
	});


});
