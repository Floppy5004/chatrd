let streamerBotClient;
let streamerBotConnected = false;

async function saveSettingsToLocalStorage() {
	const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
	const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
	const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
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
	console.log(settings);

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

			var sbstatus = document.getElementById('memberemotesbstatus');

			sbstatus.style.color = '#00dd63';
			sbstatus.textContent = 'Streamer.Bot is Online!';

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

			var sbstatus = document.getElementById('memberemotesbstatus');
			sbstatus.style.color = '#ff0000';
			sbstatus.textContent = 'Streamer.Bot Needs to be Online!';
		}
	});

}


async function pushChangeEvents() {
	const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
	const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
	const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
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
}


async function generateUrl() {
	document.getElementById("outputUrl").value = '';

	var runThisLocally = document.querySelector("input[type=checkbox][name=runThisLocally]").checked;
	var baseUrl = '';

	if (runThisLocally == false) {
		baseUrl = 'https://vortisrd.github.io/chatrd/chat.html'
	}
	
	const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
	const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
	const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
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
	
	const output = document.getElementById("outputUrl");

	output.select();
	document.execCommand("copy");

	const button = document.querySelector('.url-bar button');
	const buttonDefaulText = 'Copy URL';

	button.textContent = 'ChatRD URL Copied!';
	button.style.backgroundColor = "#00dd63";

	setTimeout(() => {
		button.textContent = buttonDefaulText;
		button.removeAttribute('style');
	}, 3000);


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



window.addEventListener('load', () => {
	loadSettingsFromLocalStorage();
	generateUrl();
	pushChangeEvents();
	populateEmoteList();
});