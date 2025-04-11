function saveSettingsToLocalStorage() {
	const checkboxes = document.querySelectorAll("input[type=checkbox]");
	const textfields = document.querySelectorAll("input[type=text]");
	const numberfields = document.querySelectorAll("input[type=number]");
	const selects = document.querySelectorAll("select");

	const settings = {};

	checkboxes.forEach((checkbox) => {
		settings[checkbox.name] = checkbox.checked;
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
}


function loadSettingsFromLocalStorage() {
	const saved = localStorage.getItem("chatWidgetSettings");
	if (!saved) return;

	const settings = JSON.parse(saved);

	Object.keys(settings).forEach((key) => {
		const input = document.querySelector(`[name="${key}"]`);
		if (input) {
			if (input.type === "checkbox") {
				input.checked = settings[key];
			} else {
				input.value = settings[key];
			}
		}
	});
}


function pushChangeEvents() {
	const checkboxes = document.querySelectorAll("input[type=checkbox]");
	const textfields = document.querySelectorAll("input[type=text]");
	const numberfields = document.querySelectorAll("input[type=number]");
	const selects = document.querySelectorAll("select");

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
}


function generateUrl() {
	document.getElementById("outputUrl").value = '';

	var runThisLocally = document.querySelector("input[type=checkbox][name=runThisLocally]").checked;
	console.log(runThisLocally);
	var baseUrl = '';

	if (runThisLocally == false) {
		baseUrl = 'https://vortisrd.github.io/chatrd/chat.html'
	}
	
	const checkboxes = document.querySelectorAll("input[type=checkbox]");
	const textfields = document.querySelectorAll("input[type=text]");
	const numberfields = document.querySelectorAll("input[type=number]");
	const selects = document.querySelectorAll("select");

	const params = new URLSearchParams();

	
	selects.forEach((select) => {
		params.set(select.name, select.value);
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

function copyUrl() {
	
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

window.addEventListener('load', () => {
	loadSettingsFromLocalStorage();
	generateUrl();
	pushChangeEvents();
});
