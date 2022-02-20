const clickTouch = 'ontouchstart' in window ? 'touchstart' : 'click'

document.querySelector('#contact-btn').addEventListener(clickTouch, () => {
	document.querySelector('.form-bg').classList.toggle('active')
})

document.querySelector('.form-bg').addEventListener(clickTouch, e => {
	if (e.target.matches('.form-bg')) {
		document.querySelector('.form-bg').classList.toggle('active')
	}
})

function validateEmail(email) {
	return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ? true : false
}

document.querySelector('#submit').addEventListener(clickTouch, e => {
	e.preventDefault()

	const form = document.querySelector('#contact-form')
	const elements = [...form.elements].filter(el => el.type != 'button')
	const data = elements.reduce((acc, el) => {
		el.name === 'email' ? (acc[el.name] = el.value.toLowerCase().trim()) : (acc[el.name] = el.value.trim())
		return acc
	}, {})

	// set red borders
	elements.forEach(el => {
		if (!el.value.trim()) {
			document.querySelector(`#${el.id}`).classList.add('field-error')
		}
	})

	const confirm = document.querySelector('.form-confirmation')

	// return if missing fields
	if (elements.filter(el => el.value === '').length > 0) {
		confirm.classList.add('form-error', 'active')
		confirm.textContent = 'Veuillez remplir tous les champs'
		setTimeout(() => {
			confirm.classList.remove('form-error', 'active')
			setTimeout(() => {
				confirm.textContent = ''
			}, 200)
		}, 5000)
		return
	}

	// return if email not valid
	if (!validateEmail(data.email)) {
		document.querySelector('#email').classList.add('field-error')
		confirm.classList.add('form-error', 'active')
		confirm.textContent = 'Veuillez entrer un courriel valide'
		setTimeout(() => {
			confirm.classList.remove('form-error', 'active')
			setTimeout(() => {
				confirm.textContent = ''
			}, 200)
		}, 5000)
		return
	}

	const formData = new FormData(form)
	fetch('/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(formData).toString(),
	})
		.then(() => {
			form.reset()
			confirm.classList.add('form-success', 'active')
			confirm.textContent = 'Messgage envoyé'
			setTimeout(() => {
				confirm.classList.remove('form-success', 'active')
				document.querySelector('.form-bg').classList.toggle('active')
				setTimeout(() => {
					confirm.textContent = ''
				}, 200)
			}, 5000)
		})
		.catch(error => console.log(error))
})

document.querySelector('#contact-form').addEventListener('change', e => {
	if ([...e.target.classList].includes('field-error')) {
		e.target.classList.remove('field-error')
	}
	if (e.target.value === '') {
		e.target.classList.add('field-error')
	}
})

document.querySelector('#email').addEventListener('blur', e => {
	if (!validateEmail(e.target.value)) {
		e.target.classList.add('field-error')
	}
})
