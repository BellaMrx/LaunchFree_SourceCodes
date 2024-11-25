const actions = document.querySelector('.actions');
	const calc = document.querySelector('.calc');
	console.log(actions);
	console.log(calc);
	let expression = '';
	let a=0;
	actions.addEventListener('click', (e) => {
		console.log(e.target);
		const value = e.target.dataset['value'];

		if(value !== undefined) {
			// I'm good to go.
			if(value == 'ce') {
				expression = '';
				calc.value = 0;
				return true;
			}
			else if(value == 'x^2'){
				expression =square();
			}
			
			else if(value == 'radic'){
				expression = Math.sqrt(expression);
			}
			else if(value == 'log'){
				expression = Math.log(expression);
			}
			else if(value == 'sin'){
				expression = Math.sin(expression);
			}
			else if(value == 'cos'){
				expression = Math.cos(expression);
			}
			else if(value == 'tan'){
				expression = Math.tan(expression);
			}

			else if(value == '=') {
				const calcwer = eval(expression);
				expression = calcwer;
				
			} else {
				expression += value;
			}

			if(expression == undefined) {
				expression = '';
				calc.value = 0;
			} else {
				calc.value = expression;
			}
			// expression += value;


		}

	});
	const square =()=> {
			return eval(expression*expression);
	}
